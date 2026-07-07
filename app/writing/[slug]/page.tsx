import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { getRelatedWritingPosts, getWritingPost, writingPosts } from "@/lib/writing";
import { formatDate } from "@/lib/utils";

type WritingPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return writingPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getWritingPost(slug);

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
  const post = getWritingPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedWritingPosts(post.slug);
  const PostContent = post.Component;

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

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <div className="max-w-3xl">
              <PostContent />
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="rounded-lg border border-line bg-white/[0.035] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">In this essay</p>
                <nav aria-label="Essay sections" className="mt-5 space-y-3">
                  {post.sections.map((section, index) => (
                    <Link
                      key={section}
                      href={`#section-${index + 1}`}
                      className="block text-sm leading-6 text-steel transition hover:text-white"
                    >
                      {section}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-sm leading-6 text-steel">
                    Part of the thinkjackson writing system on AI systems for
                    markets, agents, and human coordination.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-20 border-t border-line pt-10">
            <h2 className="text-2xl font-semibold text-white">Continue reading</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {relatedPosts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/writing/${item.slug}`}
                  className="rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35 hover:bg-white/[0.055]"
                >
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel">
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                    <span aria-hidden="true">/</span>
                    <span>{item.readingTime}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-7 text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </article>
      <CTASection />
    </>
  );
}
