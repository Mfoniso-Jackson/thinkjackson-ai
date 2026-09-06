import Link from "next/link";
import { cn } from "@/lib/utils";

type NodeCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  summary: string;
  badge?: string;
  footer?: string;
  titleSize?: "md" | "lg";
};

/**
 * The shared card shape for any single-destination node in the idea graph —
 * currently used by ideas and people. Ventures keep their own VentureCard:
 * a venture card exposes several distinct actions (brief, deck, website),
 * not one click-through, so folding it in here would either drop those
 * actions or bloat this component's API for one exceptional case.
 */
export function NodeCard({ href, eyebrow, title, summary, badge, footer, titleSize = "md" }: NodeCardProps) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col rounded-lg border border-line bg-white/[0.035] p-6 transition hover:border-signal/35 active:border-signal/50"
    >
      {badge ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
            {badge}
          </span>
        </div>
      ) : null}
      <p className={cn("font-mono text-xs uppercase tracking-[0.22em] text-signal", badge ? "mt-5" : undefined)}>
        {eyebrow}
      </p>
      <h3 className={cn("mt-3 font-semibold text-white", titleSize === "lg" ? "text-2xl" : "text-xl")}>{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-steel">{summary}</p>
      {footer ? (
        <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
          {footer}
        </p>
      ) : null}
    </Link>
  );
}
