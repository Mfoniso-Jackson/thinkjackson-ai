import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thinkjackson.com"),
  title: {
    default: "Mfoniso Jackson | thinkjackson",
    template: "%s | thinkjackson"
  },
  description:
    "AI systems for markets, agents, and human coordination. The personal platform of Mfoniso Jackson.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Mfoniso Jackson | thinkjackson",
    description:
      "AI systems for markets, agents, and human coordination.",
    url: "https://thinkjackson.com",
    siteName: "thinkjackson",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "thinkjackson - AI systems for markets, agents, and human coordination"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mfoniso Jackson | thinkjackson",
    description:
      "AI systems for markets, agents, and human coordination.",
    images: ["/twitter-image"]
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon"
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
