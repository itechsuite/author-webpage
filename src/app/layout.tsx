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

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Your Name";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const description =
  "Discover novels and audiobooks that inspire readers to overcome challenges and rise above their limitations — plus writings on grace, redemption, and the craft of storytelling.";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — Author`,
    template: `%s — ${siteName}`,
  },
  description,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    siteName,
    title: `${siteName} — Author`,
    description,
    url: siteUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Author`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
