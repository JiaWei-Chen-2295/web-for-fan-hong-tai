/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 五月晴空 2.0 - 更柔和和谐的配色

        // 核心色 - 五月天蓝 (柔和的天空蓝)
        "mayday-blue": "#6BA3D6",        // 更柔和的天蓝
        "deep-mayday": "#4A7BA8",        // 深天蓝

        // 过渡色 - 薰衣草 (连接蓝与暖色)
        "lavender-mist": "#9B8EC6",      // 薰衣草紫

        // 背景色 - 星夜蓝 (温暖的深蓝)
        "sky-twilight": "#1e2a3a",
        "dusk-dark": "#1e2a3a",          // alias

        // 温暖强调色 (更柔和淡雅)
        "honey-glow": "#E8C48A",         // 淡蜂蜜金
        "amber-warmth": "#D4A574",       // 柔和杏色
        "sunset-gold": "#E8C48A",        // alias
        "sunset-orange": "#D4A574",      // alias

        // 柔和点缀色
        "blush-coral": "#E8B4A8",        // 玫瑰粉
        "rose-gold": "#D4A4A4",          // 玫瑰金
        "sunset-peach": "#E8B4A8",       // alias

        // 纸张与浅色
        "cream-paper": "#FAF6F0",
        "paper-base": "#FAF6F0",         // alias

        // 辅助色
        "ink-blue": "#2a4a6a",
        "primary-blue": "#6BA3D6",
        "dusk-purple": "#3a4a5a"
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
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      }
    },
  },
  plugins: [],
}
