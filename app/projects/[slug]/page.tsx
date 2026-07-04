import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/site";

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
              <p className="mt-7 text-lg leading-8 text-steel">{project.thesis}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-md border border-line bg-white/5 px-3 py-2 font-mono text-xs text-steel">
                  {project.status}
                </span>
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
              <h2 className="mt-4 text-3xl font-semibold text-white">What this project is trying to make tractable.</h2>
            </div>
            <p className="text-lg leading-8 text-steel">{project.problem}</p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
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
            <div>
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
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
