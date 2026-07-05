import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import "./globals.css";

// Cormorant Garamond = display/headings/logo, EB Garamond = body copy
// (free stand-ins for christyannejones.com's Adobe Caslon Pro / Minion Pro).
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const serif = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_NAME || "Your Name"} — Author`,
  description: "Books, stories, and writings.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
