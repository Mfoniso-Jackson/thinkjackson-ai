import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice for thinkjackson.com.",
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Privacy</p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">Privacy notice.</h1>
          <div className="mt-8 space-y-6 text-base leading-8 text-steel">
            <p>
              thinkjackson.com collects only the information visitors intentionally submit through contact or investor
              request flows, plus privacy-conscious analytics provided by Vercel Analytics.
            </p>
            <p>
              Investor material requests are intended for qualified conversations. Confidential materials, private
              repositories, financial models, cap tables, customer data, and sensitive technical documents are not
              distributed automatically through the public site.
            </p>
            <p>
              The investor request form requires secure lead-routing infrastructure before production collection.
              Until that is configured, requests should also be sent to hello@thinkjackson.com.
            </p>
            <p>
              To request deletion or correction of submitted information, contact hello@thinkjackson.com.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
