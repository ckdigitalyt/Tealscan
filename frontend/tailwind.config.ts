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
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        primary: {
          DEFAULT: "#14b8a6",
          dark: "#0f766e",
          light: "#2dd4bf",
        },
        accent: {
          DEFAULT: "#0d9488",
          dark: "#0f766e",
          light: "#5eead4",
        },
        "dark-bg": "#121212",
        "dark-card": "#1E1E1E",
        "neon-green": "#14b8a6",
        "neon-orange": "#ef4444",
        background: "#f9fafb",
        foreground: "#1f2937",
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
        "gradient-teal": "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-dark": "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        card: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
        glow: "0 0 40px rgba(20, 184, 166, 0.2)",
        "glow-teal": "0 0 40px rgba(20, 184, 166, 0.15)",
        "hover-teal": "0 10px 30px rgba(20, 184, 166, 0.2)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
