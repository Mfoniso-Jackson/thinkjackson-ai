import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {children ? <div className="mt-4 text-base leading-7 text-steel">{children}</div> : null}
    </div>
  );
}
