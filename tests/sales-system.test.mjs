import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("sales lead validation covers consent, honeypot, and conditional paths", () => {
  const source = read("lib/sales-validation.ts");

  assert.match(source, /input\.website/);
  assert.match(source, /input\.consent/);
  assert.match(source, /input\.intent === "investor"/);
  assert.match(source, /input\.intent === "grant-provider"/);
  assert.match(source, /input\.intent === "research-collaborator"/);
  assert.match(source, /Active opportunities require a next action/);
});

test("public lead capture preserves source attribution", () => {
  const form = read("components/sales-lead-form.tsx");
  const action = read("app/contact/actions.ts");

  for (const field of ["sourcePage", "campaign", "utmSource", "utmMedium", "utmCampaign", "referrer"]) {
    assert.match(form, new RegExp(`name="${field}"`));
    assert.match(action, new RegExp(field));
  }

  assert.match(action, /SALES_LEAD_WEBHOOK_URL/);
  assert.match(action, /scoreLead/);
});

test("admin routes are protected and not indexable", () => {
  const middleware = read("middleware.ts");
  const layout = read("app/admin/sales/layout.tsx");
  const robots = read("app/robots.ts");

  assert.match(middleware, /ADMIN_SALES_PASSWORD/);
  assert.match(middleware, /\/admin\/sales/);
  assert.match(middleware, /x-robots-tag/);
  assert.match(layout, /index: false/);
  assert.match(robots, /disallow: "\/admin\/"/);
});

test("pipeline config includes active and terminal sales stages", () => {
  const config = read("data/sales-config.ts");

  for (const stage of ["identified", "qualified", "proposal-sent", "negotiation", "won", "lost", "future", "disqualified"]) {
    assert.match(config, new RegExp(stage));
  }

  assert.match(config, /strategicHierarchy/);
  assert.match(config, /ventureCtas/);
});

test("supabase migration enforces RLS and next-action discipline", () => {
  const migration = read("supabase/migrations/20260712120000_sales_operating_system.sql");

  assert.match(migration, /sales_leads/);
  assert.match(migration, /sales_opportunities/);
  assert.match(migration, /active_opportunities_have_next_action/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /service role can manage sales leads/);
});
