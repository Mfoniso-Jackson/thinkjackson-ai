import { Container } from "@/components/container";

export default function ContactLoading() {
  return (
    <section className="py-24 sm:py-32" aria-busy="true" aria-label="Loading contact page">
      <Container>
        <div className="max-w-3xl animate-pulse space-y-4">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="h-10 w-full max-w-xl rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/5" />
        </div>
        <div className="mt-10 h-96 max-w-2xl animate-pulse rounded-lg border border-line bg-white/[0.035]" />
      </Container>
    </section>
  );
}
