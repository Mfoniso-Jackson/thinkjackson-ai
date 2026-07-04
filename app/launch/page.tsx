import type { Metadata } from "next";
import { Container } from "@/components/container";
import { launchPost } from "@/data/site";

export const metadata: Metadata = {
  title: "Launch Post",
  description: "Launch copy for introducing thinkjackson."
};

export default function LaunchPage() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="max-w-4xl">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-signal">Launch draft</p>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            {launchPost.title}
          </h1>
          <p className="mt-7 text-lg leading-8 text-steel">
            Draft copy for announcing the site once the domain, email, and first content layer are live.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-line bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold text-white">LinkedIn</h2>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-steel">{launchPost.linkedin}</p>
          </article>
          <article className="rounded-lg border border-line bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold text-white">Short post</h2>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-steel">{launchPost.short}</p>
          </article>
        </div>
      </Container>
    </section>
  );
}
