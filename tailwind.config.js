/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border, 214.3 31.8% 91.4%))",
        input: "hsl(var(--input, 214.3 31.8% 91.4%))",
        ring: "hsl(var(--ring, 222.2 84% 4.9%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222.2 84% 4.9%))",
        primary: {
          DEFAULT: "#00875A", // Green700 from Design System
          dark: "#006644",
          light: "#E6F4EA", // Green50 / primary-container
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "#E53935", // Red400
          dark: "#C62828",
          light: "#FFEBEE", // Red50
        },
        canvas: "#F2F2F2", // Grey200
        outline: {
          DEFAULT: "#BDBDBD",
          variant: "#E0E0E0",
        },
        surface: {
          DEFAULT: "#FAFAFA",
          dim: "#E0E0E0",
          bright: "#FFFFFF",
          container: "#EEEEEE",
          low: "#F5F5F5",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        sans: ['Roboto', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
