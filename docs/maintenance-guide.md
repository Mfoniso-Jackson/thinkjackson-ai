# Maintenance Guide

## Weekly

- Review broken links across venture evidence and social profiles.
- Add any new public repositories, essays, or release notes to `data/evidence.ts`.
- Confirm the investor form webhook is still configured if collecting private requests.

## Monthly

- Refresh venture stages, risks, and next milestones in `data/ventures.ts`.
- Review whether any source-pending metrics can be replaced with verified numbers.
- Publish at least one research note, field note, or evidence update.

## Before Major Launch

- Confirm all public claims with source artifacts.
- Add a real newsletter/waitlist backend if capture is needed.
- Add Supabase tables for evidence records if metrics are changing often.
- Run `npm run lint` and `npm run build`.
- Check shared previews on LinkedIn, X, WhatsApp, and Slack.
