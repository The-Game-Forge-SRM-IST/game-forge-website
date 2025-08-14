import { useEffect, useRef, useState } from 'react';
import { FPSMonitor, getMemoryUsage } from '@/lib/performance';

interface PerformanceMetrics {
  fps: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  isLowPerformance: boolean;
  deviceTier: 'low' | 'medium' | 'high';
}

export function usePerformanceMonitor(enabled = process.env.NODE_ENV === 'development') {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    isLowPerformance: false,
    deviceTier: 'medium',
  });
  
  const fpsMonitor = useRef<FPSMonitor | null>(null);
  const memoryCheckInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Initialize FPS monitoring
    fpsMonitor.current = new FPSMonitor((fps) => {
      const deviceTier = fps >= 50 ? 'high' : fps >= 30 ? 'medium' : 'low';
      setMetrics(prev => ({
        ...prev,
        fps,
        isLowPerformance: fps < 30,
        deviceTier,
      }));
    });

    fpsMonitor.current.start();

    // Memory monitoring (every 5 seconds)
    memoryCheckInterval.current = setInterval(() => {
      const memory = getMemoryUsage();
      if (memory) {
        setMetrics(prev => ({
          ...prev,
          memory,
        }));
      }
    }, 5000);

    return () => {
      fpsMonitor.current?.stop();
      if (memoryCheckInterval.current) {
        clearInterval(memoryCheckInterval.current);
      }
    };
  }, [enabled]);

  return metrics;
}

// Hook for adaptive quality based on performance
export function useAdaptiveQuality() {
  const { fps, isLowPerformance } = usePerformanceMonitor();
  
  const getQualityLevel = () => {
    if (fps >= 50) return 'high';
    if (fps >= 30) return 'medium';
    return 'low';
  };

  const getParticleCount = (baseCount: number) => {
    const quality = getQualityLevel();
    switch (quality) {
      case 'high': return baseCount;
      case 'medium': return Math.floor(baseCount * 0.7);
      case 'low': return Math.floor(baseCount * 0.4);
      default: return baseCount;
    }
  };

  const getAnimationDuration = (baseDuration: number) => {
    const quality = getQualityLevel();
    switch (quality) {
      case 'high': return baseDuration;
      case 'medium': return baseDuration * 1.2;
      case 'low': return baseDuration * 1.5;
      default: return baseDuration;
    }
  };

  const shouldReduceMotion = () => {
    // Check for user preference
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return true;
    }
    
    return isLowPerformance;
  };

  return {
    qualityLevel: getQualityLevel(),
    isLowPerformance,
    fps,
    deviceTier: getQualityLevel() as 'low' | 'medium' | 'high',
    getParticleCount,
    getAnimationDuration,
    shouldReduceMotion,
  };
}