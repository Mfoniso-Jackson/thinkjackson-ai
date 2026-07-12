# Sales System Audit

## Current Repository

- Framework: Next.js App Router, TypeScript, Tailwind CSS, MDX.
- Deployment: Vercel-ready static/server hybrid.
- Analytics: Vercel Analytics with typed event helper in `lib/analytics.ts`.
- Public content: typed venture data, MDX writing, evidence dashboard, sitemap, RSS.
- Forms: investor-only server action existed before this build.
- Database: no active database client was present.
- Authentication: no existing authentication system was present.
- Email/notifications: no configured email provider was present.

## Reusable Infrastructure

- Server actions are already accepted by the app architecture.
- Venture metadata in `data/ventures.ts` can power CTA context.
- Security headers already exist in `next.config.ts`.
- Public proof logic already exists in `data/evidence.ts`.

## Missing Infrastructure

- Real CRM storage.
- Supabase client/env configuration.
- Authenticated user/session model.
- Notification provider.
- Calendar/scheduling link.
- Unit/integration test framework.
- CSV import/export implementation.

## Security Concerns

- Private CRM data must not be committed to the repository.
- Admin routes require authentication and `noindex`.
- Lead capture must route through server-side environment variables only.
- Revenue, user, customer, investor, and pipeline metrics require source-backed records before publication.

## Implementation Risk

The strongest safe implementation in the current stack is a protected, storage-ready Sales OS foundation: typed models, public lead capture, scoring, admin routes, Supabase-ready migration, and explicit empty states. Live CRUD should be connected only after a private database and auth model are configured.
