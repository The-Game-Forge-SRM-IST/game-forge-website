// Performance optimization utilities for smooth scrolling and animations
import { useState, useEffect, useRef } from 'react';

export const optimizeScrollPerformance = () => {
  // Throttle scroll events to reduce frequency
  let ticking = false;
  
  const throttleScroll = (callback: () => void) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };

  return throttleScroll;
};

// Ultra-fast RAF throttling for navigation
export const createRAFThrottle = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (rafId !== null) return;
    
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
};

// Debounce function for expensive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Optimize intersection observer for better performance
export const createOptimizedIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Reduce animation complexity based on device performance
export const getOptimizedAnimationConfig = () => {
  const isLowEndDevice = () => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    
    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) {
      return true;
    }
    
    // Check hardware concurrency
    if (navigator.hardwareConcurrency < 4) {
      return true;
    }
    
    return false;
  };

  return {
    shouldReduceAnimations: isLowEndDevice(),
    animationDuration: isLowEndDevice() ? 0.2 : 0.6,
    staggerDelay: isLowEndDevice() ? 0.05 : 0.1
  };
};

// Optimize CSS transforms for better performance
export const optimizeTransforms = () => {
  // Force hardware acceleration for better performance
  const style = document.createElement('style');
  style.textContent = `
    .gpu-accelerated {
      transform: translateZ(0);
      will-change: transform, opacity;
      backface-visibility: hidden;
      perspective: 1000px;
    }
    
    .optimize-animations {
      backface-visibility: hidden;
      perspective: 1000px;
      transform-style: preserve-3d;
    }
    
    /* Smooth scrolling optimizations */
    html {
      scroll-behavior: auto; /* Let JS handle smooth scrolling */
    }
    
    /* Performance optimized motion */
    .motion-safe {
      will-change: transform, opacity;
      transform: translateZ(0);
    }
    
    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
      .motion-safe {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// Memory cleanup for animations
export const cleanupAnimations = () => {
  // Remove will-change properties after animations complete
  const elements = document.querySelectorAll('[style*="will-change"]');
  elements.forEach(el => {
    const element = el as HTMLElement;
    if (element.style.willChange) {
      element.style.willChange = 'auto';
    }
  });
};

// Optimize component rendering with intersection observer
export const useIntersectionOptimizer = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { 
        threshold,
        rootMargin: '100px' // Load content before it's visible
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, hasBeenVisible]);

  return { ref, isVisible, hasBeenVisible };
};

// Batch DOM updates for better performance
export const batchDOMUpdates = (updates: (() => void)[]) => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Optimize framer motion settings for performance
export const getPerformantMotionConfig = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEndDevice = navigator.hardwareConcurrency < 4 || (navigator as any).deviceMemory < 4;
  
  if (prefersReducedMotion || isLowEndDevice) {
    return {
      initial: false,
      animate: false,
      transition: { duration: 0 }
    };
  }
  
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  };
};

// Advanced animation queue system for smooth performance
export const useAnimationQueue = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const queueRef = useRef<(() => void)[]>([]);
  const processingRef = useRef(false);

  const addToQueue = (animation: () => void) => {
    queueRef.current.push(animation);
    processQueue();
  };

  const processQueue = () => {
    if (processingRef.current || queueRef.current.length === 0) return;
    
    processingRef.current = true;
    setIsAnimating(true);
    
    const nextAnimation = queueRef.current.shift();
    if (nextAnimation) {
      requestAnimationFrame(() => {
        nextAnimation();
        setTimeout(() => {
          processingRef.current = false;
          setIsAnimating(false);
          processQueue(); // Process next in queue
        }, 100); // Small delay between animations
      });
    }
  };

  return { addToQueue, isAnimating };
};

// GPU-accelerated animation variants
export const getGPUOptimizedVariants = () => {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05, // Reduced stagger for better performance
          delayChildren: 0.1
        }
      }
    },
    item: {
      hidden: { 
        opacity: 0, 
        y: 20,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94] as const, // Fix TypeScript issue
          type: "tween" as const
        }
      }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" as const }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          ease: "easeOut" as const,
          type: "tween" as const
        }
      }
    }
  };
};

// Progressive content loading hook
export const useProgressiveLoading = (threshold = 0.2) => {
  const [loadingStage, setLoadingStage] = useState<'idle' | 'skeleton' | 'content' | 'animations'>('idle');
  const { ref, isVisible, hasBeenVisible } = useIntersectionOptimizer(threshold);

  useEffect(() => {
    if (!hasBeenVisible) return;

    // Stage 1: Show skeleton immediately
    setLoadingStage('skeleton');
    
    // Stage 2: Load content after a frame
    requestAnimationFrame(() => {
      setLoadingStage('content');
      
      // Stage 3: Enable animations after content is rendered
      setTimeout(() => {
        setLoadingStage('animations');
      }, 50);
    });
  }, [hasBeenVisible]);

  return { ref, loadingStage, isVisible };
};

// Smart animation controller that prevents blocking
export const useSmartAnimations = () => {
  const [canAnimate, setCanAnimate] = useState(true);
  const frameTimeRef = useRef<number[]>([]);

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const checkPerformance = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      frameTimeRef.current.push(deltaTime);
      
      // Keep only last 10 frame times
      if (frameTimeRef.current.length > 10) {
        frameTimeRef.current.shift();
      }
      
      // Calculate average frame time
      const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
      const fps = 1000 / avgFrameTime;
      
      // Disable animations if FPS drops below 45
      setCanAnimate(fps > 45);
      
      lastTime = currentTime;
      rafId = requestAnimationFrame(checkPerformance);
    };

    rafId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return canAnimate;
};