import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Burnt Clay" palette — sun-baked rust, bark, and dusty sage.
        linen: {
          DEFAULT: "#ffffff",
          50: "#f5efe6", // warm paper band
          100: "#f1e3d5", // soft clay-tinted band
          200: "#e4d8c8", // warm hairline borders
        },
        noir: {
          DEFAULT: "#241e1a", // deep bark near-black text/headings
          muted: "#8a7d70", // muted warm-grey body/meta
        },
        accent: {
          DEFAULT: "#b5502e", // burnt clay / rust (logo, buttons, accents)
          hover: "#96401f",
        },
        pink: {
          DEFAULT: "#8b9574", // dusty sage secondary
          hover: "#76825f",
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
        // Premium admin theme — deliberately its own visual world, separate
        // from the public site's "Burnt Clay" brand palette above.
        adminBg: "#0b0d14",
        adminSurface: {
          DEFAULT: "#12151f",
          raised: "#161a26",
        },
        adminBorder: "rgba(255,255,255,0.08)",
        adminAccent: {
          DEFAULT: "#4c7dff",
          soft: "#7c9cff",
          violet: "#7c3aed",
        },
      },
      fontFamily: {
        // Cormorant Garamond = display/headings/logo (≈ Adobe Caslon / Mrs Eaves),
        // EB Garamond = body copy (≈ Minion Pro).
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        serif: ["var(--font-serif)", "EB Garamond", "Georgia", "serif"],
        sans: ["var(--font-serif)", "EB Garamond", "Georgia", "serif"],
        // Clean system-ui sans used only inside /admin, distinct from the
        // public site's serif pairing.
        adminSans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
