import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        muted: "var(--color-muted)"
      },
      boxShadow: {
        soft: "0 15px 45px -20px rgba(0, 0, 0, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
