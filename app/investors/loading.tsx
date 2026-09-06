import { Container } from "@/components/container";

export default function InvestorsLoading() {
  return (
    <section className="py-24 sm:py-32" aria-busy="true" aria-label="Loading investor brief">
      <Container>
        <div className="max-w-5xl animate-pulse space-y-4">
          <div className="h-3 w-40 rounded bg-white/10" />
          <div className="h-12 w-full max-w-3xl rounded bg-white/10" />
          <div className="h-4 w-full max-w-2xl rounded bg-white/5" />
          <div className="h-4 w-2/3 max-w-xl rounded bg-white/5" />
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-lg border border-line bg-white/[0.035]" />
          ))}
        </div>
      </Container>
    </section>
  );
}
