import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sand: "#F5EFE4",
          sea: "#0E5A6E",
          deep: "#073B4C",
          coral: "#E29578"
        }
      },
      boxShadow: {
        soft: "0 20px 45px rgba(7, 59, 76, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
