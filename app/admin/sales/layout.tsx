import type { Metadata } from "next";
import { Container } from "@/components/container";
import { AdminSalesNav } from "@/components/admin-sales";

export const metadata: Metadata = {
  title: {
    default: "Sales OS",
    template: "%s | Sales OS"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function SalesAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <AdminSalesNav />
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
