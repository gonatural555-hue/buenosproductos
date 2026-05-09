/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cinematic Dark Outdoor - Paleta base
        "dark-base": "#0B0F0E",
        "dark-surface": "#121917",
        "text-primary": "#E6ECE9",
        "text-muted": "#9BA6A1",
        "accent-gold": "#C89B3C",
        "accent-moss": "#3A5F4A",

        // Aliases semánticos para uso común
        background: {
          DEFAULT: "#0B0F0E",
          surface: "#121917",
          primary: "#122220",
        },
        text: {
          primary: "#E6ECE9",
          muted: "#9BA6A1",
        },
        accent: {
          DEFAULT: "#C89B3C",
          moss: "#3A5F4A",
        },
      },
    },
  },
  plugins: [],
};

export default config;
  