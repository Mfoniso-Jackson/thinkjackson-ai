import { Card } from "@/components/card";

export function ResearchCard({
  eyebrow,
  title,
  summary,
  signal
}: {
  eyebrow: string;
  title: string;
  summary: string;
  signal: string;
}) {
  return (
    <Card>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-volt">{eyebrow}</p>
      <h3 className="mt-4 text-xl font-semibold leading-7 text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-steel">{summary}</p>
      <p className="mt-5 border-t border-line pt-4 font-mono text-xs leading-5 text-signal">
        {signal}
      </p>
    </Card>
  );
}
