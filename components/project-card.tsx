import Link from "next/link";
import { Card } from "@/components/card";

export function ProjectCard({
  title,
  category,
  summary,
  status,
  href
}: {
  title: string;
  category: string;
  summary: string;
  status: string;
  href: string;
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">{category}</p>
        <span className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-steel">
          {status}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-steel">{summary}</p>
      <Link
        href={href}
        className="mt-6 text-sm font-semibold text-signal hover:text-white"
        aria-label={`Read more about ${title}`}
      >
        View system brief
      </Link>
    </Card>
  );
}
