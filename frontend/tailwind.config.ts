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
          DEFAULT: "#0F766E",
          dark: "#0D5C56",
          light: "#14958C",
        },
        accent: {
          DEFAULT: "#2DD4BF",
          dark: "#20C5B0",
          light: "#5EEAD4",
        },
        "dark-bg": "#121212",
        "dark-card": "#1E1E1E",
        "neon-green": "#00FF94",
        "neon-orange": "#FF5555",
        background: "#121212",
        foreground: "#FFFFFF",
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-teal": "linear-gradient(135deg, #0F766E 0%, #2DD4BF 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-dark": "linear-gradient(135deg, #1E1E1E 0%, #0F766E 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        card: "0 4px 24px -1px rgba(0, 0, 0, 0.3)",
        glow: "0 0 40px rgba(45, 212, 191, 0.3)",
        "glow-green": "0 0 40px rgba(0, 255, 148, 0.2)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
