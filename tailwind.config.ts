import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canton: {
          black: "#06090F",
          navy: "#0C1220",
          cyan: "#00D1FF",
          gold: "#D4A017",
          text: "#E8EDF5",
          muted: "#8B95A5",
        },
        background: "#06090F",
        surface: "#0C1220",
        primary: {
          DEFAULT: "#00D1FF",
          50: "#E6FAFF",
          100: "#B8F1FF",
          200: "#7AE6FF",
          300: "#3DDAFF",
          400: "#00D1FF",
          500: "#00A7CC",
          600: "#007D99",
          700: "#005466",
          800: "#002A33",
          900: "#00151A",
        },
        accent: {
          DEFAULT: "#D4A017",
          light: "#F0C24A",
          dark: "#8F6B0F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderColor: {
        hairline: "rgba(0, 209, 255, 0.12)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,209,255,0.18), 0 0 24px -4px rgba(0,209,255,0.35)",
        "glow-lg":
          "0 0 0 1px rgba(0,209,255,0.22), 0 0 60px -10px rgba(0,209,255,0.55)",
        gold: "0 0 0 1px rgba(212,160,23,0.25), 0 0 28px -6px rgba(212,160,23,0.45)",
        card: "0 8px 30px -12px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "canton-radial":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,209,255,0.18), transparent 70%)",
        "canton-gradient":
          "linear-gradient(135deg, #00D1FF 0%, #7AE6FF 45%, #D4A017 100%)",
        grid: "linear-gradient(to right, rgba(0,209,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,209,255,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        // Named "grid-cell" (not "grid") so it does not collide with the
        // background-image utility of the same name.
        "grid-cell": "48px 48px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55", transform: "scale(0.96)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        canton: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
