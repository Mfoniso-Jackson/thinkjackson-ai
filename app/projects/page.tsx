import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "AI, quant, Web3, and data intelligence projects by Mfoniso Jackson."
};

export default function ProjectsPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Projects</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Product systems for intelligence, capital, trust, and adaptive decision-making.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                These projects translate the research agenda into infrastructure: autonomous
                quant systems, coordination protocols, portfolio engines, and decision graphs.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="System briefs" title="Featured builds." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.04}>
                <div id={project.slug}>
                  <ProjectCard {...project} />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
