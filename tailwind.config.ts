import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./emails/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1A3FA0",
          50: "#EEF2FF",
          100: "#DBEAFE",
          200: "#BFD0F7",
          300: "#8AAAE9",
          400: "#4268C5",
          500: "#2B52B3",
          600: "#1A3FA0",
          700: "#15348A",
          800: "#102873",
          900: "#0B1C5C",
        },
        cyan: {
          DEFAULT: "#29ABE2",
          50: "#E8F7FD",
          100: "#D0EFFA",
          400: "#29ABE2",
          500: "#1E96CC",
          600: "#1880B0",
        },
        brand: {
          primary: "#1A3FA0",
          secondary: "#29ABE2",
          light: "#EEF2FF",
          surface: "#F8FAFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #1A3FA0 0%, #29ABE2 100%)",
        "gradient-card":
          "linear-gradient(145deg, #ffffff 0%, #F8FAFF 100%)",
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(26, 63, 160, 0.08)",
        "card-hover": "0 8px 32px 0 rgba(26, 63, 160, 0.16)",
        "step": "0 4px 24px 0 rgba(26, 63, 160, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
