import Link from "next/link";
import { Container } from "@/components/container";
import { navigation } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/78 backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="group inline-flex min-w-0 items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-signal"
          aria-label="thinkjackson home"
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
              <span>think</span>
              <span className="text-signal">jackson</span>
            </span>
            <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-steel/80 lg:block">
              machine intelligence
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
      <div className="border-t border-line md:hidden">
        <Container className="flex gap-1 overflow-x-auto py-2" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-steel"
            >
              {item.label}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  );
}
