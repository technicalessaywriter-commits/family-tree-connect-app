import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        moss: "#3f6f52",
        fern: "#79a66f",
        clay: "#b66b4f",
        gold: "#d5a642",
        paper: "#f7f4ec"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(23, 32, 27, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
