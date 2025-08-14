'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExtremeLoadingScreen from './ExtremeLoadingScreen';
import ExtremePerformanceMonitor from './ExtremePerformanceMonitor';
import ExtremeOptimizedThreeBackground from '../three/ExtremeOptimizedThreeBackground';
import { extremeOptimizationCoordinator, PERFORMANCE_TARGETS } from '@/lib/extremeOptimization';
import { initializeCriticalResources } from '@/lib/resourcePreloader';
import { useExtremePerformance } from '@/hooks/useExtremePerformance';

interface ExtremePerformanceAppProps {
  children: React.ReactNode;
  showPerformanceMonitor?: boolean;
  targetFPS?: number;
  enableThreeBackground?: boolean;
  className?: string;
}

export default function ExtremePerformanceApp({
  children,
  showPerformanceMonitor = process.env.NODE_ENV === 'development',
  targetFPS = PERFORMANCE_TARGETS.TARGET_FPS,
  enableThreeBackground = true,
  className = ''
}: ExtremePerformanceAppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  // Initialize extreme performance systems
  const {
    summary,
    qualitySettings,
    isTargetFPS,
    triggerOptimization,
    clearCaches
  } = useExtremePerformance({
    targetFPS,
    enableAdaptiveQuality: true,
    enableMemoryManagement: true,
    enableCaching: true,
    optimizationThreshold: 0.7 // More lenient threshold for better visuals
  });

  // Initialize systems on mount
  useEffect(() => {
    const initializeSystems = async () => {
      try {
        // Initialize extreme optimization coordinator
        extremeOptimizationCoordinator.initialize();
        
        // Initialize critical resources
        initializeCriticalResources();
        
        // Preload critical resources
        await extremeOptimizationCoordinator.preloadCriticalResources();
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize extreme performance systems:', error);
        setIsInitialized(true); // Continue anyway
      }
    };

    initializeSystems();

    return () => {
      // Cleanup on unmount
      extremeOptimizationCoordinator.dispose();
    };
  }, []);

  // Handle scroll progress for Three.js background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(Math.min(scrollPercent, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle section detection for optimizations
  useEffect(() => {
    const handleSectionChange = () => {
      const sections = ['home', 'about', 'projects', 'team', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        }
        return false;
      });
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleSectionChange, { passive: true });
    return () => window.removeEventListener('scroll', handleSectionChange);
  }, [activeSection]);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Emergency optimization trigger
  useEffect(() => {
    if (summary?.overall === 'poor' && !isLoading) {
      console.warn('Poor performance detected, triggering emergency optimization');
      triggerOptimization();
    }
  }, [summary?.overall, isLoading, triggerOptimization]);

  // Keyboard shortcuts for performance control
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key) {
          case 'O':
            event.preventDefault();
            triggerOptimization();
            break;
          case 'C':
            event.preventDefault();
            clearCaches();
            break;
          case 'R':
            event.preventDefault();
            window.location.reload();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [triggerOptimization, clearCaches]);

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <ExtremeLoadingScreen
            onLoadingComplete={handleLoadingComplete}
            showPerformanceInfo={true}
            targetFPS={targetFPS}
          />
        )}
      </AnimatePresence>

      {/* Three.js Background */}
      {enableThreeBackground && !isLoading && isInitialized && (
        <ExtremeOptimizedThreeBackground
          scrollProgress={scrollProgress}
          activeSection={activeSection}
          className="fixed inset-0 -z-10"
        />
      )}

      {/* Main Content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Monitor */}
      {showPerformanceMonitor && !isLoading && (
        <ExtremePerformanceMonitor
          showInProduction={false}
          position="bottom-right"
          autoOptimize={true}
        />
      )}

      {/* Performance Status Indicator */}
      {!isLoading && summary && (
        <motion.div
          className="fixed top-4 left-4 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isTargetFPS ? 'bg-cyan-400' : 
                summary.fps >= 60 ? 'bg-green-400' : 
                summary.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span className="text-white text-sm font-medium">
                {summary.fps}fps
              </span>
              {isTargetFPS && (
                <span className="text-cyan-400 text-xs">
                  {targetFPS}+
                </span>
              )}
              <span className="text-gray-400 text-xs">
                {qualitySettings.maxParticles}p
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Performance Warnings */}
      <AnimatePresence>
        {!isLoading && summary?.overall === 'poor' && (
          <motion.div
            className="fixed top-4 right-4 z-40 max-w-sm"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="bg-red-900/90 backdrop-blur-sm rounded-lg p-4 border border-red-500/50">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">
                    Performance Warning
                  </h4>
                  <p className="text-red-200 text-xs mb-2">
                    Low performance detected. Consider reducing quality settings.
                  </p>
                  <button
                    onClick={triggerOptimization}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    Optimize Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && !isLoading && (
        <div className="fixed bottom-4 left-4 z-40 text-xs text-gray-500 font-mono">
          <div>Target: {targetFPS}fps</div>
          <div>Quality: {qualitySettings.maxParticles}p</div>
          <div>Memory: {Math.round((summary?.memoryUsageMB || 0))}MB</div>
          <div className="mt-1 text-gray-600">
            Ctrl+Shift+O: Optimize | Ctrl+Shift+C: Clear Cache
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for using extreme performance app
export function useExtremePerformanceApp() {
  const [isReady, setIsReady] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');

  const { summary } = useExtremePerformance();

  useEffect(() => {
    if (summary) {
      setPerformanceLevel(summary.overall as any);
      setIsReady(true);
    }
  }, [summary]);

  return {
    isReady,
    performanceLevel,
    isHighPerformance: performanceLevel === 'excellent',
    needsOptimization: performanceLevel === 'poor',
  };
}