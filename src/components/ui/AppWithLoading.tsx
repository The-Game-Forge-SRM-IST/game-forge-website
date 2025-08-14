'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout';
import LoadingScreen from './LoadingScreen';
import { useLoading } from '@/providers/LoadingProvider';
import ClientOnly from './ClientOnly';

interface AppWithLoadingProps {
  children: React.ReactNode;
}

export default function AppWithLoading({ children }: AppWithLoadingProps) {
  const { isLoading, setIsLoading } = useLoading();
  const [mounted, setMounted] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoadingComplete = () => {
    // Ensure content is ready before hiding loading screen
    setContentReady(true);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // Preload critical resources in parallel with loading screen
  useEffect(() => {
    if (!mounted) return;
    
    const preloadResources = async () => {
      // Preload critical images that will be needed immediately
      const criticalImages = [
        '/images/ClubLogo.png',
        '/images/team/adamya.png', // First few team member images
        '/images/team/anshu.jpeg',
        '/images/projects/galaxy-ruler-1.png', // Featured project images
      ];

      // Start preloading immediately, don't wait for loading screen
      const imagePromises = criticalImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Don't fail loading for missing images
          img.src = src;
          // Set a timeout to prevent hanging
          setTimeout(resolve, 2000);
        });
      });

      try {
        // Use Promise.allSettled to not fail if some images don't load
        await Promise.allSettled(imagePromises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    // Start preloading immediately
    preloadResources();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-black" />
    );
  }

  if (isLoading) {
    return (
      <>
        <ClientOnly>
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        </ClientOnly>
        {/* Pre-render content in background to avoid flash */}
        {contentReady && (
          <div className="opacity-0 pointer-events-none">
            <AppLayout>{children}</AppLayout>
          </div>
        )}
      </>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}