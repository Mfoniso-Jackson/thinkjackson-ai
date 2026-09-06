export type Person = {
  slug: string;
  name: string;
  role: string;
  summary: string;
  believes: readonly string[];
};

/**
 * The people network starts with one verified node. It is built to extend to
 * collaborators, researchers, and podcast guests as real relationships exist —
 * no placeholder people are added ahead of that. Connections to ideas, ventures,
 * and essays live in lib/graph/registry.ts, not duplicated here.
 */
export const people = [
  {
    slug: "mfoniso-jackson",
    name: "Mfoniso Jackson",
    role: "Founder, ThinkJackson",
    summary:
      "Builds AI-native systems that connect financial engineering, autonomous agents, reinforcement-learning research, Web3 coordination, and adaptive decision infrastructure.",
    believes: [
      "Intelligence is moving from individual humans toward systems distributed across humans, machines, agents, networks, markets, and institutions.",
      "An agent that looks competent can still be anchored to a ritual that stopped being causally useful — this is a safety problem, not just a performance problem.",
      "Financial and economic intelligence should be treated as a market of competing views, not a single model's opinion."
    ]
  }
] as const satisfies readonly Person[];

export function getPerson(slug: string) {
  return people.find((person) => person.slug === slug);
}
