import Link from "next/link";
import { Container } from "@/components/container";
import { navigation } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink/80">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
            thinkjackson
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-steel">
            AI systems for markets, agents, and human coordination. Research,
            product architecture, and founder-grade execution by Mfoniso Jackson.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-3 md:justify-end" aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-steel hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
