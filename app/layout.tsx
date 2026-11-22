import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zomato Lite",
  description: "One restaurant. Honest reviews.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <main className="mx-auto max-w-[560px] px-5 py-14">{children}</main>
      </body>
    </html>
  );
}
