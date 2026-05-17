import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00B894",
          50:  "#E6FAF6",
          100: "#B3EFDF",
          200: "#80E4C8",
          300: "#4DD9B1",
          400: "#26CE9F",
          500: "#00B894",
          600: "#009A7C",
          700: "#007C64",
          800: "#005E4C",
          900: "#003F34",
        },
        brand: {
          teal:   "#00B894",
          dark:   "#1A2332",
          orange: "#F39C12",
          red:    "#E74C3C",
          blue:   "#3498DB",
          purple: "#9B59B6",
          gray:   "#F8F9FA",
        },
      },
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
        display: ["'Clash Display'", "'Be Vietnam Pro'", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card:   "0 2px 16px rgba(0,0,0,0.06)",
        float:  "0 8px 32px rgba(0,184,148,0.18)",
        bottom: "0 -2px 16px rgba(0,0,0,0.06)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;