'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExtremePerformance } from '@/hooks/useExtremePerformance';
import { PERFORMANCE_TARGETS } from '@/lib/extremeOptimization';

interface ExtremePerformanceMonitorProps {
  showInProduction?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  autoOptimize?: boolean;
}

export default function ExtremePerformanceMonitor({
  showInProduction = false,
  position = 'bottom-right',
  className = '',
  autoOptimize = true
}: ExtremePerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const {
    metrics,
    qualityLevel,
    qualitySettings,
    memoryUsage,
    cacheStats,
    isOptimizing,
    recommendations,
    summary,
    triggerOptimization,
    clearCaches,
    setQualityLevel,
    isTargetFPS,
    isCriticalFPS,
    isLowFPS
  } = useExtremePerformance({
    targetFPS: 120,
    enableAdaptiveQuality: true,
    enableMemoryManagement: true,
    enableCaching: true,
    optimizationThreshold: 0.8
  });

  // Only show in development or if explicitly enabled for production
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    // Show monitor after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!shouldShow) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key) {
          case 'P':
            setIsVisible(prev => !prev);
            break;
          case 'O':
            triggerOptimization();
            break;
          case 'C':
            clearCaches();
            break;
          case 'Q':
            // Cycle through quality levels
            const levels = ['minimal', 'low', 'medium', 'high', 'ultra'] as const;
            const currentIndex = levels.indexOf(qualityLevel);
            const nextIndex = (currentIndex + 1) % levels.length;
            setQualityLevel(levels[nextIndex]);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shouldShow, qualityLevel, triggerOptimization, clearCaches, setQualityLevel]);

  // Auto-optimization
  useEffect(() => {
    if (autoOptimize && summary?.overall === 'poor' && !isOptimizing) {
      triggerOptimization();
    }
  }, [autoOptimize, summary?.overall, isOptimizing, triggerOptimization]);

  if (!shouldShow || !isVisible || !metrics) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getFPSColor = (fps: number) => {
    if (fps >= PERFORMANCE_TARGETS.TARGET_FPS) return 'text-cyan-400';
    if (fps >= PERFORMANCE_TARGETS.CRITICAL_FPS) return 'text-green-400';
    if (fps >= PERFORMANCE_TARGETS.LOW_FPS) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityColor = (level: string) => {
    switch (level) {
      case 'ultra': return 'text-cyan-400';
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-orange-400';
      case 'minimal': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getOverallColor = (overall: string) => {
    switch (overall) {
      case 'excellent': return 'text-cyan-400';
      case 'good': return 'text-green-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className={`fixed z-50 ${positionClasses[position]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/90 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden shadow-2xl">
        {/* Compact View */}
        <motion.div
          className="p-3 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <div className="flex items-center gap-2 text-sm">
            {/* Status indicator */}
            <div className={`w-2 h-2 rounded-full ${
              isTargetFPS ? 'bg-cyan-400' : 
              isCriticalFPS ? 'bg-yellow-400' : 
              'bg-red-400'
            } ${isOptimizing ? 'animate-pulse' : ''}`} />
            
            {/* FPS */}
            <span className={getFPSColor(metrics.fps)}>
              {metrics.fps}fps
            </span>
            
            <span className="text-gray-400">|</span>
            
            {/* Quality */}
            <span className={getQualityColor(qualityLevel)}>
              {qualityLevel.toUpperCase()}
            </span>
            
            {/* Target FPS indicator */}
            {isTargetFPS && (
              <span className="text-cyan-400 text-xs">120+</span>
            )}
            
            {/* Optimization indicator */}
            {isOptimizing && (
              <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </motion.div>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-4 space-y-4 text-sm max-h-96 overflow-y-auto">
                {/* Performance Summary */}
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    Performance Summary
                    {summary && (
                      <span className={`text-xs px-2 py-1 rounded ${getOverallColor(summary.overall)} bg-gray-800`}>
                        {summary.overall.toUpperCase()}
                      </span>
                    )}
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">FPS:</span>
                      <span className={getFPSColor(metrics.fps)}>
                        {metrics.fps} / {PERFORMANCE_TARGETS.TARGET_FPS}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Frame Time:</span>
                      <span className="text-gray-300">
                        {metrics.avgFrameTime.toFixed(2)}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Stability:</span>
                      <span className={metrics.stability > 0.8 ? 'text-green-400' : 'text-yellow-400'}>
                        {Math.round(metrics.stability * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Frame Drops:</span>
                      <span className={metrics.frameDrops > 5 ? 'text-red-400' : 'text-green-400'}>
                        {metrics.frameDrops}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quality Settings */}
                <div>
                  <h4 className="text-white font-medium mb-2">Quality Settings</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Level:</span>
                      <span className={getQualityColor(qualityLevel)}>{qualityLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Particles:</span>
                      <span className="text-gray-300">{qualitySettings.maxParticles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Complex Effects:</span>
                      <span className={qualitySettings.enableComplexEffects ? 'text-green-400' : 'text-red-400'}>
                        {qualitySettings.enableComplexEffects ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pixel Ratio:</span>
                      <span className="text-gray-300">{qualitySettings.pixelRatio}x</span>
                    </div>
                  </div>
                </div>

                {/* Memory Usage */}
                <div>
                  <h4 className="text-white font-medium mb-2">Memory Usage</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">JS Heap:</span>
                      <span className="text-gray-300">
                        {Math.round(memoryUsage / (1024 * 1024))}MB
                      </span>
                    </div>
                    {cacheStats.textures && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Texture Cache:</span>
                        <span className="text-gray-300">
                          {cacheStats.textures.size}/{cacheStats.textures.maxSize}
                        </span>
                      </div>
                    )}
                    {cacheStats.geometries && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Geometry Cache:</span>
                        <span className="text-gray-300">
                          {cacheStats.geometries.size}/{cacheStats.geometries.maxSize}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div>
                    <h4 
                      className="text-white font-medium mb-2 cursor-pointer flex items-center gap-2"
                      onClick={() => setShowRecommendations(!showRecommendations)}
                    >
                      Recommendations ({recommendations.length})
                      <span className={`transform transition-transform ${showRecommendations ? 'rotate-90' : ''}`}>
                        ▶
                      </span>
                    </h4>
                    <AnimatePresence>
                      {showRecommendations && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-1 text-xs"
                        >
                          {recommendations.slice(0, 5).map((rec, index) => (
                            <div key={index} className="text-yellow-400 bg-yellow-400/10 p-2 rounded">
                              {rec}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Controls */}
                <div className="pt-2 border-t border-gray-700/50">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={triggerOptimization}
                      disabled={isOptimizing}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors"
                    >
                      {isOptimizing ? 'Optimizing...' : 'Optimize'}
                    </button>
                    <button
                      onClick={clearCaches}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                    >
                      Clear Cache
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Ctrl+Shift+P: Toggle</div>
                    <div>Ctrl+Shift+O: Optimize</div>
                    <div>Ctrl+Shift+C: Clear Cache</div>
                    <div>Ctrl+Shift+Q: Cycle Quality</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Performance badge component for showing current status
export function PerformanceBadge({ className = '' }: { className?: string }) {
  const { summary, isTargetFPS } = useExtremePerformance();
  
  if (!summary) return null;

  const getStatusColor = (overall: string) => {
    switch (overall) {
      case 'excellent': return 'bg-cyan-500';
      case 'good': return 'bg-green-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor(summary.overall)}`} />
      <span className="text-white text-sm font-medium">
        {summary.fps}fps
      </span>
      {isTargetFPS && (
        <span className="text-cyan-400 text-xs">120+</span>
      )}
    </div>
  );
}