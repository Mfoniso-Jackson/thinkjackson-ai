import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SubmitForm } from "@/components/submit-form";
import { CTASection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "Submit to the Map",
  description:
    "Is your work missing from ThinkJackson's knowledge graph? Submit research, a person, a company, a project, a question, or a correction. It goes through the same Scout, Researcher, and Librarian pipeline as everything else, reviewed by a human before anything publishes.",
  alternates: {
    canonical: "/submit"
  }
};

export default function SubmitPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Submit to the map</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Is your work missing from the map?
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                Submit research, a person, a company, a project, a question, or a correction. It runs through the
                same Scout, Researcher, and Librarian pipeline as everything else ThinkJackson discovers on its own,
                reviewed by a human before anything joins the public graph.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <div className="max-w-2xl">
            <SubmitForm />
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
