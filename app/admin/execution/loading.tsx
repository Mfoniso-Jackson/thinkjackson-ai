export default function ExecutionLoading() {
  return (
    <div className="animate-pulse space-y-5" aria-busy="true" aria-label="Loading execution OS">
      <div className="h-3 w-40 rounded bg-white/10" />
      <div className="h-64 rounded-lg border border-line bg-white/[0.035]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-24 rounded-lg border border-line bg-white/[0.035]" />
        <div className="h-24 rounded-lg border border-line bg-white/[0.035]" />
      </div>
    </div>
  );
}
