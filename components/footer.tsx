import Link from "next/link";
import { Container } from "@/components/container";
import { SocialIcon } from "@/components/social-icons";
import { navigation, socialLinks } from "@/data/site";

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
          <p className="mt-4 max-w-xl text-xs leading-5 text-steel/80">
            Informational only. Nothing on this site is financial advice, investment advice,
            brokerage activity, or an offer to sell securities.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-3 md:justify-end" aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-steel hover:text-white">
              {item.label}
            </Link>
          ))}
          {socialLinks.map((item) => (
            "href" in item ? (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1.5 text-sm text-signal hover:text-white"
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.label} profile`}
              >
                <SocialIcon kind={item.kind} className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 text-sm text-signal"
                aria-label={`${item.label}: ${item.handle}`}
              >
                <SocialIcon kind={item.kind} className="h-4 w-4" />
                <span>{item.label}</span>
              </span>
            )
          ))}
          <Link href="/privacy" className="text-sm text-steel hover:text-white">
            Privacy
          </Link>
          <Link href="/site-notice" className="text-sm text-steel hover:text-white">
            Site notice
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
