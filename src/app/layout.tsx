import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchProvider } from "@/components/search/SearchContext";
import { SearchOverlay } from "@/components/search/SearchOverlay";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wayfarer · Discover Unforgettable New Destinations",
  description:
    "Wayfarer helps you discover destinations tailored to how you travel. Personalized planning, an interactive globe, and itineraries that hold together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <SearchProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SearchOverlay />
        </SearchProvider>
      </body>
    </html>
  );
}
