import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#080c0f",
        "bg-card": "#0d1318",
        "bg-surface": "#0a1a25",
        "border-default": "#0e2a35",
        "text-primary": "#e0f8ff",
        "text-secondary": "#4a8a9a",
        "text-muted": "#1a4a5a",
        "accent-cyan": "#00bfff",
        "accent-teal": "#00c896",
        "accent-blue": "#4d9fff",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
