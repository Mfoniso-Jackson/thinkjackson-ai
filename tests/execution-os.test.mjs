import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("mission schema enforces three tasks, time, confidence, evidence, and enums", () => {
  const source = read("lib/execution-types.ts");
  assert.match(source, /\.max\(3\)/); assert.match(source, /confidenceBefore.*min\(1\).*max\(10\)/s); assert.match(source, /expectedEvidence/); assert.match(source, /primaryRisk/); assert.match(source, /availableTimeMinutes.*max\(480\)/s);
});

test("quality validator rejects over-budget, generic, non-actionable, and repeated missions", () => {
  const source = read("lib/mission-quality.ts");
  for (const check of ["taskMinutes > availableMinutes", "weakOpeners", "actionVerb", "recentTitles", "successMetric"]) assert.match(source, new RegExp(check.replace(/[>]/g, "\\>")));
});

test("AI provider uses strict structured output and has no fabricated fallback", () => {
  const source = read("lib/ai/mission-provider.ts");
  assert.match(source, /\/v1\/responses/); assert.match(source, /type: "json_schema"/); assert.match(source, /strict: true/); assert.match(source, /missionSchema\.safeParse/); assert.match(source, /AbortController/); assert.doesNotMatch(source, /fallbackMission|mockMission/);
});

test("actions enforce auth, ownership, rate limits, partial regeneration, and validation", () => {
  const source = read("app/admin/execution/actions.ts");
  assert.match(source, /requireExecutionOwner/); assert.match(source, /getProject\(owner/); assert.match(source, /rateLimit/); assert.match(source, /\[options\.field\]/); assert.match(source, /missionSchema\.parse/); assert.match(source, /completeStoredMission/);
});

test("database models missions, tasks, reviews, evidence, logs, and RLS", () => {
  const source = read("supabase/migrations/20260722150000_ai_founder_execution_os.sql");
  for (const table of ["execution_projects", "execution_missions", "execution_mission_tasks", "execution_evidence", "execution_mission_reviews", "execution_ai_logs"]) assert.match(source, new RegExp(table));
  assert.match(source, /one_active_execution_mission_per_owner/); assert.match(source, /enable row level security/); assert.match(source, /service_role/);
});

test("mission UI exposes required inputs, field regeneration, recovery, and keyboard controls", () => {
  const generator = read("components/mission-generator.tsx"); const palette = read("components/execution-command-palette.tsx"); const today = read("components/active-mission.tsx");
  for (const label of ["Project *", "Available time *", "Energy *", "Regenerate", "Retry", "Start mission", "Save as draft"]) assert.match(generator, new RegExp(label.replace("*", "\\*")));
  assert.match(palette, /event\.key === "Escape"/); assert.match(palette, /event\.metaKey \|\| event\.ctrlKey/); assert.match(today, /Complete mission/); assert.match(today, /Evidence produced/);
});
