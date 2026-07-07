import MachineEconomiesPost, {
  metadata as machineEconomiesMetadata
} from "@/content/writing/machine-economies-need-coordination-primitives.mdx";
import PortfolioIntelligencePost, {
  metadata as portfolioIntelligenceMetadata
} from "@/content/writing/portfolio-intelligence-is-not-a-dashboard.mdx";
import AgentRitualPost, {
  metadata as agentRitualMetadata
} from "@/content/writing/when-agents-keep-the-ritual.mdx";
import type { WritingPost } from "@/lib/writing-types";

export const writingPosts = [
  {
    ...agentRitualMetadata,
    Component: AgentRitualPost
  },
  {
    ...portfolioIntelligenceMetadata,
    Component: PortfolioIntelligencePost
  },
  {
    ...machineEconomiesMetadata,
    Component: MachineEconomiesPost
  }
].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) satisfies WritingPost[];

export function getWritingPost(slug: string) {
  return writingPosts.find((post) => post.slug === slug);
}

export function getRelatedWritingPosts(slug: string) {
  return writingPosts.filter((post) => post.slug !== slug).slice(0, 2);
}
