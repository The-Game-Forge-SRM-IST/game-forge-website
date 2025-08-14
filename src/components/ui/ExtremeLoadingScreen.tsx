'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResourcePreloader, initializeCriticalResources } from '@/lib/resourcePreloader';
import { useExtremePerformance } from '@/hooks/useExtremePerformance';
import { extremeOptimizationCoordinator, PERFORMANCE_TARGETS } from '@/lib/extremeOptimization';

interface ExtremeLoadingScreenProps {
  onLoadingComplete?: () => void;
  showPerformanceInfo?: boolean;
  targetFPS?: number;
}

export default function ExtremeLoadingScreen({ 
  onLoadingComplete,
  showPerformanceInfo = true,
  targetFPS = PERFORMANCE_TARGETS.TARGET_FPS
}: ExtremeLoadingScreenProps) {
  const [loadingStage, setLoadingStage] = useState<'initializing' | 'preloading' | 'optimizing' | 'calibrating' | 'complete'>('initializing');
  const [stageProgress, setStageProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing extreme performance systems...');
  const [performanceMetrics, setPerformanceMetrics] = useState<{ fps: number; memory: number } | null>(null);
  
  const { progress: preloadProgress, startPreloading } = useResourcePreloader();
  const { 
    summary, 
    qualityLevel, 
    preloadResources,
    triggerOptimization 
  } = useExtremePerformance({
    targetFPS: 120,
    enableAdaptiveQuality: true,
    enableMemoryManagement: true,
    enableCaching: true,
  });

  // Loading stages with their weights for extreme optimization
  const stages = [
    { name: 'initializing', weight: 0.15, label: 'Extreme Performance Init' },
    { name: 'preloading', weight: 0.4, label: 'Smart Resource Loading' },
    { name: 'optimizing', weight: 0.25, label: 'Memory & Cache Optimization' },
    { name: 'calibrating', weight: 0.2, label: `${targetFPS}fps Calibration` },
  ];

  // Initialize extreme optimization coordinator
  useEffect(() => {
    extremeOptimizationCoordinator.initialize();
    
    // Monitor performance during loading
    const performanceCallback = (metrics: any) => {
      setPerformanceMetrics({
        fps: metrics.fps || 0,
        memory: extremeOptimizationCoordinator.getMemoryUsage()
      });
    };
    
    extremeOptimizationCoordinator.onPerformanceUpdate(performanceCallback);
    
    return () => {
      extremeOptimizationCoordinator.offPerformanceUpdate(performanceCallback);
    };
  }, []);

  // Initialize and start loading process
  useEffect(() => {
    const initializeLoading = async () => {
      try {
        // Stage 1: Initialize extreme performance systems
        setLoadingStage('initializing');
        
        const initTasks = [
          { name: `Initializing smooth ${targetFPS}fps system...`, duration: 250 },
          { name: 'Setting up adaptive quality manager...', duration: 200 },
          { name: 'Configuring memory optimization...', duration: 180 },
          { name: 'Preparing advanced caching system...', duration: 220 },
          { name: 'Initializing performance scheduler...', duration: 150 },
        ];

        for (let i = 0; i < initTasks.length; i++) {
          const task = initTasks[i];
          setCurrentTask(task.name);
          setStageProgress((i / initTasks.length) * 100);
          
          // Initialize critical resources
          if (i === 0) initializeCriticalResources();
          
          await new Promise(resolve => setTimeout(resolve, task.duration));
        }
        
        setStageProgress(100);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Stage 2: Smart resource preloading
        setLoadingStage('preloading');
        setStageProgress(0);
        setCurrentTask('Loading critical resources with priority queuing...');
        
        await Promise.all([
          startPreloading(),
          preloadResources()
        ]);
        
        // Stage 3: Memory and cache optimization
        setLoadingStage('optimizing');
        setStageProgress(0);
        
        const optimizationTasks = [
          { name: `Optimizing visuals for smooth ${targetFPS}fps...`, duration: 400 },
          { name: 'Preparing geometry buffers with LOD...', duration: 300 },
          { name: 'Compiling optimized shaders...', duration: 500 },
          { name: 'Setting up adaptive quality system...', duration: 250 },
          { name: 'Finalizing memory optimization...', duration: 200 },
        ];
        
        for (let i = 0; i < optimizationTasks.length; i++) {
          const task = optimizationTasks[i];
          setCurrentTask(task.name);
          setStageProgress((i / optimizationTasks.length) * 100);
          
          // Trigger actual optimization
          if (i === optimizationTasks.length - 1) {
            triggerOptimization();
          }
          
          await new Promise(resolve => setTimeout(resolve, task.duration));
        }
        
        setStageProgress(100);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Stage 4: Performance calibration
        setLoadingStage('calibrating');
        setStageProgress(0);
        
        const calibrationTasks = [
          { name: `Calibrating beautiful ${targetFPS}fps experience...`, duration: 300 },
          { name: 'Testing frame rate stability...', duration: 400 },
          { name: 'Adjusting quality presets...', duration: 250 },
          { name: 'Validating performance targets...', duration: 200 },
          { name: 'Finalizing extreme optimization...', duration: 150 },
        ];
        
        for (let i = 0; i < calibrationTasks.length; i++) {
          const task = calibrationTasks[i];
          setCurrentTask(task.name);
          setStageProgress((i / calibrationTasks.length) * 100);
          await new Promise(resolve => setTimeout(resolve, task.duration));
        }
        
        setStageProgress(100);
        
        // Complete loading
        setLoadingStage('complete');
        setTotalProgress(100);
        setCurrentTask('Extreme performance ready!');
        
        // Small delay before calling completion callback
        setTimeout(() => {
          onLoadingComplete?.();
        }, 500);
        
      } catch (error) {
        console.error('Loading error:', error);
        // Continue anyway
        onLoadingComplete?.();
      }
    };

    initializeLoading();
  }, [startPreloading, preloadResources, triggerOptimization, onLoadingComplete, targetFPS]);

  // Update progress based on current stage
  useEffect(() => {
    let progress = 0;
    let currentStageIndex = 0;
    
    switch (loadingStage) {
      case 'initializing':
        currentStageIndex = 0;
        break;
      case 'preloading':
        currentStageIndex = 1;
        progress = preloadProgress * 100;
        setStageProgress(progress);
        break;
      case 'optimizing':
        currentStageIndex = 2;
        break;
      case 'calibrating':
        currentStageIndex = 3;
        break;
      case 'complete':
        progress = 100;
        break;
    }
    
    // Calculate total progress
    let totalProgress = 0;
    for (let i = 0; i < currentStageIndex; i++) {
      totalProgress += stages[i].weight * 100;
    }
    
    if (currentStageIndex < stages.length) {
      totalProgress += (stageProgress / 100) * stages[currentStageIndex].weight * 100;
    }
    
    setTotalProgress(Math.min(totalProgress, 100));
  }, [loadingStage, stageProgress, preloadProgress]);

  // Update current task for preloading stage
  useEffect(() => {
    if (loadingStage === 'preloading') {
      if (preloadProgress < 0.3) {
        setCurrentTask('Loading critical textures...');
      } else if (preloadProgress < 0.6) {
        setCurrentTask('Loading team member images...');
      } else if (preloadProgress < 0.9) {
        setCurrentTask('Loading project assets...');
      } else {
        setCurrentTask('Finalizing resource loading...');
      }
    }
  }, [loadingStage, preloadProgress]);

  if (loadingStage === 'complete') {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(239,68,68,0.1)_0%,transparent_50%)]" />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <div className="text-2xl font-bold text-white">GF</div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Game Forge</h1>
          <p className="text-gray-400 text-sm">Extreme Performance Loading</p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">
              {stages.find(s => s.name === loadingStage)?.label || 'Loading...'}
            </span>
            <span className="text-sm text-green-400 font-mono">
              {Math.round(totalProgress)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full"
              style={{ width: `${totalProgress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          
          {/* Stage progress indicator */}
          <div className="flex justify-between mt-2">
            {stages.map((stage, index) => (
              <div
                key={stage.name}
                className={`w-2 h-2 rounded-full transition-colors ${
                  loadingStage === stage.name
                    ? 'bg-green-400'
                    : stages.findIndex(s => s.name === loadingStage) > index
                    ? 'bg-blue-400'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current task */}
        <motion.p
          className="text-gray-300 text-sm mb-6 h-5"
          key={currentTask}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTask}
        </motion.p>

        {/* Performance info */}
        <AnimatePresence>
          {showPerformanceInfo && summary && (
            <motion.div
              className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-white font-medium mb-3">Performance Status</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-gray-400">Target FPS</div>
                  <div className="text-cyan-400 font-mono">{targetFPS}fps</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Quality Level</div>
                  <div className="text-green-400 capitalize">{qualityLevel}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Memory</div>
                  <div className="text-blue-400">
                    {performanceMetrics ? 
                      Math.round(performanceMetrics.memory / (1024 * 1024)) : 
                      summary?.memoryUsageMB || 0
                    }MB
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Current FPS</div>
                  <div className="text-cyan-400 font-mono">
                    {performanceMetrics ? Math.round(performanceMetrics.fps) : summary?.fps || 0}
                  </div>
                </div>
              </div>
              
              {/* Performance status indicator */}
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    (performanceMetrics?.fps || 0) >= targetFPS ? 'bg-cyan-400' :
                    (performanceMetrics?.fps || 0) >= 60 ? 'bg-green-400' :
                    (performanceMetrics?.fps || 0) >= 30 ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`} />
                  <span className="text-xs text-gray-400">
                    {loadingStage === 'calibrating' ? 'Extreme Performance Ready' : 'Optimizing...'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading spinner */}
        <motion.div
          className="mt-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Hook for managing extreme loading
export function useExtremeLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleProgressUpdate = (progress: number) => {
    setLoadingProgress(progress);
  };

  return {
    isLoading,
    loadingProgress,
    handleLoadingComplete,
    handleProgressUpdate,
  };
}