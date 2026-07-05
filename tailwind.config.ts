import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bright purple / pink / white palette.
        linen: {
          DEFAULT: "#ffffff",
          50: "#faf3ff", // soft lavender-white band
          100: "#fdeaf6", // soft pink band
          200: "#f0dcfb", // lavender hairline borders
        },
        noir: {
          DEFAULT: "#2d1b36", // deep plum near-black text/headings
          muted: "#7a6a82", // muted purple-grey body/meta
        },
        accent: {
          DEFAULT: "#9333ea", // vivid purple (logo, buttons, accents)
          hover: "#7e22ce",
        },
        pink: {
          DEFAULT: "#ec4899", // bright pink secondary
          hover: "#db2777",
        },
        // Dark scale retained for the self-contained admin area.
        ink: {
          950: "#1c1a1a",
          900: "#252121",
          800: "#2c2929",
          700: "#3a3636",
          600: "#4a4545",
        },
        cream: {
          50: "#f7f5f2",
          100: "#efece9",
        },
      },
      fontFamily: {
        // Cormorant Garamond = display/headings/logo (≈ Adobe Caslon / Mrs Eaves),
        // EB Garamond = body copy (≈ Minion Pro).
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        serif: ["var(--font-serif)", "EB Garamond", "Georgia", "serif"],
        sans: ["var(--font-serif)", "EB Garamond", "Georgia", "serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
