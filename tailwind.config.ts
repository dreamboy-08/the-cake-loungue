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
        cream: "#fdf6ee",
        "cream-dark": "#f5e9d9",
        blush: "#f2c4b0",
        rose: "#e8917a",
        "rose-deep": "#c9614a",
        brown: "#6b3a2a",
        "brown-light": "#9c6040",
        chocolate: "#3d1f10",
        gold: "#d4a45a",
        "gold-light": "#f0d49a",
        text: "#2c1810",
        "text-mid": "#6b4c3b",
        "text-soft": "#a07860",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "18px",
        lg: "28px",
        xl: "40px",
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 22s linear infinite',
        'gallery-scroll': 'marquee 30s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
