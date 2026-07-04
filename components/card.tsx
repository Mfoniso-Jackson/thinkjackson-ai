import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-lg border border-line bg-white/[0.035] p-6 shadow-glow backdrop-blur-sm transition hover:border-signal/35 hover:bg-white/[0.055]",
        className
      )}
    >
      {children}
    </article>
  );
}
