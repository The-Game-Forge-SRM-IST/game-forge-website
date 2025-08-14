'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useWebGLCapabilities } from '@/utils/webglDetection';

interface PerformanceMonitorProps {
  showInProduction?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export default function PerformanceMonitor({
  showInProduction = false,
  position = 'bottom-right',
  className = ''
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { fps, isLowPerformance, deviceTier } = usePerformanceMonitor();
  const { capabilities, isLoading } = useWebGLCapabilities();

  // Only show in development or if explicitly enabled for production
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    // Show monitor after a delay to avoid interfering with initial load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  // Keyboard shortcut to toggle monitor
  useEffect(() => {
    if (!shouldShow) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shouldShow]);

  if (!shouldShow || !isVisible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDeviceTierColor = (tier: string) => {
    switch (tier) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
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
      <div className="bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden">
        {/* Compact View */}
        <motion.div
          className="p-3 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isLowPerformance ? 'bg-red-400' : 'bg-green-400'}`} />
            <span className={getFPSColor(fps)}>{fps} FPS</span>
            <span className="text-gray-400">|</span>
            <span className={getDeviceTierColor(deviceTier)}>{deviceTier.toUpperCase()}</span>
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
              <div className="p-4 space-y-3 text-sm">
                {/* Performance Metrics */}
                <div>
                  <h4 className="text-white font-medium mb-2">Performance</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">FPS:</span>
                      <span className={getFPSColor(fps)}>{fps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Device Tier:</span>
                      <span className={getDeviceTierColor(deviceTier)}>{deviceTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Low Performance:</span>
                      <span className={isLowPerformance ? 'text-red-400' : 'text-green-400'}>
                        {isLowPerformance ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* WebGL Capabilities */}
                {!isLoading && capabilities && (
                  <div>
                    <h4 className="text-white font-medium mb-2">WebGL</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Supported:</span>
                        <span className={capabilities.supported ? 'text-green-400' : 'text-red-400'}>
                          {capabilities.supported ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {capabilities.supported && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Version:</span>
                            <span className="text-blue-400">{capabilities.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Max Texture:</span>
                            <span className="text-gray-300">{capabilities.maxTextureSize}px</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Max Particles:</span>
                            <span className="text-gray-300">{capabilities.recommendedSettings.maxParticles}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Complex Effects:</span>
                            <span className={capabilities.recommendedSettings.enableComplexEffects ? 'text-green-400' : 'text-red-400'}>
                              {capabilities.recommendedSettings.enableComplexEffects ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* System Info */}
                <div>
                  <h4 className="text-white font-medium mb-2">System</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">CPU Cores:</span>
                      <span className="text-gray-300">{navigator.hardwareConcurrency || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory:</span>
                      <span className="text-gray-300">
                        {(navigator as { deviceMemory?: number }).deviceMemory 
                          ? `${(navigator as { deviceMemory?: number }).deviceMemory}GB` 
                          : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pixel Ratio:</span>
                      <span className="text-gray-300">{window.devicePixelRatio}</span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-2 border-t border-gray-700/50">
                  <div className="text-xs text-gray-400 text-center">
                    Press Ctrl+Shift+P to toggle
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

// Hook for performance-based conditional rendering
export function usePerformanceOptimization() {
  const { isLowPerformance, deviceTier } = usePerformanceMonitor();
  const { capabilities } = useWebGLCapabilities();

  return {
    shouldReduceAnimations: isLowPerformance,
    shouldDisableParticles: deviceTier === 'low',
    shouldUseSimpleEffects: !capabilities?.recommendedSettings.enableComplexEffects,
    maxParticles: capabilities?.recommendedSettings.maxParticles || 300,
    deviceTier,
    isLowPerformance
  };
}

// Component wrapper for performance-based rendering
export function PerformanceOptimized({
  children,
  fallback,
  requireHighPerformance = false,
  requireWebGL = false
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireHighPerformance?: boolean;
  requireWebGL?: boolean;
}) {
  const { isLowPerformance } = usePerformanceMonitor();
  const { capabilities } = useWebGLCapabilities();

  const shouldRenderFallback = 
    (requireHighPerformance && isLowPerformance) ||
    (requireWebGL && !capabilities?.supported);

  if (shouldRenderFallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}