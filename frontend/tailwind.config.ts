import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f6f7fb",
        line: "#d9deea",
        panel: "#ffffff",
        ink: "#1d2433",
        muted: "#667189",
        primary: "#3559e6",
        "primary-soft": "#e9eeff",
        "reporter-soft": "#eef3ff",
        "internal-soft": "#f2f4f7",
        "risk-high-soft": "#ffe8e8",
        "risk-med-soft": "#fff5dc",
        "risk-low-soft": "#e8f7ec"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(20, 27, 45, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
