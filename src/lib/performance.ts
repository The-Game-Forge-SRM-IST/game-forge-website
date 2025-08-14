/**
 * Performance monitoring and optimization utilities
 */

// Web Vitals monitoring
export function reportWebVitals(metric: { name: string; value: number; id: string }) {
  if (process.env.NODE_ENV === 'production') {
    // Log to console in development, send to analytics in production
    console.log(metric);
    
    // Example: Send to Google Analytics
    // gtag('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
  }
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null;
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// Debounce utility for performance-sensitive operations
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for scroll events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
}

// Memory usage monitoring (for Three.js scenes)
export function getMemoryUsage() {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }
  
  const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  if (!memory) return null;
  
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  };
}

// FPS monitoring
export class FPSMonitor {
  private frames = 0;
  private startTime = 0;
  private fps = 0;
  private callback?: (fps: number) => void;
  private animationId?: number;

  constructor(callback?: (fps: number) => void) {
    this.callback = callback;
  }

  start() {
    this.startTime = performance.now();
    this.frames = 0;
    this.tick();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private tick = () => {
    this.frames++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frames * 1000) / elapsed);
      this.callback?.(this.fps);
      
      this.frames = 0;
      this.startTime = currentTime;
    }

    this.animationId = requestAnimationFrame(this.tick);
  };

  getFPS() {
    return this.fps;
  }
}

// Image optimization helper
export function getOptimizedImageProps(
  src: string,
  alt: string,
  width?: number,
  height?: number
) {
  return {
    src,
    alt,
    width,
    height,
    loading: 'lazy' as const,
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
    quality: 85,
  };
}

// Bundle size analyzer helper
export function logBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available at: npm run analyze');
  }
}

// Performance budget checker
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  const metrics = {
    FCP: navigation.responseStart - navigation.fetchStart,
    LCP: navigation.loadEventEnd - navigation.fetchStart,
    TTI: navigation.domInteractive - navigation.fetchStart,
  };
  
  const budgets = {
    FCP: 1500, // 1.5s
    LCP: 2500, // 2.5s
    TTI: 3000, // 3s
  };
  
  Object.entries(metrics).forEach(([metric, value]) => {
    const budget = budgets[metric as keyof typeof budgets];
    if (value > budget) {
      console.warn(`Performance budget exceeded for ${metric}: ${value}ms (budget: ${budget}ms)`);
    }
  });
}