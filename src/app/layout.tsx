import type { Metadata } from "next";
import { Montserrat, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Montserrat = display/nav/buttons, Source Serif = body copy (per markmanson.net).
const display = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_NAME || "Your Name"} — Author`,
  description: "Books, ideas, and the occasional uncomfortable truth.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
