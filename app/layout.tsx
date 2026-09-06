import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ExecutionCommandPalette } from "@/components/execution-command-palette";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thinkjackson.com"),
  title: {
    default: "Mfoniso Jackson | thinkjackson",
    template: "%s | thinkjackson"
  },
  description:
    "An evolving map of the emergence of intelligence, and a laboratory for discovering what that emergence makes possible. The research and venture platform of Mfoniso Jackson.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Mfoniso Jackson | thinkjackson",
    description:
      "An evolving map of the emergence of intelligence, and a laboratory for discovering what that emergence makes possible.",
    url: "https://thinkjackson.com",
    siteName: "thinkjackson",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "thinkjackson - mapping the emergence of intelligence"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mfoniso Jackson | thinkjackson",
    description:
      "An evolving map of the emergence of intelligence, and a laboratory for discovering what that emergence makes possible.",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://thinkjackson.com/#person",
        name: "Mfoniso Jackson",
        url: "https://thinkjackson.com",
        sameAs: [
          "https://www.linkedin.com/in/mfoniso-jackson/",
          "https://x.com/mrjacksonsays",
          "https://github.com/Mfoniso-Jackson"
        ],
        knowsAbout: [
          "Artificial intelligence",
          "Autonomous agents",
          "Agent economy",
          "Financial engineering",
          "Reinforcement learning",
          "AI safety",
          "Portfolio intelligence",
          "Web3 coordination",
          "Economic coordination"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://thinkjackson.com/#website",
        name: "thinkjackson",
        url: "https://thinkjackson.com",
        description:
          "An evolving map of the emergence of intelligence, and a laboratory for discovering what that emergence makes possible."
      }
    ]
  };

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="pointer-events-none fixed inset-0 grid-mask opacity-70" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Analytics />
        <ExecutionCommandPalette />
      </body>
    </html>
  );
}
