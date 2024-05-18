import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./ui/globals.css";
import "./config";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Beacon",
    default: "Beacon",
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
      <body className={clsx(inter.className, "min-h-screen")}>{children}</body>
    </html>
  );
}
