import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: {
    index: false,
    follow: false
  }
};

export default function NewsletterAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-12 sm:py-16">
      <Container>{children}</Container>
    </section>
  );
}
