import { Button } from "@/components/button";
import { Container } from "@/components/container";

export function CTASection() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-lg border border-signal/25 bg-signal/[0.06] p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Conversation path</p>
          <div className="mt-4 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Interested in the venture portfolio or the systems behind it?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-steel">
                Aligned investors, grant providers, pilot customers, strategic partners, and research collaborators
                can request the appropriate next conversation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button href="/investors">Investor Brief</Button>
              <Button href="/contact" variant="secondary">
                Start a Conversation
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
