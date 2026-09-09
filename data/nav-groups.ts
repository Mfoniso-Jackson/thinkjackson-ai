export const navGroups = [
  {
    heading: "Explore",
    links: [
      { label: "Ideas", href: "/ideas" },
      { label: "Map", href: "/map" },
      { label: "Research", href: "/research" },
      { label: "Observatory", href: "/observatory" },
      { label: "Discoveries", href: "/discoveries" },
      { label: "Questions", href: "/questions" },
      { label: "Predictions", href: "/predictions" },
      { label: "Entities", href: "/entities" },
      { label: "People", href: "/people" },
      { label: "Podcast", href: "/podcast" },
      { label: "Ventures", href: "/projects" },
      { label: "Writing", href: "/writing" }
    ]
  },
  {
    heading: "Company",
    links: [
      { label: "Founder", href: "/about" },
      { label: "Investor Brief", href: "/investors" },
      { label: "Evidence", href: "/evidence" },
      { label: "Timeline", href: "/timeline" },
      { label: "Contact", href: "/contact" }
    ]
  }
] as const;
