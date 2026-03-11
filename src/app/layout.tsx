import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Legal Knowledge & Insights",
  description: "A modern, minimalist platform for legal analysis and case law sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-[#fbfbfb] text-[#334155] antialiased min-h-screen flex flex-col">
        {/* We will define global UI components in individual page/template layouts, or here if we detect it's not the /admin route. */}
        {children}
      </body>
    </html>
  );
}
