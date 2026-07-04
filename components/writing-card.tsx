import { Card } from "@/components/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export function WritingCard({
  title,
  excerpt,
  date,
  readingTime,
  tags,
  slug
}: {
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: readonly string[];
  slug?: string;
}) {
  const href = slug ? `/writing/${slug}` : "/writing";

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel">
        <time dateTime={date}>{formatDate(date)}</time>
        <span aria-hidden="true">/</span>
        <span>{readingTime}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-7 text-white">
        <Link href={href} className="hover:text-signal">
          {title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-steel">{excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-signal">
            {tag}
          </span>
        ))}
      </div>
      <Link href={href} className="mt-6 inline-flex text-sm font-semibold text-signal hover:text-white">
        Read field note
      </Link>
    </Card>
  );
}
