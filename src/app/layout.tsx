import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-custom",
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans-custom",
});

export const metadata: Metadata = {
  title: {
    default: "7mmcoffee",
    template: "%s | 7mmcoffee",
  },
  description: "More than coffee, it’s a moment.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${sansFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
