'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

interface DeviceCapabilities {
  supportsHover: boolean;
  supportsTouch: boolean;
  hasReducedMotion: boolean;
  hasHighDPI: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

export function useResponsive(breakpoints: Partial<BreakpointConfig> = {}) {
  const config = useMemo(() => ({ ...defaultBreakpoints, ...breakpoints }), [breakpoints]);
  const [isMounted, setIsMounted] = useState(false);
  
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<keyof BreakpointConfig>('lg');
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    supportsHover: false,
    supportsTouch: false,
    hasReducedMotion: false,
    hasHighDPI: false,
    connectionSpeed: 'unknown',
  });

  // Enhanced device detection
  const detectDeviceCapabilities = useCallback(() => {
    if (typeof window === 'undefined') return;

    const capabilities: DeviceCapabilities = {
      supportsHover: window.matchMedia('(hover: hover)').matches,
      supportsTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hasReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      hasHighDPI: window.devicePixelRatio > 1.5,
      connectionSpeed: 'unknown',
    };

    // Detect connection speed if available
    const connection = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection || 
                      (navigator as unknown as { mozConnection?: { effectiveType?: string; downlink?: number } }).mozConnection || 
                      (navigator as unknown as { webkitConnection?: { effectiveType?: string; downlink?: number } }).webkitConnection;
    if (connection) {
      if (connection.effectiveType === '4g' || (connection.downlink && connection.downlink > 10)) {
        capabilities.connectionSpeed = 'fast';
      } else if (connection.effectiveType === '3g' || connection.effectiveType === '2g' || (connection.downlink && connection.downlink < 1.5)) {
        capabilities.connectionSpeed = 'slow';
      }
    }

    setDeviceCapabilities(capabilities);
  }, []);

  const handleResize = useCallback(() => {
    if (typeof window === 'undefined' || !isMounted) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setScreenSize({ width, height });
    
    // Enhanced device type detection
    const isMobileDevice = width < config.md;
    const isTabletDevice = width >= config.md && width < config.lg;
    const isDesktopDevice = width >= config.lg;
    
    setIsMobile(isMobileDevice);
    setIsTablet(isTabletDevice);
    setIsDesktop(isDesktopDevice);
    
    // Determine current breakpoint with xs support
    if (width >= config['2xl']) {
      setCurrentBreakpoint('2xl');
    } else if (width >= config.xl) {
      setCurrentBreakpoint('xl');
    } else if (width >= config.lg) {
      setCurrentBreakpoint('lg');
    } else if (width >= config.md) {
      setCurrentBreakpoint('md');
    } else if (width >= config.sm) {
      setCurrentBreakpoint('sm');
    } else {
      setCurrentBreakpoint('xs');
    }
  }, [isMounted, config.xs, config.sm, config.md, config.lg, config.xl, config['2xl']]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted) return;

    // Set initial values
    handleResize();
    detectDeviceCapabilities();

    // Add event listener with optimized throttling
    let timeoutId: NodeJS.Timeout;
    let rafId: number;
    
    const throttledResize = () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        timeoutId = setTimeout(handleResize, 100);
      });
    };

    window.addEventListener('resize', throttledResize, { passive: true });
    
    // Listen for media query changes
    const mediaQueries = [
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ];
    
    const handleMediaChange = () => detectDeviceCapabilities();
    mediaQueries.forEach(mq => mq.addEventListener('change', handleMediaChange));
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleMediaChange));
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [isMounted, handleResize, detectDeviceCapabilities]);

  // Utility functions
  const isBreakpoint = (breakpoint: keyof BreakpointConfig) => {
    return screenSize.width >= config[breakpoint];
  };

  const isBetween = (min: keyof BreakpointConfig, max: keyof BreakpointConfig) => {
    return screenSize.width >= config[min] && screenSize.width < config[max];
  };

  const getColumns = (xs: number, sm: number, md: number, lg: number, xl?: number) => {
    if (screenSize.width < config.sm) return xs;
    if (screenSize.width < config.md) return sm;
    if (screenSize.width < config.lg) return md;
    if (xl && screenSize.width >= config.xl) return xl;
    return lg;
  };

  const getSpacing = (xs: number, sm: number, md: number, lg: number) => {
    if (screenSize.width < config.sm) return xs;
    if (screenSize.width < config.md) return sm;
    if (screenSize.width < config.lg) return md;
    return lg;
  };

  const getFontSize = (xs: string, sm: string, md: string, lg: string) => {
    if (screenSize.width < config.sm) return xs;
    if (screenSize.width < config.md) return sm;
    if (screenSize.width < config.lg) return md;
    return lg;
  };

  // Touch-friendly sizing
  const getTouchTargetSize = () => {
    return isMobile ? 'min-h-[44px] min-w-[44px]' : 'min-h-[32px] min-w-[32px]';
  };

  // Responsive padding/margin utilities
  const getResponsivePadding = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    const paddingMap = {
      sm: isMobile ? 'p-3' : 'p-4',
      md: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8',
      lg: isMobile ? 'p-6' : isTablet ? 'p-8' : 'p-12',
      xl: isMobile ? 'p-8' : isTablet ? 'p-12' : 'p-16',
    };
    return paddingMap[size];
  };

  const getResponsiveMargin = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    const marginMap = {
      sm: isMobile ? 'm-2' : 'm-3',
      md: isMobile ? 'm-3' : isTablet ? 'm-4' : 'm-6',
      lg: isMobile ? 'm-4' : isTablet ? 'm-6' : 'm-8',
      xl: isMobile ? 'm-6' : isTablet ? 'm-8' : 'm-12',
    };
    return marginMap[size];
  };

  // Performance-aware settings
  const shouldReduceAnimations = deviceCapabilities.hasReducedMotion || 
    (isMobile && deviceCapabilities.connectionSpeed === 'slow');

  const shouldOptimizeImages = isMobile || deviceCapabilities.connectionSpeed === 'slow';

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    deviceCapabilities,
    isBreakpoint,
    isBetween,
    getColumns,
    getSpacing,
    getFontSize,
    getTouchTargetSize,
    getResponsivePadding,
    getResponsiveMargin,
    shouldReduceAnimations,
    shouldOptimizeImages,
    // Convenience breakpoint checks
    isXs: screenSize.width < config.sm,
    isSm: isBreakpoint('sm'),
    isMd: isBreakpoint('md'),
    isLg: isBreakpoint('lg'),
    isXl: isBreakpoint('xl'),
    is2Xl: isBreakpoint('2xl'),
    // Device orientation
    isLandscape: screenSize.width > screenSize.height,
    isPortrait: screenSize.width <= screenSize.height,
    // Enhanced device detection
    isTouchDevice: deviceCapabilities.supportsTouch,
    supportsHover: deviceCapabilities.supportsHover,
    hasHighDPI: deviceCapabilities.hasHighDPI,
    // Aspect ratio helpers
    aspectRatio: screenSize.width / screenSize.height,
    isWideScreen: (screenSize.width / screenSize.height) > 1.5,
    isTallScreen: (screenSize.width / screenSize.height) < 0.75,
  };
}

export default useResponsive;