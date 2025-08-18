/**
 * Mobile optimization utilities for better performance and UX
 */

// Detect mobile device capabilities
export const detectMobileCapabilities = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isLowEnd: false,
      supportsTouch: false,
      hasNotch: false,
      prefersReducedMotion: false,
      isIOS: false,
      isAndroid: false,
      screenWidth: 0,
      screenHeight: 0,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
  const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Detect devices with notches/safe areas
  const hasNotch = window.CSS?.supports('padding: max(0px)') && 
    (window.CSS.supports('padding-top: env(safe-area-inset-top)') ||
     window.CSS.supports('padding-top: constant(safe-area-inset-top)'));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    isMobile: isMobile || isSmallScreen,
    isLowEnd,
    supportsTouch,
    hasNotch,
    prefersReducedMotion,
    isIOS: /iphone|ipad|ipod/i.test(userAgent),
    isAndroid: /android/i.test(userAgent),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  };
};

// Optimize touch targets for mobile
export const getTouchTargetSize = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const capabilities = detectMobileCapabilities();
  
  if (!capabilities.isMobile) {
    return '';
  }

  const sizes = {
    sm: 'min-h-[40px] min-w-[40px]',
    md: 'min-h-[44px] min-w-[44px]',
    lg: 'min-h-[48px] min-w-[48px]',
  };

  return sizes[size];
};

// Optimize animations for mobile
export const getMobileAnimationConfig = () => {
  const capabilities = detectMobileCapabilities();
  
  if (capabilities.prefersReducedMotion || capabilities.isLowEnd) {
    return {
      duration: 0.1,
      ease: 'linear',
      reduce: true,
    };
  }

  if (capabilities.isMobile) {
    return {
      duration: 0.3,
      ease: 'easeOut',
      reduce: false,
    };
  }

  return {
    duration: 0.5,
    ease: 'easeInOut',
    reduce: false,
  };
};

// Optimize images for mobile
export const getMobileImageConfig = () => {
  const capabilities = detectMobileCapabilities();
  
  return {
    quality: capabilities.isLowEnd ? 60 : 80,
    format: capabilities.isMobile ? 'webp' : 'auto',
    sizes: capabilities.isMobile 
      ? '(max-width: 768px) 100vw, 50vw'
      : '(max-width: 1200px) 50vw, 33vw',
    priority: false, // Let Next.js decide based on viewport
  };
};

// Debounce function for scroll events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle function for high-frequency events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Optimize scroll performance
export const optimizeScrollPerformance = () => {
  if (typeof window === 'undefined') return { passive: true };

  // Add passive event listeners for better scroll performance
  const passiveSupported = (() => {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      } as AddEventListenerOptions;
      const testFn = () => {};
      window.addEventListener('test' as keyof WindowEventMap, testFn, options);
      window.removeEventListener('test' as keyof WindowEventMap, testFn);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  })();

  return passiveSupported ? { passive: true } : false;
};

// Prevent zoom on input focus (iOS)
export const preventIOSZoom = () => {
  if (typeof window === 'undefined') return;
  
  const capabilities = detectMobileCapabilities();
  if (!capabilities.isIOS) return;

  // Add viewport meta tag to prevent zoom
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    );
  }

  // Ensure input font-size is at least 16px to prevent zoom
  const style = document.createElement('style');
  style.textContent = `
    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="password"],
    input[type="number"],
    input[type="search"],
    input[type="url"],
    textarea,
    select {
      font-size: 16px !important;
    }
  `;
  document.head.appendChild(style);
};

// Optimize for safe area (notch support)
export const getSafeAreaClasses = () => {
  const capabilities = detectMobileCapabilities();
  
  if (!capabilities.hasNotch) {
    return '';
  }

  return 'safe-area-inset-top safe-area-inset-bottom safe-area-inset-left safe-area-inset-right';
};

// Get responsive text classes
export const getResponsiveTextClass = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl') => {
  const classes = {
    xs: 'text-responsive-xs',
    sm: 'text-responsive-sm', 
    base: 'text-responsive-base',
    lg: 'text-responsive-lg',
    xl: 'text-responsive-xl',
    '2xl': 'text-responsive-2xl',
    '3xl': 'text-responsive-3xl',
  };

  return classes[size] || classes.base;
};

// Get responsive spacing classes
export const getResponsiveSpacing = (size: 'sm' | 'md' | 'lg') => {
  const classes = {
    sm: 'space-responsive-sm',
    md: 'space-responsive-md',
    lg: 'space-responsive-lg',
  };

  return classes[size] || classes.md;
};

// Optimize container for mobile
export const getResponsiveContainer = () => {
  return 'container-responsive';
};

// Check if device supports hover
export const supportsHover = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover)').matches;
};

// Get theme-aware mobile classes
export const getMobileThemeClasses = (theme: 'light' | 'dark') => {
  return {
    background: theme === 'light' ? 'bg-background' : 'bg-black',
    text: theme === 'light' ? 'text-foreground' : 'text-white',
    border: theme === 'light' ? 'border-border-color' : 'border-white/10',
    card: theme === 'light' ? 'card-background' : 'bg-gray-800/50',
    glass: theme === 'light' ? 'glass-light' : 'glass-medium',
  };
};