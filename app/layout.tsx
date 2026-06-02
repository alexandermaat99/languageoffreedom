import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SITE_DISPLAY_NAME } from "@/lib/site-brand";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: `${SITE_DISPLAY_NAME} - Book Preorder`,
  description: "Be the first to get your hands on this captivating new book. Preorder now and receive exclusive updates.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
