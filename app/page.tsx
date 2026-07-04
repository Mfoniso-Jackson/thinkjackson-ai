import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { CTASection } from "@/components/cta-section";
import { ProjectCard } from "@/components/project-card";
import { ResearchCard } from "@/components/research-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { WritingCard } from "@/components/writing-card";
import { focusItems, projects, researchThemes, writing } from "@/data/site";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <Container>
          <div className="max-w-5xl">
            <Reveal>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">
                Mfoniso Jackson
              </p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                AI systems for markets, agents, and human coordination.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-steel sm:text-xl">
                thinkjackson.ai is the research and builder platform of an AI engineer
                working across financial engineering, reinforcement learning, autonomous
                agents, safety, Web3 coordination systems, and portfolio intelligence.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/research">Explore Research</Button>
                <Button href="/consulting" variant="secondary">
                  Work With Me
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="mt-20 grid gap-4 md:grid-cols-3">
            {["Research-grade systems", "Market-aware agents", "Coordination infrastructure"].map(
              (item, index) => (
                <Reveal key={item} delay={index * 0.08}>
                  <div className="rounded-lg border border-line bg-white/[0.035] p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-volt">
                      0{index + 1}
                    </p>
                    <p className="mt-4 text-lg font-semibold text-white">{item}</p>
                  </div>
                </Reveal>
              )
            )}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/70 py-20">
        <Container>
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
                Manifesto
              </p>
              <p className="text-2xl font-medium leading-10 text-white">
                The interesting frontier is not simply making models more capable. It is
                building systems that remember risk, understand incentives, resist false
                rituals, and help humans coordinate around decisions too complex for static
                software.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Research themes" title="Where machine behavior meets markets.">
            <p>
              The research program treats agents, portfolios, protocols, and human decision
              systems as adaptive machines operating under uncertainty.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {researchThemes.map((theme, index) => (
              <Reveal key={theme.title} delay={index * 0.04}>
                <ResearchCard {...theme} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Featured projects" title="Systems with research inside them.">
            <p>
              Each project is a different way of asking the same question: how should
              intelligent systems allocate attention, capital, trust, and action?
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <Reveal key={project.title} delay={index * 0.06}>
                <ProjectCard {...project} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading eyebrow="Current focus" title="The near-field work.">
              <p>
                Mfoniso is focused on the bridge between original research and systems
                that can operate in live economic environments.
              </p>
            </SectionHeading>
            <div className="grid gap-3">
              {focusItems.map((item) => (
                <Reveal key={item}>
                  <div className="rounded-lg border border-line bg-white/[0.035] p-5 text-base leading-7 text-white">
                    {item}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Selected writing" title="Field notes from the edge.">
            <p>
              Placeholder essays are wired through local data arrays now and can be promoted
              into MDX entries as the writing library grows.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {writing.map((post, index) => (
              <Reveal key={post.title} delay={index * 0.06}>
                <WritingCard {...post} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
