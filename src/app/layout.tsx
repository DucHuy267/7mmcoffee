import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "7mmcoffee", template: "%s | 7mmcoffee" },
  description: "More than coffee, it’s a moment.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" suppressHydrationWarning><body>{children}</body></html>;
}
