"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Content inside Reveal is visible by default — no JS, no observer, and no
 * animation library is a prerequisite for reading it. On capable browsers,
 * an IntersectionObserver adds a CSS-only fade-up the first time a section
 * that starts off-screen scrolls into view. Elements already in the initial
 * viewport are left alone so nothing animates on page load.
 */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    node.style.setProperty("--reveal-delay", `${delay}s`);
    node.classList.add("reveal-pending");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.remove("reveal-pending");
          node.classList.add("reveal-in");
          observer.disconnect();
        }
      },
      { rootMargin: "-80px 0px", threshold: 0 }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}
