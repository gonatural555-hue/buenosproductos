/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "gn-xs": "var(--gn-space-xs)",
        "gn-s": "var(--gn-space-s)",
        "gn-m": "var(--gn-space-m)",
        "gn-l": "var(--gn-space-l)",
        "gn-xl": "var(--gn-space-xl)",
        "gn-xxl": "var(--gn-space-xxl)",
        "gn-hero": "clamp(var(--gn-space-hero-min), 12vw, var(--gn-space-hero-max))",
      },
      maxWidth: {
        "gn-content": "1440px",
      },
      fontFamily: {
        sans: [
          "var(--font-body)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        body: [
          "var(--font-body)",
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
          "var(--font-display)",
          "var(--font-tan-nimbus)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        "tan-nimbus": [
          "var(--font-tan-nimbus)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
      },
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "var(--gi-leading-normal)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--gi-leading-normal)" }],
        base: ["var(--text-base)", { lineHeight: "var(--gi-leading-normal)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--gi-leading-snug)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--gi-leading-heading)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--gi-leading-heading)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--gi-leading-heading)" }],
      },
      colors: {
        /* Go Natural — sistema editorial (globals :root --gn-*) */
        "gn-forest": "#2E4A36",
        "gn-cream": "#F4EBDD",
        "gn-burgundy": "#6E1F28",
        "gn-burnt": "#C9622B",
        "gn-mustard": "#D9A441",
        "gn-navy": "#2A2E4B",

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
