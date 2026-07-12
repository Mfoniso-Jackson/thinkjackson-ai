import type { Venture } from "@/lib/venture-types";

const PRIVATE_LINK_PATTERNS = ["localhost", "127.0.0.1", "notion.so/private", "drive.google.com/drive/folders/private"];

export function validateVentures(ventures: readonly Venture[]) {
  const publicVentures = ventures.filter((venture) => venture.public);
  const flagshipVentures = publicVentures.filter((venture) => venture.flagship);

  if (flagshipVentures.length !== 1) {
    throw new Error(`Expected exactly one public flagship venture, found ${flagshipVentures.length}.`);
  }

  for (const venture of publicVentures) {
    const links = [venture.websiteUrl, venture.repositoryUrl, venture.demoUrl, ...venture.evidence.map((item) => item.url)].filter(
      Boolean
    ) as string[];

    for (const link of links) {
      if (PRIVATE_LINK_PATTERNS.some((pattern) => link.includes(pattern))) {
        throw new Error(`Private or local link exposed for ${venture.name}: ${link}`);
      }
    }
  }
}

export function verifiedEvidence(venture: Venture) {
  return venture.evidence.filter((item) => item.verified);
}
