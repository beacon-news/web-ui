import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./ui/globals.css";
import "./config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Web UI",
    default: "Web UI",
  },
  description: "Search articles from popular news sites, see the latest news and topics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
