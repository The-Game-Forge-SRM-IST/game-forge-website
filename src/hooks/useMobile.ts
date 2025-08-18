'use client';

import { useState, useEffect } from 'react';
import { detectMobileCapabilities, getMobileAnimationConfig, optimizeScrollPerformance } from '@/utils/mobileOptimizations';

export function useMobile() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    supportsTouch: false,
    hasNotch: false,
    prefersReducedMotion: false,
    isIOS: false,
    isAndroid: false,
    screenWidth: 0,
    screenHeight: 0,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const updateCapabilities = () => {
      setCapabilities(detectMobileCapabilities());
      setIsLoaded(true);
    };

    // Initial detection
    updateCapabilities();

    // Listen for orientation changes and resize
    const handleResize = () => {
      updateCapabilities();
    };

    window.addEventListener('resize', handleResize, optimizeScrollPerformance());
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const animationConfig = getMobileAnimationConfig();

  return {
    ...capabilities,
    isLoaded,
    animationConfig,
    shouldReduceAnimations: capabilities.prefersReducedMotion || capabilities.isLowEnd,
    isPortrait: capabilities.screenHeight > capabilities.screenWidth,
    isLandscape: capabilities.screenWidth > capabilities.screenHeight,
  };
}