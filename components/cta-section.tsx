import { Container } from "@/components/container";
import { SalesCtaGroup } from "@/components/sales-cta";

export function CTASection() {
  return (
    <section className="py-20">
      <Container>
        <SalesCtaGroup sourcePage="site-cta-section" />
      </Container>
    </section>
  );
}
