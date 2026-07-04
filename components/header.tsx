import Link from "next/link";
import { Container } from "@/components/container";
import { navigation } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/78 backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-signal"
          aria-label="thinkjackson.com home"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-signal/40 bg-signal/10 font-mono text-xs font-bold text-signal">
            TJ
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">
            thinkjackson.com
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
          href="/contact"
          className="hidden rounded-md border border-line px-3.5 py-2 text-sm font-medium text-white transition hover:border-signal/70 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-signal sm:inline-flex"
        >
          Start a conversation
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
