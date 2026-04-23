import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#64748b",
        surface: "#f8fafc",
        line: "#e2e8f0",
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          500: "#0891b2",
          600: "#0e7490",
          700: "#155e75"
        },
        accent: {
          500: "#16a34a",
          600: "#15803d"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
