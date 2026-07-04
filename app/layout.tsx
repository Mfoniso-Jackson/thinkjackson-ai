import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thinkjackson.ai"),
  title: {
    default: "Mfoniso Jackson | thinkjackson.ai",
    template: "%s | thinkjackson.ai"
  },
  description:
    "AI systems for markets, agents, and human coordination. The personal platform of Mfoniso Jackson.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Mfoniso Jackson | thinkjackson.ai",
    description:
      "AI systems for markets, agents, and human coordination.",
    url: "https://thinkjackson.ai",
    siteName: "thinkjackson.ai",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mfoniso Jackson | thinkjackson.ai",
    description:
      "AI systems for markets, agents, and human coordination."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="pointer-events-none fixed inset-0 grid-mask opacity-70" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
