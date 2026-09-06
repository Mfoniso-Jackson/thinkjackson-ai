"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";

type Emphasis = "default" | "github" | "linkedin";

function detectEmphasis(): Emphasis {
  if (typeof document === "undefined" || !document.referrer) return "default";
  try {
    const host = new URL(document.referrer).hostname;
    if (host.includes("github.com")) return "github";
    if (host.includes("linkedin.com")) return "linkedin";
  } catch {
    // malformed or opaque referrer — fall through to default
  }
  return "default";
}

const variants: Record<Emphasis, { primary: { href: string; label: string }; secondary: { href: string; label: string } }> = {
  default: {
    primary: { href: "/ideas", label: "Explore the ideas" },
    secondary: { href: "/research", label: "Read the research" }
  },
  github: {
    primary: { href: "/projects", label: "View the ventures" },
    secondary: { href: "/ideas", label: "Explore the ideas" }
  },
  linkedin: {
    primary: { href: "/ideas", label: "Explore the ideas" },
    secondary: { href: "/writing", label: "Read the writing" }
  }
};

/**
 * Renders the default CTA pair immediately — what every crawler and every
 * first paint sees — then swaps to a referrer-matched pair after mount, only
 * for the two channels with a real, checkable domain: someone arriving from
 * a GitHub repo link is probably here for the ventures; someone from
 * LinkedIn is probably here for the ideas or writing. Everything else,
 * including direct traffic, keeps the default. There's no reliable way to
 * detect "arrived from a podcast platform," and inventing one for a show
 * with zero episodes published yet would be adapting to a channel that
 * doesn't functionally exist.
 */
export function ReferrerAwareHeroCtas() {
  const [emphasis, setEmphasis] = useState<Emphasis>("default");

  useEffect(() => {
    setEmphasis(detectEmphasis());
  }, []);

  const { primary, secondary } = variants[emphasis];

  return (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
      <Button href={primary.href}>{primary.label}</Button>
      <Button href={secondary.href} variant="secondary">
        {secondary.label}
      </Button>
    </div>
  );
}
