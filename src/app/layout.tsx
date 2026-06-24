import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import ClientOnly from "@/components/ui/ClientOnly";
import SkipLink from "@/components/ui/SkipLink";
import BackgroundMusic from "@/components/ui/BackgroundMusic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AppWithLoading from "@/components/ui/AppWithLoading";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://game-forge-website.vercel.app'),
  title: "THE GAME FORGE | Crafting Digital Worlds",
  description: "The Game Forge is a game development club at SRM IST KTR, fostering creativity and innovation in game development through collaboration and learning.",
  keywords: "game development, programming, SRM IST KTR, student club, gaming, technology, digital forge",
  authors: [{ name: "The Game Forge" }],
  creator: "The Game Forge",
  publisher: "The Game Forge",
  robots: "index, follow",
  openGraph: {
    title: "THE GAME FORGE | Crafting Digital Worlds",
    description: "The Game Forge is a game development club at SRM IST KTR, fostering creativity and innovation in game development through collaboration and learning.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/ClubLogo.png",
        width: 512,
        height: 512,
        alt: "The Game Forge Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THE GAME FORGE | Crafting Digital Worlds",
    description: "The Game Forge is a game development club at SRM IST KTR, fostering creativity and innovation in game development through collaboration and learning.",
    images: ["/images/ClubLogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#131313" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-on-background`}
      >
        <LoadingProvider>
          <ThemeProvider>
          <AppWithLoading>
            <SkipLink targetId="main-content">Skip to main content</SkipLink>
            <SkipLink targetId="navigation">Skip to navigation</SkipLink>
            {children}
            <ClientOnly>
              <SmoothScroll />
              <PerformanceMonitor />
            </ClientOnly>
          </AppWithLoading>
          </ThemeProvider>
          <ClientOnly>
            <BackgroundMusic />
          </ClientOnly>
        </LoadingProvider>

        {/* Live regions for screen reader announcements */}
        <div
          id="live-region"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
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
