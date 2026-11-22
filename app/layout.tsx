import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ludhiana Burrito",
  description: "Reviews for Ludhiana Burrito, Sector 32.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
