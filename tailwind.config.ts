import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8E7",
        brand: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309"
        },
        leaf: {
          700: "#166534",
          800: "#14532D",
          900: "#052E16"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
