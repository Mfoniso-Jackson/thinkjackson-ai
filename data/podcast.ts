export type PodcastEpisode = {
  slug: string;
  title: string;
  guestName: string;
  summary: string;
  ideaSlugs: readonly string[];
  publishedAt: string;
  url?: string;
};

export const podcast = {
  name: "The Trans-Intelligence Podcast",
  tagline: "Conversations with the people redefining intelligence.",
  thesis:
    "Not another AI podcast about model releases. This show exists to ask what happens as intelligence moves from something humans hold individually to something distributed across machines, agents, networks, markets, and institutions — and to have that conversation with the researchers, builders, and skeptics closest to each layer of that transition.",
  themes: [
    "What is intelligence?",
    "Can machines think?",
    "Can agents become autonomous?",
    "How do agents coordinate?",
    "How do agents establish identity?",
    "How do agents establish trust?",
    "Can agents develop emergent behaviours?",
    "Can agents participate in markets?",
    "Can machines transact with machines?",
    "Can autonomous systems form institutions?",
    "What happens when intelligence becomes abundant?",
    "What happens when intelligence becomes networked?"
  ],
  guestDomains: [
    "Frontier AI research",
    "Reinforcement learning",
    "AI economics",
    "Agent systems and the agentic web",
    "AI and finance",
    "Philosophy of intelligence",
    "Neuroscience and cognition",
    "Collective intelligence",
    "Robotics",
    "AI infrastructure",
    "Crypto and economic coordination",
    "AI safety"
  ]
} as const;

/**
 * No episodes have been recorded yet. This array stays empty until a real
 * conversation exists — the podcast page shows an honest "coming soon" state
 * instead of fabricated episodes.
 */
export const episodes: readonly PodcastEpisode[] = [];
