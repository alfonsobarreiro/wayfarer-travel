import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchProvider } from "@/components/search/SearchContext";
import { SearchOverlay } from "@/components/search/SearchOverlay";

export const metadata: Metadata = {
  title: "Wayfarer · Discover Unforgettable New Destinations",
  description:
    "Wayfarer helps you discover a world of adventures tailored to how you actually travel. Personalized planning, an interactive globe, and itineraries that hold together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
