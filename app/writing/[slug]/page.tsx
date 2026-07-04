import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { writing } from "@/data/site";
import { formatDate } from "@/lib/utils";

type WritingPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return writing.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = writing.find((item) => item.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/writing/${post.slug}`
    }
  };
}

export default async function WritingDetailPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const post = writing.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/writing" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white">
              Writing
            </Link>
            <div className="mt-8 max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">/</span>
                <span>{post.readingTime}</span>
              </div>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {post.title}
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-signal">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-16 max-w-3xl space-y-12">
            {post.body.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                <div className="mt-5 space-y-5 text-base leading-8 text-steel">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </article>
      <CTASection />
    </>
  );
}
