import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Open Loops",
  robots: {
    index: false,
    follow: false
  }
};

export default function QuestionsAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-12 sm:py-16">
      <Container>{children}</Container>
    </section>
  );
}
