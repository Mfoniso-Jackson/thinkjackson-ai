import type { ComponentType } from "react";

export type WritingMetadata = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: readonly string[];
  sections: readonly string[];
};

export type WritingPost = WritingMetadata & {
  Component: ComponentType;
};
