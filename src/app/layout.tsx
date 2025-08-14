import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import ClientOnly from "@/components/ui/ClientOnly";
import SkipLink from "@/components/ui/SkipLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Game Forge - Game Development Club at SRM IST KTR",
  description: "The Game Forge is a game development club at SRM IST KTR, fostering creativity and innovation in game development through collaboration and learning.",
  keywords: "game development, programming, SRM IST KTR, student club, gaming, technology",
  authors: [{ name: "The Game Forge" }],
  creator: "The Game Forge",
  publisher: "The Game Forge",
  robots: "index, follow",
  openGraph: {
    title: "The Game Forge - Game Development Club at SRM IST KTR",
    description: "The Game Forge is a game development club at SRM IST KTR, fostering creativity and innovation in game development through collaboration and learning.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Game Forge - Game Development Club at SRM IST KTR",
    description: "The Game Forge is a game development club at SRM IST KTR, fostering creativity and innovation in game development through collaboration and learning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipLink targetId="main-content">Skip to main content</SkipLink>
        <SkipLink targetId="navigation">Skip to navigation</SkipLink>
        {children}
        <ClientOnly>
          <PerformanceMonitor />
        </ClientOnly>
        
        {/* Live region for screen reader announcements */}
        <div
          id="live-region"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
        
        {/* Assertive live region for urgent announcements */}
        <div
          id="live-region-assertive"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        />
      </body>
    </html>
  );
}
