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

  // Preload critical resources - Optimized:
  // We utilize Next.js <Image priority> for LCP elements (Hero Logo).
  // Heavy manual preloading is removed to improve initial load performance on mobile.
  useEffect(() => {
    // Optional: Only preload very specific assets if absolutely necessary, 
    // but for now we rely on Next.js optimization.
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