import type { ReactNode } from "react";
import Link from "next/link";

export function Callout({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-8 rounded-lg border border-signal/25 bg-signal/10 p-5">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">{title}</p>
      <div className="mt-3 text-sm leading-7 text-steel">{children}</div>
    </aside>
  );
}

export function Principle({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="my-8 rounded-lg border border-line bg-white/[0.035] p-5">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-steel">{label}</p>
      <div className="mt-3 text-base leading-8 text-white">{children}</div>
    </div>
  );
}

export function ResearchNote({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 border-l border-signal pl-5 text-sm leading-7 text-steel">
      {children}
    </div>
  );
}

export function References({
  items,
  title = "References / Further Reading"
}: {
  items: readonly {
    title: string;
    source: string;
    href: string;
    note: string;
  }[];
  title?: string;
}) {
  return (
    <section className="mt-14 rounded-lg border border-line bg-white/[0.035] p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <article key={item.href} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
            <Link
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-base font-semibold text-signal hover:text-white"
            >
              {item.title}
            </Link>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-steel/80">{item.source}</p>
            <p className="mt-2 text-sm leading-6 text-steel">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
