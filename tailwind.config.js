/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        inter: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-tan-nimbus)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
      },
      colors: {
        /* Go Natural — marca */
        forest: "#111713",
        "warm-sand": "#E8E1D3",
        "soft-stone": "#F5F2EC",
        "mountain-green": "#2F4A3A",
        "moss-green": "#6F7F5A",
        "earth-brown": "#8A6A4F",
        "sun-amber": "#D98A24",
        charcoal: "#1A1A1A",
        "muted-gray": "#6B6B6B",

        /* Semántica (compatibilidad con utilidades existentes) */
        "dark-base": "#111713",
        "dark-surface": "#1e2823",
        "text-primary": "#111713",
        "text-muted": "#6B6B6B",
        "accent-gold": "#D98A24",
        "accent-moss": "#6F7F5A",

        background: {
          DEFAULT: "#E8E1D3",
          surface: "#F5F2EC",
          primary: "#E8E1D3",
        },
        text: {
          primary: "#111713",
          muted: "#6B6B6B",
        },
        accent: {
          DEFAULT: "#D98A24",
          moss: "#6F7F5A",
        },
      },
    },
  },
  plugins: [],
};

export default config;
