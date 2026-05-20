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
          foam: "#F8F6EB",
          sand: "#F4E1A1",
          gold: "#E5B428",
          sea: "#1498D5",
          tide: "#0E6AA8",
          deep: "#163A70",
          palm: "#0D8D3B",
          leaf: "#5FBF2E"
        }
      },
      boxShadow: {
        soft: "0 20px 45px rgba(22, 58, 112, 0.12)",
        surf: "0 30px 80px rgba(20, 152, 213, 0.22)"
      },
      backgroundImage: {
        "brand-sky":
          "radial-gradient(circle at top, rgba(20, 152, 213, 0.22), transparent 38%), linear-gradient(180deg, #fff9e8 0%, #f8f6eb 45%, #ffffff 100%)"
      }
    }
  },
  plugins: []
};

export default config;
