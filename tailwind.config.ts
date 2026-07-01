import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette read directly from markmanson.net:
        // warm charcoal canvas, near-white serif text, vivid orange accent.
        ink: {
          950: "#1c1a1a",
          900: "#252121", // main background (Manson's --color__background-body dark)
          800: "#2c2929", // raised cards / inputs
          700: "#3a3636", // hairline borders
          600: "#4a4545",
        },
        cream: {
          50: "#f7f5f2", // primary near-white text
          100: "#efece9",
        },
        accent: {
          DEFAULT: "#f26822", // Manson brand orange
          hover: "#a74414", // darker orange (hover / shadow)
        },
      },
      fontFamily: {
        // Montserrat for display/nav/buttons, Source Serif for body copy.
        display: ["var(--font-display)", "Montserrat", "system-ui", "sans-serif"],
        sans: ["var(--font-display)", "Montserrat", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Source Serif Pro", "Georgia", "serif"],
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
