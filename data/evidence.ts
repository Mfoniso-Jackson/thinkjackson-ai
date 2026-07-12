import { publicVentures } from "@/data/ventures";
import { writingPosts } from "@/lib/writing";
import { verifiedEvidence } from "@/lib/venture-validation";

export type EvidenceCategory = "production" | "research" | "market" | "financial" | "growth";

export type EvidenceArtifact = {
  id: string;
  title: string;
  category: EvidenceCategory;
  date: string;
  type: string;
  ventureSlug?: string;
  ventureName?: string;
  description: string;
  url?: string;
  verified: boolean;
};

export type EvidenceMetric = {
  label: string;
  value: string;
  category: EvidenceCategory;
  status: "verified" | "needs-source-data";
  description: string;
};

export type TimelineEvent = {
  date: string;
  title: string;
  category: EvidenceCategory;
  description: string;
  href?: string;
};

export const evidenceCategoryLabels: Record<EvidenceCategory, string> = {
  production: "Production evidence",
  research: "Research evidence",
  market: "Market evidence",
  financial: "Financial evidence",
  growth: "Growth evidence"
};

const repositoryEvidence: EvidenceArtifact[] = publicVentures.flatMap((venture) =>
  verifiedEvidence(venture)
    .filter((item) => item.url?.includes("github.com"))
    .map((item) => ({
      id: `${venture.slug}-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: item.label,
      category: venture.stage === "research" ? "research" : "production",
      date: "2026-07-12",
      type: "Public repository",
      ventureSlug: venture.slug,
      ventureName: venture.name,
      description: item.description,
      url: item.url,
      verified: true
    }))
);

const writingEvidence: EvidenceArtifact[] = writingPosts.map((post) => ({
  id: `writing-${post.slug}`,
  title: post.title,
  category: post.tags.some((tag) => tag.toLowerCase().includes("research")) ? "research" : "market",
  date: post.date,
  type: "Published essay",
  description: post.excerpt,
  url: `https://thinkjackson.com/writing/${post.slug}`,
  verified: true
}));

export const evidenceArtifacts = [...repositoryEvidence, ...writingEvidence].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date)
) satisfies EvidenceArtifact[];

export const evidenceMetrics = [
  {
    label: "Public venture briefs",
    value: String(publicVentures.length),
    category: "production",
    status: "verified",
    description: "Investor-readable system pages currently published on thinkjackson."
  },
  {
    label: "Verified public artifacts",
    value: String(evidenceArtifacts.length),
    category: "production",
    status: "verified",
    description: "Repositories and essays with public links that can be inspected now."
  },
  {
    label: "Published essays",
    value: String(writingPosts.length),
    category: "research",
    status: "verified",
    description: "MDX writing pieces in the local publishing system."
  },
  {
    label: "Customer interviews",
    value: "Needs source",
    category: "market",
    status: "needs-source-data",
    description: "Requires founder-maintained interview log before appearing as a number."
  },
  {
    label: "Revenue",
    value: "Not public",
    category: "financial",
    status: "needs-source-data",
    description: "No revenue figure is shown until it is founder-approved and source-backed."
  },
  {
    label: "Active users",
    value: "Needs source",
    category: "growth",
    status: "needs-source-data",
    description: "Requires analytics or product database export before publication."
  }
] satisfies EvidenceMetric[];

export const timelineEvents = [
  {
    date: "2026-07-12",
    title: "Evidence dashboard and investor operating layer added",
    category: "production",
    description:
      "thinkjackson moved beyond a portfolio site into an evidence-first platform with explicit proof, risks, asks, and diligence pathways.",
    href: "/evidence"
  },
  {
    date: "2026-07-12",
    title: "Public venture briefs consolidated",
    category: "production",
    description:
      "OmniQuantAI, MassifX, GratiFi, DomusGraph, LiquidationGuard, SentinIQ, and Computational Superstition RL were represented in a shared venture data model.",
    href: "/projects"
  },
  {
    date: "2026-07-09",
    title: "MassifX repository integrated",
    category: "production",
    description:
      "MassifX was positioned as risk-first AI quant infrastructure with paper trading as the deliberate v1 boundary.",
    href: "/projects/massifx"
  },
  {
    date: "2026-07-08",
    title: "DomusGraph repository integrated",
    category: "production",
    description:
      "DomusGraph / HomeGraph was framed as a structured intelligence layer for rental-property operations and verified housing events.",
    href: "/projects/domusgraph-homegraph"
  },
  {
    date: "2026-07-07",
    title: "Computational Superstition essay published",
    category: "research",
    description:
      "The flagship essay introduced proxy persistence and non-causal stabilization as a research lens for adaptive agents.",
    href: "/writing/computational-superstition-in-reinforcement-learning"
  }
] satisfies TimelineEvent[];

export function artifactsByCategory(category: EvidenceCategory) {
  return evidenceArtifacts.filter((artifact) => artifact.category === category);
}
