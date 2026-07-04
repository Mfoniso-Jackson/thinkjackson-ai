import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05070b",
        graphite: "#0a0f18",
        panel: "#0f1722",
        line: "rgba(191, 219, 254, 0.13)",
        signal: "#8be9d7",
        volt: "#d7f171",
        steel: "#9fb3c8"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(139, 233, 215, 0.13)"
      }
    }
  },
  plugins: []
};

export default config;
