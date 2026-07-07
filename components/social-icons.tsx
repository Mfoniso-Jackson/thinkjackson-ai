export type SocialKind = "linkedin" | "x";

export function SocialIcon({
  className,
  kind
}: {
  className?: string;
  kind: SocialKind;
}) {
  if (kind === "x") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13.86 10.47 21.15 2h-1.73l-6.33 7.36L8.03 2H2.2l7.64 11.12L2.2 22h1.73l6.68-7.77L15.95 22h5.83l-7.92-11.53Zm-2.36 2.75-.77-1.1L4.57 3.3H7.2l4.97 7.11.77 1.1 6.48 9.28h-2.63l-5.29-7.57Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.34 3.5a2.08 2.08 0 1 1 0 4.16 2.08 2.08 0 0 1 0-4.16ZM3.55 8.98h3.58V20.5H3.55V8.98ZM9.38 8.98h3.43v1.57h.05c.48-.9 1.65-1.85 3.39-1.85 3.63 0 4.3 2.39 4.3 5.49v6.31h-3.57v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.38V8.98Z" />
    </svg>
  );
}
