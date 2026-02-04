/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dusk-dark": "#1e1b4b",
        "dusk-purple": "#2a1b3d",
        "sunset-orange": "#f97316",
        "sunset-gold": "#fbbf24",
        "sunset-peach": "#fca5a5",
        "ink-blue": "#1a3a5f",
        "paper-base": "#fdfaf1",
        "primary-blue": "#1349ec"
      },
      fontFamily: {
        serif: ["Noto Serif SC", "serif"],
        handwritten: ["Zhi Mang Xing", "cursive"],
        brush: ["Ma Shan Zheng", "cursive"],
        sans: ["Be Vietnam Pro", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"]
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
}
