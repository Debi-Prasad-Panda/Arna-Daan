/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF6933",
        secondary: "#2E7D32",
        background: {
          light: "#f8f6f5",
          dark: "#121212",
          card: "#1E1E1E",
        },
        surface: {
          dark: "#181818",
        },
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #FF6B35 0%, #2E7D32 100%)",
        glass: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
      },
    },
  },
  plugins: [],
}
