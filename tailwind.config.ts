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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #F9CF93, #F6DEBC, #FAEEE0, #FAEEE0, #F6DEBC, #F9CF93)',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        serif4: ['"Source Serif 4"', "serif"]
      },
    },
  },
  plugins: [],
};
export default config;
