import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = { title: "Execution OS", robots: { index: false, follow: false } };
const links = [{ href: "/admin/execution", label: "Generate" }, { href: "/admin/execution/today", label: "Today" }, { href: "/admin/execution/context", label: "Project context" }, { href: "/admin/sales/evidence", label: "Evidence" }, { href: "/admin/sales", label: "Sales OS" }];

export default function ExecutionLayout({ children }: { children: React.ReactNode }) {
  return <section className="py-10 sm:py-14"><Container><nav className="flex gap-2 overflow-x-auto border-b border-line pb-4" aria-label="Execution OS navigation">{links.map((link) => <Link key={link.href} href={link.href} className="min-h-10 whitespace-nowrap rounded-md border border-line px-3 py-2 text-sm text-steel transition-colors hover:border-signal/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">{link.label}</Link>)}</nav><div className="mt-10">{children}</div></Container></section>;
}
