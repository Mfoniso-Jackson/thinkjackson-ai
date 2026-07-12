import type { Metadata } from "next";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { VentureCard } from "@/components/venture-card";
import { publicVentures } from "@/data/ventures";

const productSlugs = ["omniquantai", "massifx", "gratifi", "domusgraph-homegraph", "liquidationguard"];

export const metadata: Metadata = {
  title: "Products",
  description:
    "Product surfaces from thinkjackson across autonomous financial intelligence, quant infrastructure, recognition systems, housing graphs, and crypto risk tooling.",
  alternates: {
    canonical: "/products"
  }
};

export default function ProductsPage() {
  const products = publicVentures.filter((venture) => productSlugs.includes(venture.slug));

  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Products</p>
              <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Product systems emerging from the research thesis.
              </h1>
              <p className="mt-7 text-lg leading-8 text-steel">
                The product surface is not separate from the research. Each system is a commercial testbed for
                machine intelligence, market reasoning, verification, or coordination under uncertainty.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/evidence">View evidence dashboard</Button>
                <Button href="/investors" variant="secondary">
                  Investor brief
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-graphite/60 py-20">
        <Container>
          <SectionHeading eyebrow="Product showcase" title="Infrastructure with clear current boundaries.">
            <p>
              Each product page separates thesis, present artifact, next milestone, risks, and current ask so a
              reader can distinguish what exists from what is being built.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((venture, index) => (
              <Reveal key={venture.slug} delay={index * 0.04}>
                <VentureCard venture={venture} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
