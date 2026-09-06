import Link from "next/link";
import { Container } from "@/components/container";
import { SocialIcon } from "@/components/social-icons";
import { navGroups } from "@/data/nav-groups";
import { navigation, socialLinks } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/78 backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="group inline-flex min-w-0 items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-signal"
          aria-label="ThinkJackson home"
        >
          <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-signal/45 bg-graphite shadow-[0_0_32px_rgba(139,233,215,0.16)] transition group-hover:border-signal">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal to-transparent" />
            <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-volt shadow-[0_0_18px_rgba(215,241,113,0.75)]" />
            <span className="font-mono text-[13px] font-extrabold tracking-[-0.02em] text-white">
              TJ
            </span>
          </span>
          <span className="min-w-0">
            <span className="flex items-baseline text-[15px] font-semibold leading-none tracking-normal text-white">
              <span>Think</span>
              <span className="text-signal">Jackson</span>
            </span>
            <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-steel/80 lg:block">
              intelligence observatory
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-steel transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-signal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/investors"
          className="hidden rounded-md bg-signal px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-signal sm:inline-flex"
        >
          Investor Brief
        </Link>
      </Container>
      <details className="group border-t border-line md:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 text-sm font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
          <span>Menu</span>
          <span aria-hidden="true" className="text-steel transition group-open:rotate-180">
            ▾
          </span>
        </summary>
        <nav aria-label="Mobile navigation" className="border-t border-line px-5 py-5">
          <div className="grid gap-6 sm:grid-cols-3">
            {navGroups.map((group) => (
              <div key={group.heading}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">{group.heading}</p>
                <ul className="mt-3 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block min-h-11 py-1 text-sm text-steel hover:text-white active:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">Connect</p>
              <ul className="mt-3 space-y-3">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    {"href" in item ? (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-11 items-center gap-1.5 py-1 text-sm text-signal hover:text-white active:text-white"
                      >
                        <SocialIcon kind={item.kind} className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1.5 py-1 text-sm text-signal">
                        <SocialIcon kind={item.kind} className="h-4 w-4" />
                        <span>{item.label}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </details>
    </header>
  );
}
