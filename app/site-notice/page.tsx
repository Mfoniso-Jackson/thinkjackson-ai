import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Site Notice",
  description: "Informational and investment-related disclaimers for thinkjackson.com.",
  alternates: {
    canonical: "/site-notice"
  }
};

export default function SiteNoticePage() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Site notice</p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">Information boundaries.</h1>
          <div className="mt-8 space-y-6 text-base leading-8 text-steel">
            <p>
              Content on this site is informational. It is not financial advice, investment advice, legal advice,
              tax advice, broker-dealer activity, or an offer to sell securities.
            </p>
            <p>
              Venture descriptions are public summaries of systems in different stages of development. Roadmap items,
              long-term visions, and future capabilities are not represented as current production capabilities.
            </p>
            <p>
              Public evidence is linked where available. Revenue, customers, pilots, partnerships, grants, investors,
              funding rounds, performance statistics, and backtest results are not claimed unless explicitly verified.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
