import type { ReactNode } from "react";

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
