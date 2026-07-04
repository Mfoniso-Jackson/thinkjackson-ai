import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2 focus:ring-offset-ink",
        variant === "primary"
          ? "bg-signal text-ink hover:bg-white"
          : "border border-line bg-white/5 text-white hover:border-signal/70 hover:bg-white/10",
        className
      )}
    >
      {children}
    </Link>
  );
}
