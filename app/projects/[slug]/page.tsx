import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { OmniQuantDiagram } from "@/components/omniquant-diagram";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/site";
import { getWritingPost } from "@/lib/writing";
import { formatDate } from "@/lib/utils";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`
    }
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const relatedWriting =
    "relatedWritingSlugs" in project
      ? project.relatedWritingSlugs.map((postSlug) => getWritingPost(postSlug)).filter((post) => post !== undefined)
      : [];

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Link href="/projects" className="font-mono text-xs uppercase tracking-[0.24em] text-signal hover:text-white">
              Projects
            </Link>
            <div className="mt-8 max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-volt">{project.category}</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {project.title}
              </h1>
              {"positioning" in project ? (
                <p className="mt-5 text-2xl font-semibold leading-9 text-signal">{project.positioning}</p>
              ) : null}
              {"subtitle" in project ? (
                <p className="mt-4 max-w-3xl text-lg leading-8 text-steel">{project.subtitle}</p>
              ) : (
                <p className="mt-7 text-lg leading-8 text-steel">{project.thesis}</p>
              )}
              {"heroCopy" in project ? (
                <div className="mt-8 max-w-3xl space-y-4 text-base leading-7 text-steel">
                  {project.heroCopy.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              {"categories" in project ? (
                <div className="mt-7 flex flex-wrap gap-2">
                  {project.categories.map((category) => (
                    <span key={category} className="rounded-md border border-line bg-white/5 px-2.5 py-1 font-mono text-xs text-steel">
                      {category}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-md border border-line bg-white/5 px-3 py-2 font-mono text-xs text-steel">
                  {project.status}
                </span>
                {"architectureLayers" in project ? (
                  <>
                    <Button href="/research/computational-superstition">View Research</Button>
                    <Button href="#architecture" variant="secondary">
                      Explore Architecture
                    </Button>
                  </>
                ) : null}
                {"githubUrl" in project ? (
                  <Button href={project.githubUrl} variant="secondary">
                    View GitHub
                  </Button>
                ) : null}
                <Button href="/contact" variant="secondary">
                  Discuss this system
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Problem</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                {"problems" in project
                  ? "Financial intelligence is still produced like software from the last generation."
                  : "What this project is trying to make tractable."}
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-steel">{project.problem}</p>
              {"problems" in project ? (
                <div className="mt-6 grid gap-3">
                  {project.problems.map((item) => (
                    <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm leading-6 text-steel">
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {"solutionTitle" in project && "marketFlow" in project ? (
        <section className="py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Solution</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">{project.solutionTitle}</h2>
                <p className="mt-5 text-base leading-7 text-steel">{project.solution}</p>
              </div>
              <div className="grid gap-3">
                {project.marketFlow.map((item, index) => (
                  <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-5">
                    <p className="font-mono text-xs text-volt">0{index + 1}</p>
                    <p className="mt-3 text-sm leading-6 text-steel">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <section id="architecture" className={"architectureLayers" in project ? "border-y border-line bg-graphite/60 py-20" : "py-20"}>
        <Container>
          {"architectureLayers" in project ? (
            <>
              <div className="max-w-3xl">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Architecture</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Seven layers of the Financial Intelligence Network.</h2>
              </div>
              <div className="mt-10">
                <OmniQuantDiagram />
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {project.architectureLayers.map((layer, index) => (
                  <article key={layer.title} className="rounded-lg border border-line bg-white/[0.035] p-6">
                    <p className="font-mono text-xs text-volt">0{index + 1}</p>
                    <h3 className="mt-4 text-xl font-semibold text-white">{layer.title}</h3>
                    <ul className="mt-5 space-y-2 text-sm leading-6 text-steel">
                      {layer.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Architecture</p>
                <div className="mt-6 space-y-3">
                  {project.architecture.map((item) => (
                    <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-5 text-sm leading-6 text-steel">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Roadmap</p>
              <div className="mt-6 space-y-3">
                {project.roadmap.map((item, index) => (
                  <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-5">
                    <p className="font-mono text-xs text-volt">0{index + 1}</p>
                    <p className="mt-3 text-sm leading-6 text-steel">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            {relatedWriting.length > 0 ? (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Related writing</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">The thesis layer behind the build.</h2>
                <div className="mt-6 space-y-4">
                  {relatedWriting.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/writing/${post.slug}`}
                      className="block rounded-lg border border-line bg-white/[0.035] p-5 transition hover:border-signal/35 hover:bg-white/[0.055]"
                    >
                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-steel">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span aria-hidden="true">/</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold leading-7 text-white">{post.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-steel">{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
