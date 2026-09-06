import Link from "next/link";
import { Container } from "@/components/container";
import { NewsletterForm } from "@/components/newsletter-form";
import { SocialIcon } from "@/components/social-icons";
import { socialLinks } from "@/data/site";

const footerGroups = [
  {
    heading: "Explore",
    links: [
      { label: "Ideas", href: "/ideas" },
      { label: "Research", href: "/research" },
      { label: "People", href: "/people" },
      { label: "Podcast", href: "/podcast" },
      { label: "Ventures", href: "/projects" },
      { label: "Writing", href: "/writing" }
    ]
  },
  {
    heading: "Company",
    links: [
      { label: "Founder", href: "/about" },
      { label: "Investor Brief", href: "/investors" },
      { label: "Evidence", href: "/evidence" },
      { label: "Timeline", href: "/timeline" },
      { label: "Contact", href: "/contact" }
    ]
  }
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink/80">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">thinkjackson</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-steel">
            An evolving map of the emergence of intelligence, and a laboratory for discovering what that emergence
            makes possible. Research, ideas, and ventures by Mfoniso Jackson.
          </p>
          <p className="mt-4 max-w-xl text-xs leading-5 text-steel/80">
            Informational only. Nothing on this site is financial advice, investment advice,
            brokerage activity, or an offer to sell securities.
          </p>
          <div className="mt-6 max-w-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">The Intelligence Brief</p>
            <NewsletterForm sourcePage="/footer" className="mt-3" />
          </div>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.heading} aria-label={`Footer: ${group.heading}`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">{group.heading}</p>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-steel hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Footer: Connect">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">Connect</p>
          <ul className="mt-4 space-y-3">
            {socialLinks.map((item) => (
              <li key={item.label}>
                {"href" in item ? (
                  <Link
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
                    className="inline-flex items-center gap-1.5 text-sm text-signal"
                    aria-label={`${item.label}: ${item.handle}`}
                  >
                    <SocialIcon kind={item.kind} className="h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            ))}
            <li>
              <Link href="/rss.xml" className="text-sm text-steel hover:text-white">
                RSS
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 py-5 text-xs text-steel/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} thinkjackson. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/site-notice" className="hover:text-white">
              Site notice
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
