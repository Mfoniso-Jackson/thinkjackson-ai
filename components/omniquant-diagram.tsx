const flow = [
  "Research request",
  "Seller agents",
  "Buyer evaluation",
  "Intelligence delivery",
  "Settlement",
  "Knowledge network"
] as const;

const agentTypes = ["Macro", "Risk", "Portfolio", "News", "Valuation"] as const;

export function OmniQuantDiagram() {
  return (
    <div className="rounded-lg border border-line bg-ink/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
            System flow
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            From research demand to network memory.
          </h3>
        </div>
        <div className="rounded-md border border-signal/30 bg-signal/10 px-3 py-2 font-mono text-xs text-signal">
          agent market loop
        </div>
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-6">
        {flow.map((step, index) => (
          <div key={step} className="relative rounded-lg border border-line bg-white/[0.035] p-4">
            <p className="font-mono text-[11px] text-volt">0{index + 1}</p>
            <p className="mt-3 min-h-10 text-sm font-semibold leading-5 text-white">{step}</p>
            {index < flow.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute -right-2 top-1/2 hidden h-px w-4 bg-signal/50 lg:block"
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-line bg-white/[0.035] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">
            Specialist sellers
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {agentTypes.map((agent) => (
              <span key={agent} className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-steel">
                {agent} Agent
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white/[0.035] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">
            Evaluation packet
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {["Price", "Reasoning", "Confidence", "Delivery"].map((item) => (
              <span key={item} className="rounded-md border border-line px-2.5 py-2 text-center font-mono text-xs text-steel">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
