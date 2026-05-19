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
        "bg-base": "#1B1D21",
        "bg-card": "#32363C",
        "bg-surface": "#272A2F",
        "border-default": "rgba(255,255,255,0.08)",
        "text-primary": "#EDEFF3",
        "text-secondary": "#D5D8DE",
        "text-muted": "#8A8F98",
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
