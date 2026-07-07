declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { WritingMetadata } from "@/lib/writing-types";

  export const metadata: WritingMetadata;
  const MDXContent: ComponentType;
  export default MDXContent;
}
