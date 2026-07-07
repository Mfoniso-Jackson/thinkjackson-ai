import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => <h2 className="mt-12 text-2xl font-semibold text-white" {...props} />,
    h3: (props) => <h3 className="mt-10 text-xl font-semibold text-white" {...props} />,
    p: (props) => <p className="mt-5 text-base leading-8 text-steel" {...props} />,
    a: ({ href = "", ...props }) => {
      const isExternal = href.startsWith("http");
      const className = "text-signal underline-offset-4 hover:text-white hover:underline";

      return isExternal ? (
        <a href={href} target="_blank" rel="noreferrer" className={className} {...props} />
      ) : (
        <Link href={href} className={className} {...props} />
      );
    },
    ul: (props) => <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-8 text-steel" {...props} />,
    ol: (props) => <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-8 text-steel" {...props} />,
    li: (props) => <li className="pl-1" {...props} />,
    strong: (props) => <strong className="font-semibold text-white" {...props} />,
    blockquote: (props) => (
      <blockquote className="my-8 border-l border-line pl-5 text-lg leading-8 text-white" {...props} />
    ),
    ...components
  };
}
