import { Button } from "@/components/button";
import { Container } from "@/components/container";

export function CTASection() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-lg border border-signal/25 bg-signal/[0.06] p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Contact</p>
          <div className="mt-4 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Building an AI system where market logic, agent behavior, and coordination matter?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-steel">
                Bring the hard shape of the problem: ambiguous incentives, moving data,
                uncertain rewards, brittle workflows, or research that needs to become a product.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button href="/consulting">Work With Me</Button>
              <Button href="/contact" variant="secondary">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
