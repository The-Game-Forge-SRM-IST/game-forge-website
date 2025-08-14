import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ExtremeFPSMonitor, 
  MemoryManager, 
  AdaptiveQualityManager,
  FrameRateLimiter,
  PERFORMANCE_TARGETS,
  type PerformanceMetrics,
  type QualityLevel,
  type QualitySettings
} from '@/lib/extremeOptimization';
import { smartResourceManager } from '@/lib/advancedCaching';

interface ExtremePerformanceState {
  metrics: PerformanceMetrics | null;
  qualityLevel: QualityLevel;
  qualitySettings: QualitySettings;
  memoryUsage: number;
  cacheStats: any;
  isOptimizing: boolean;
  recommendations: string[];
}

interface ExtremePerformanceOptions {
  targetFPS?: number;
  enableAdaptiveQuality?: boolean;
  enableMemoryManagement?: boolean;
  enableCaching?: boolean;
  monitoringInterval?: number;
  optimizationThreshold?: number;
}

export function useExtremePerformance(options: ExtremePerformanceOptions = {}) {
  const {
    targetFPS = PERFORMANCE_TARGETS.TARGET_FPS,
    enableAdaptiveQuality = true,
    enableMemoryManagement = true,
    enableCaching = true,
    monitoringInterval = 1000,
    optimizationThreshold = 0.8
  } = options;

  // State
  const [state, setState] = useState<ExtremePerformanceState>({
    metrics: null,
    qualityLevel: 'high',
    qualitySettings: AdaptiveQualityManager.getInstance().getQualitySettings(),
    memoryUsage: 0,
    cacheStats: {},
    isOptimizing: false,
    recommendations: []
  });

  // Refs for managers
  const fpsMonitor = useRef<ExtremeFPSMonitor | null>(null);
  const memoryManager = useRef(MemoryManager.getInstance());
  const qualityManager = useRef(AdaptiveQualityManager.getInstance());
  const frameRateLimiter = useRef(new FrameRateLimiter(targetFPS));
  const lastOptimizationTime = useRef(0);
  const performanceHistory = useRef<PerformanceMetrics[]>([]);

  // Performance analysis
  const analyzePerformance = useCallback((metrics: PerformanceMetrics): string[] => {
    const recommendations: string[] = [];
    
    // FPS analysis
    if (metrics.fps < PERFORMANCE_TARGETS.LOW_FPS) {
      recommendations.push('Critical: FPS below 30. Consider reducing particle count and disabling complex effects.');
    } else if (metrics.fps < PERFORMANCE_TARGETS.CRITICAL_FPS) {
      recommendations.push('Warning: FPS below 60. Consider reducing animation quality.');
    } else if (metrics.fps >= PERFORMANCE_TARGETS.TARGET_FPS) {
      recommendations.push('Excellent: Target 120fps achieved. Consider enabling ultra quality.');
    }

    // Frame time analysis
    if (metrics.maxFrameTime > PERFORMANCE_TARGETS.FRAME_TIME_MS * 3) {
      recommendations.push('High frame time variance detected. Consider optimizing animation loops.');
    }

    // Stability analysis
    if (metrics.stability < 0.7) {
      recommendations.push('Low frame rate stability. Consider reducing dynamic effects.');
    }

    // Frame drops analysis
    if (metrics.frameDrops > 5) {
      recommendations.push(`${metrics.frameDrops} frame drops detected. Consider memory optimization.`);
    }

    // Memory analysis
    const memoryUsage = memoryManager.current.getMemoryUsage();
    if (memoryUsage > PERFORMANCE_TARGETS.MEMORY_THRESHOLD_MB * 1024 * 1024) {
      recommendations.push('High memory usage detected. Consider clearing caches.');
    }

    return recommendations;
  }, []);

  // Automatic optimization
  const performOptimization = useCallback(async () => {
    if (state.isOptimizing) return;
    
    setState(prev => ({ ...prev, isOptimizing: true }));
    
    try {
      // Memory optimization
      if (enableMemoryManagement) {
        memoryManager.current.forceGarbageCollection();
      }

      // Cache optimization
      if (enableCaching) {
        smartResourceManager.optimizeMemoryUsage();
      }

      // Quality adjustment based on performance history
      if (enableAdaptiveQuality && performanceHistory.current.length > 5) {
        const avgFPS = performanceHistory.current
          .slice(-5)
          .reduce((sum, m) => sum + m.fps, 0) / 5;
        
        const avgStability = performanceHistory.current
          .slice(-5)
          .reduce((sum, m) => sum + m.stability, 0) / 5;

        // Adjust frame rate limiter based on performance
        if (avgFPS < PERFORMANCE_TARGETS.CRITICAL_FPS) {
          frameRateLimiter.current.setTargetFPS(60);
        } else if (avgFPS >= PERFORMANCE_TARGETS.TARGET_FPS && avgStability > 0.9) {
          frameRateLimiter.current.setTargetFPS(PERFORMANCE_TARGETS.TARGET_FPS);
        }
      }

      // Small delay to let optimizations take effect
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } finally {
      setState(prev => ({ ...prev, isOptimizing: false }));
    }
  }, [state.isOptimizing, enableMemoryManagement, enableCaching, enableAdaptiveQuality]);

  // Performance metrics callback
  const handlePerformanceUpdate = useCallback((metrics: PerformanceMetrics) => {
    // Update performance history
    performanceHistory.current.push(metrics);
    if (performanceHistory.current.length > 20) {
      performanceHistory.current.shift();
    }

    // Update quality if adaptive quality is enabled
    let newQualityLevel = state.qualityLevel;
    let newQualitySettings = state.qualitySettings;
    
    if (enableAdaptiveQuality) {
      newQualityLevel = qualityManager.current.updateQuality(metrics);
      newQualitySettings = qualityManager.current.getQualitySettings();
    }

    // Get memory usage
    const memoryUsage = memoryManager.current.getMemoryUsage();
    
    // Get cache stats
    const cacheStats = enableCaching ? smartResourceManager.getCacheStats() : {};
    
    // Analyze performance and get recommendations
    const recommendations = analyzePerformance(metrics);
    
    // Update state
    setState({
      metrics,
      qualityLevel: newQualityLevel,
      qualitySettings: newQualitySettings,
      memoryUsage,
      cacheStats,
      isOptimizing: state.isOptimizing,
      recommendations
    });

    // Trigger automatic optimization if performance is poor
    const now = performance.now();
    const shouldOptimize = (
      (metrics.fps < PERFORMANCE_TARGETS.CRITICAL_FPS || metrics.stability < optimizationThreshold) &&
      now - lastOptimizationTime.current > 10000 // Don't optimize more than once per 10 seconds
    );

    if (shouldOptimize) {
      lastOptimizationTime.current = now;
      performOptimization();
    }
  }, [state.qualityLevel, state.qualitySettings, state.isOptimizing, enableAdaptiveQuality, enableCaching, analyzePerformance, optimizationThreshold, performOptimization]);

  // Initialize monitoring
  useEffect(() => {
    fpsMonitor.current = new ExtremeFPSMonitor(handlePerformanceUpdate);
    fpsMonitor.current.start();

    return () => {
      fpsMonitor.current?.stop();
    };
  }, [handlePerformanceUpdate]);

  // Periodic cache and memory monitoring
  useEffect(() => {
    if (!enableMemoryManagement && !enableCaching) return;

    const interval = setInterval(() => {
      const memoryUsage = memoryManager.current.getMemoryUsage();
      const cacheStats = enableCaching ? smartResourceManager.getCacheStats() : {};
      
      setState(prev => ({
        ...prev,
        memoryUsage,
        cacheStats
      }));
    }, monitoringInterval);

    return () => clearInterval(interval);
  }, [enableMemoryManagement, enableCaching, monitoringInterval]);

  // Manual optimization trigger
  const triggerOptimization = useCallback(() => {
    performOptimization();
  }, [performOptimization]);

  // Quality control
  const setQualityLevel = useCallback((level: QualityLevel) => {
    qualityManager.current['currentQuality'] = level;
    const settings = qualityManager.current.getQualitySettings();
    setState(prev => ({
      ...prev,
      qualityLevel: level,
      qualitySettings: settings
    }));
  }, []);

  // Cache control
  const clearCaches = useCallback(() => {
    if (enableCaching) {
      smartResourceManager.clearAllCaches();
      setState(prev => ({
        ...prev,
        cacheStats: smartResourceManager.getCacheStats()
      }));
    }
  }, [enableCaching]);

  // Preload resources
  const preloadResources = useCallback(async (onProgress?: (progress: number) => void) => {
    if (enableCaching) {
      await smartResourceManager.preloadAll(onProgress);
    }
  }, [enableCaching]);

  // Performance summary
  const getPerformanceSummary = useCallback(() => {
    if (!state.metrics) return null;

    const { metrics } = state;
    return {
      overall: metrics.fps >= PERFORMANCE_TARGETS.TARGET_FPS ? 'excellent' : 
               metrics.fps >= PERFORMANCE_TARGETS.CRITICAL_FPS ? 'good' : 
               metrics.fps >= PERFORMANCE_TARGETS.LOW_FPS ? 'fair' : 'poor',
      fps: metrics.fps,
      stability: Math.round(metrics.stability * 100),
      memoryUsageMB: Math.round(state.memoryUsage / (1024 * 1024)),
      qualityLevel: state.qualityLevel,
      recommendations: state.recommendations.slice(0, 3), // Top 3 recommendations
    };
  }, [state]);

  return {
    // Current state
    ...state,
    
    // Performance summary
    summary: getPerformanceSummary(),
    
    // Control functions
    triggerOptimization,
    setQualityLevel,
    clearCaches,
    preloadResources,
    
    // Frame rate limiter
    shouldRender: () => frameRateLimiter.current.shouldRender(),
    
    // Utility functions
    isTargetFPS: state.metrics?.isTargetFPS ?? false,
    isCriticalFPS: state.metrics?.isCriticalFPS ?? false,
    isLowFPS: state.metrics?.isLowFPS ?? false,
    
    // Performance history
    getPerformanceHistory: () => [...performanceHistory.current],
    
    // Configuration
    config: {
      targetFPS,
      enableAdaptiveQuality,
      enableMemoryManagement,
      enableCaching,
      monitoringInterval,
      optimizationThreshold
    }
  };
}

// Hook for component-level performance optimization
export function useComponentPerformance(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(0);
  const renderTimes = useRef<number[]>([]);
  
  const trackRender = useCallback(() => {
    const now = performance.now();
    renderCount.current++;
    
    if (lastRenderTime.current > 0) {
      const renderTime = now - lastRenderTime.current;
      renderTimes.current.push(renderTime);
      
      // Keep only last 10 render times
      if (renderTimes.current.length > 10) {
        renderTimes.current.shift();
      }
    }
    
    lastRenderTime.current = now;
  }, []);

  const getComponentStats = useCallback(() => {
    const avgRenderTime = renderTimes.current.length > 0 
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length 
      : 0;
    
    return {
      componentName,
      renderCount: renderCount.current,
      avgRenderTime: Math.round(avgRenderTime * 100) / 100,
      maxRenderTime: renderTimes.current.length > 0 ? Math.max(...renderTimes.current) : 0,
      isPerformant: avgRenderTime < 16.67, // 60fps threshold
    };
  }, [componentName]);

  return {
    trackRender,
    getComponentStats,
  };
}