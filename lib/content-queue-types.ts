export const contentTypes = ["launch", "newsletter", "signal", "research", "framework", "build"] as const;
export type ContentType = (typeof contentTypes)[number];

export const contentStatuses = ["idea", "drafted", "scheduled", "published"] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export type ContentQueueItem = {
  id: string;
  title: string;
  contentType: ContentType;
  status: ContentStatus;
  body: string | null;
  notes: string | null;
  publishedUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
