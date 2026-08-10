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
        cream: "var(--cream)",
        "cream-dark": "var(--cream-dark)",
        blush: "var(--blush)",
        rose: "var(--rose)",
        "rose-deep": "var(--rose-deep)",
        brown: "var(--brown)",
        "brown-light": "var(--brown-light)",
        chocolate: "var(--chocolate)",
        gold: "var(--gold)",
        "gold-light": "var(--gold-light)",
        text: "var(--text)",
        "text-mid": "var(--text-mid)",
        "text-soft": "var(--text-soft)",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [],
};
export default config;
