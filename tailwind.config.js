/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        mono: ["'DM Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4a017",
          600: "#b8860b",
          700: "#92650a",
          800: "#6b4c07",
          900: "#453005",
        },
        surface: {
          900: "#080808",
          800: "#111111",
          700: "#191919",
          600: "#222222",
          500: "#2a2a2a",
          400: "#333333",
        },
      },
      boxShadow: {
        gold: "0 0 30px rgba(212, 160, 23, 0.15)",
        "gold-sm": "0 0 12px rgba(212, 160, 23, 0.12)",
        card: "0 4px 24px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4a017 0%, #fcd34d 50%, #b8860b 100%)",
        "dark-gradient": "linear-gradient(135deg, #111111 0%, #191919 100%)",
        "card-gradient": "linear-gradient(145deg, #191919 0%, #111111 100%)",
      },
    },
  },
  plugins: [],
}
