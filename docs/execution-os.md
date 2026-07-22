# AI-assisted Execution OS

The private founder operating system lives at `/admin/execution` and is protected by the same HTTP Basic Auth boundary as the Sales OS.

## Architecture

- Next.js server components load owned project and active-mission records.
- Client components handle editable proposals, request state, keyboard controls, timers, and completion review forms.
- Server actions revalidate every payload with Zod, recheck Basic Auth, and resolve projects through `owner_id` before access.
- `lib/ai/mission-provider.ts` defines a provider interface and an OpenAI Responses API implementation. It requests strict JSON Schema output, then validates the result again with Zod.
- `lib/mission-quality.ts` applies deterministic time, task-count, action-verb, evidence, metric, outcome, and repetition checks.
- Supabase REST is called only from server-only code with the service-role key. RLS denies direct public access.
- AI logs retain model, latency, usage, success, and validation status—not prompts or hidden reasoning.

## Setup

1. Apply `supabase/migrations/20260722150000_ai_founder_execution_os.sql` to the private Supabase project.
2. If `ADMIN_SALES_USERNAME` differs from `mfoniso`, update the two seed-row `owner_id` values before applying the migration.
3. Configure the variables in `.env.example` in local development and Vercel.
4. Open `/admin/execution`, generate a proposal, edit it, then save or start it.

Without Supabase configuration, seeded project context remains visible for generation, but persistence actions return an explicit configuration error. Without an OpenAI key, generation returns an explicit error and never invents fallback content.

## Privacy and publishing

Project context and evidence are private by default. Setting evidence visibility to `portfolio` or `public` records intent only; no public page automatically publishes the record. Public rendering should require a separate explicit publishing action.

## Weekly review readiness

Completed missions, review records, evidence, risk classification, confidence movement, actual metrics, and timestamps provide the data required for a later weekly review and investor-update generator.
