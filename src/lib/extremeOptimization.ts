/**
 * Extreme Performance Optimization System
 * Targets 120fps performance with intelligent resource management
 */

import * as THREE from 'three';

// Performance targets for smooth 60fps with beautiful visuals
export const PERFORMANCE_TARGETS = {
  TARGET_FPS: 60,
  FRAME_TIME_MS: 16.67, // 1000ms / 60fps
  CRITICAL_FPS: 45,
  LOW_FPS: 30,
  MEMORY_THRESHOLD_MB: 150,
  GC_THRESHOLD_MB: 200,
} as const;

// Advanced FPS monitor with 120fps targeting
export class ExtremeFPSMonitor {
  private frames = 0;
  private startTime = 0;
  private fps = 0;
  private frameTimings: number[] = [];
  private callback?: (metrics: PerformanceMetrics) => void;
  private animationId?: number;
  private lastFrameTime = 0;
  private frameTimeBuffer: number[] = [];
  private maxBufferSize = 60; // Track last 60 frames

  constructor(callback?: (metrics: PerformanceMetrics) => void) {
    this.callback = callback;
  }

  start() {
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.frames = 0;
    this.frameTimings = [];
    this.frameTimeBuffer = [];
    this.tick();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private tick = () => {
    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    
    // Track frame timing
    this.frameTimeBuffer.push(frameTime);
    if (this.frameTimeBuffer.length > this.maxBufferSize) {
      this.frameTimeBuffer.shift();
    }
    
    this.frames++;
    this.lastFrameTime = currentTime;
    
    const elapsed = currentTime - this.startTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frames * 1000) / elapsed);
      
      // Calculate advanced metrics
      const avgFrameTime = this.frameTimeBuffer.reduce((a, b) => a + b, 0) / this.frameTimeBuffer.length;
      const maxFrameTime = Math.max(...this.frameTimeBuffer);
      const minFrameTime = Math.min(...this.frameTimeBuffer);
      const frameTimeVariance = this.calculateVariance(this.frameTimeBuffer);
      
      const metrics: PerformanceMetrics = {
        fps: this.fps,
        avgFrameTime,
        maxFrameTime,
        minFrameTime,
        frameTimeVariance,
        isTargetFPS: this.fps >= PERFORMANCE_TARGETS.TARGET_FPS,
        isCriticalFPS: this.fps < PERFORMANCE_TARGETS.CRITICAL_FPS,
        isLowFPS: this.fps < PERFORMANCE_TARGETS.LOW_FPS,
        frameDrops: this.frameTimeBuffer.filter(t => t > PERFORMANCE_TARGETS.FRAME_TIME_MS * 2).length,
        stability: this.calculateStability(),
      };
      
      this.callback?.(metrics);
      
      this.frames = 0;
      this.startTime = currentTime;
    }

    this.animationId = requestAnimationFrame(this.tick);
  };

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateStability(): number {
    if (this.frameTimeBuffer.length < 10) return 1;
    
    const variance = this.calculateVariance(this.frameTimeBuffer);
    const avgFrameTime = this.frameTimeBuffer.reduce((a, b) => a + b, 0) / this.frameTimeBuffer.length;
    
    // Stability is inverse of coefficient of variation (lower variance = higher stability)
    const coefficientOfVariation = variance / avgFrameTime;
    return Math.max(0, 1 - coefficientOfVariation);
  }

  getFPS() {
    return this.fps;
  }
}

export interface PerformanceMetrics {
  fps: number;
  avgFrameTime: number;
  maxFrameTime: number;
  minFrameTime: number;
  frameTimeVariance: number;
  isTargetFPS: boolean;
  isCriticalFPS: boolean;
  isLowFPS: boolean;
  frameDrops: number;
  stability: number;
}

// Advanced memory management
export class MemoryManager {
  private static instance: MemoryManager;
  private memoryUsage: number = 0;
  private lastGCTime = 0;
  private gcThreshold = PERFORMANCE_TARGETS.GC_THRESHOLD_MB * 1024 * 1024;
  private disposableObjects: Set<{ dispose(): void }> = new Set();
  private textureCache = new Map<string, THREE.Texture>();
  private geometryCache = new Map<string, THREE.BufferGeometry>();
  private materialCache = new Map<string, THREE.Material>();

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  registerDisposable(object: { dispose(): void }): void {
    this.disposableObjects.add(object);
  }

  unregisterDisposable(object: { dispose(): void }): void {
    this.disposableObjects.delete(object);
  }

  // Intelligent garbage collection
  forceGarbageCollection(): void {
    const now = performance.now();
    
    // Don't GC too frequently
    if (now - this.lastGCTime < 5000) return;
    
    // Dispose unused objects
    this.disposableObjects.forEach(obj => {
      try {
        obj.dispose();
      } catch (e) {
        console.warn('Failed to dispose object:', e);
      }
    });
    this.disposableObjects.clear();
    
    // Clear caches if memory is high
    if (this.getMemoryUsage() > this.gcThreshold) {
      this.clearCaches();
    }
    
    // Suggest browser GC
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
    
    this.lastGCTime = now;
  }

  private clearCaches(): void {
    // Clear texture cache
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
    
    // Clear geometry cache
    this.geometryCache.forEach(geometry => geometry.dispose());
    this.geometryCache.clear();
    
    // Clear material cache
    this.materialCache.forEach(material => material.dispose());
    this.materialCache.clear();
  }

  getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as any).memory;
      if (memory) {
        this.memoryUsage = memory.usedJSHeapSize;
        return this.memoryUsage;
      }
    }
    return 0;
  }

  // Cached resource management
  getCachedTexture(key: string, factory: () => THREE.Texture): THREE.Texture {
    if (!this.textureCache.has(key)) {
      const texture = factory();
      this.textureCache.set(key, texture);
      this.registerDisposable(texture);
    }
    return this.textureCache.get(key)!;
  }

  getCachedGeometry(key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
    if (!this.geometryCache.has(key)) {
      const geometry = factory();
      this.geometryCache.set(key, geometry);
      this.registerDisposable(geometry);
    }
    return this.geometryCache.get(key)!;
  }

  getCachedMaterial(key: string, factory: () => THREE.Material): THREE.Material {
    if (!this.materialCache.has(key)) {
      const material = factory();
      this.materialCache.set(key, material);
      this.registerDisposable(material);
    }
    return this.materialCache.get(key)!;
  }
}

// Adaptive quality system for 120fps
export class AdaptiveQualityManager {
  private static instance: AdaptiveQualityManager;
  private currentQuality: QualityLevel = 'ultra';
  private qualityHistory: QualityLevel[] = [];
  private lastQualityChange = 0;
  private stabilityBuffer: number[] = [];

  static getInstance(): AdaptiveQualityManager {
    if (!AdaptiveQualityManager.instance) {
      AdaptiveQualityManager.instance = new AdaptiveQualityManager();
    }
    return AdaptiveQualityManager.instance;
  }

  updateQuality(metrics: PerformanceMetrics): QualityLevel {
    const now = performance.now();
    
    // Don't change quality too frequently
    if (now - this.lastQualityChange < 2000) {
      return this.currentQuality;
    }

    this.stabilityBuffer.push(metrics.stability);
    if (this.stabilityBuffer.length > 10) {
      this.stabilityBuffer.shift();
    }

    const avgStability = this.stabilityBuffer.reduce((a, b) => a + b, 0) / this.stabilityBuffer.length;
    let newQuality: QualityLevel = this.currentQuality;

    // Ultra quality for 60fps+ with high stability
    if (metrics.fps >= PERFORMANCE_TARGETS.TARGET_FPS && avgStability > 0.8) {
      newQuality = 'ultra';
    }
    // High quality for 50fps+ with good stability
    else if (metrics.fps >= 50 && avgStability > 0.7) {
      newQuality = 'high';
    }
    // Medium quality for 40fps+ with decent stability
    else if (metrics.fps >= 40 && avgStability > 0.6) {
      newQuality = 'medium';
    }
    // Low quality for 30fps+ 
    else if (metrics.fps >= PERFORMANCE_TARGETS.LOW_FPS) {
      newQuality = 'low';
    }
    // Minimal quality for very low performance
    else {
      newQuality = 'minimal';
    }

    // Apply hysteresis to prevent quality oscillation
    if (newQuality !== this.currentQuality) {
      const qualityOrder: QualityLevel[] = ['minimal', 'low', 'medium', 'high', 'ultra'];
      const currentIndex = qualityOrder.indexOf(this.currentQuality);
      const newIndex = qualityOrder.indexOf(newQuality);
      
      // Only allow one step changes to prevent jarring transitions
      if (Math.abs(newIndex - currentIndex) <= 1) {
        this.currentQuality = newQuality;
        this.lastQualityChange = now;
        this.qualityHistory.push(newQuality);
        if (this.qualityHistory.length > 20) {
          this.qualityHistory.shift();
        }
      }
    }

    return this.currentQuality;
  }

  getCurrentQuality(): QualityLevel {
    return this.currentQuality;
  }

  getQualitySettings(): QualitySettings {
    return QUALITY_PRESETS[this.currentQuality];
  }
}

export type QualityLevel = 'minimal' | 'low' | 'medium' | 'high' | 'ultra';

export interface QualitySettings {
  maxParticles: number;
  particleSize: number;
  enableComplexEffects: boolean;
  enableShadows: boolean;
  enablePostProcessing: boolean;
  antialias: boolean;
  pixelRatio: number;
  animationQuality: number; // 0-1 multiplier for animation complexity
  updateFrequency: number; // How often to update (1 = every frame, 2 = every other frame)
  enableLOD: boolean; // Level of detail
  maxDrawCalls: number;
  textureQuality: number; // 0-1 multiplier for texture resolution
}

export const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  ultra: {
    maxParticles: 2500,
    particleSize: 1.2,
    enableComplexEffects: true,
    enableShadows: true,
    enablePostProcessing: true,
    antialias: true,
    pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2),
    animationQuality: 1.0,
    updateFrequency: 1,
    enableLOD: true,
    maxDrawCalls: 1200,
    textureQuality: 1.0,
  },
  high: {
    maxParticles: 2000,
    particleSize: 1.1,
    enableComplexEffects: true,
    enableShadows: true,
    enablePostProcessing: true,
    antialias: true,
    pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5),
    animationQuality: 1.0,
    updateFrequency: 1,
    enableLOD: true,
    maxDrawCalls: 1000,
    textureQuality: 1.0,
  },
  medium: {
    maxParticles: 1500,
    particleSize: 1.0,
    enableComplexEffects: true,
    enableShadows: true,
    enablePostProcessing: true,
    antialias: true,
    pixelRatio: 1,
    animationQuality: 0.9,
    updateFrequency: 1,
    enableLOD: true,
    maxDrawCalls: 800,
    textureQuality: 0.9,
  },
  low: {
    maxParticles: 1000,
    particleSize: 0.9,
    enableComplexEffects: true,
    enableShadows: false,
    enablePostProcessing: false,
    antialias: true,
    pixelRatio: 1,
    animationQuality: 0.8,
    updateFrequency: 1,
    enableLOD: true,
    maxDrawCalls: 600,
    textureQuality: 0.8,
  },
  minimal: {
    maxParticles: 600,
    particleSize: 0.8,
    enableComplexEffects: false,
    enableShadows: false,
    enablePostProcessing: false,
    antialias: false,
    pixelRatio: 1,
    animationQuality: 0.7,
    updateFrequency: 2,
    enableLOD: false,
    maxDrawCalls: 400,
    textureQuality: 0.7,
  },
};

// Advanced preloading system
export class ResourcePreloader {
  private static instance: ResourcePreloader;
  private preloadQueue: Array<() => Promise<any>> = [];
  private preloadedResources = new Map<string, any>();
  private isPreloading = false;
  private preloadProgress = 0;

  static getInstance(): ResourcePreloader {
    if (!ResourcePreloader.instance) {
      ResourcePreloader.instance = new ResourcePreloader();
    }
    return ResourcePreloader.instance;
  }

  addToQueue(key: string, loader: () => Promise<any>): void {
    if (!this.preloadedResources.has(key)) {
      this.preloadQueue.push(async () => {
        const resource = await loader();
        this.preloadedResources.set(key, resource);
        return resource;
      });
    }
  }

  async preloadAll(onProgress?: (progress: number) => void): Promise<void> {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    this.preloadProgress = 0;
    
    const total = this.preloadQueue.length;
    let completed = 0;

    // Preload in batches to avoid overwhelming the system
    const batchSize = 3;
    for (let i = 0; i < this.preloadQueue.length; i += batchSize) {
      const batch = this.preloadQueue.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (loader) => {
        try {
          await loader();
          completed++;
          this.preloadProgress = completed / total;
          onProgress?.(this.preloadProgress);
        } catch (error) {
          console.warn('Failed to preload resource:', error);
          completed++;
          this.preloadProgress = completed / total;
          onProgress?.(this.preloadProgress);
        }
      }));
      
      // Small delay between batches to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    this.preloadQueue = [];
    this.isPreloading = false;
  }

  getResource<T>(key: string): T | null {
    return this.preloadedResources.get(key) || null;
  }

  getProgress(): number {
    return this.preloadProgress;
  }

  isResourcePreloaded(key: string): boolean {
    return this.preloadedResources.has(key);
  }
}

// Frame rate limiter for consistent performance
export class FrameRateLimiter {
  private targetFrameTime: number;
  private lastFrameTime = 0;
  private frameTimeBuffer: number[] = [];
  private adaptiveMode = true;

  constructor(targetFPS: number = PERFORMANCE_TARGETS.TARGET_FPS) {
    this.targetFrameTime = 1000 / targetFPS;
  }

  shouldRender(): boolean {
    const now = performance.now();
    const elapsed = now - this.lastFrameTime;
    
    if (this.adaptiveMode) {
      // Adaptive frame limiting based on recent performance
      this.frameTimeBuffer.push(elapsed);
      if (this.frameTimeBuffer.length > 10) {
        this.frameTimeBuffer.shift();
      }
      
      const avgFrameTime = this.frameTimeBuffer.reduce((a, b) => a + b, 0) / this.frameTimeBuffer.length;
      const adaptiveTarget = Math.max(this.targetFrameTime, avgFrameTime * 0.9);
      
      if (elapsed >= adaptiveTarget) {
        this.lastFrameTime = now;
        return true;
      }
    } else {
      // Fixed frame limiting
      if (elapsed >= this.targetFrameTime) {
        this.lastFrameTime = now;
        return true;
      }
    }
    
    return false;
  }

  setTargetFPS(fps: number): void {
    this.targetFrameTime = 1000 / fps;
  }

  setAdaptiveMode(enabled: boolean): void {
    this.adaptiveMode = enabled;
  }
}

// Advanced performance scheduler for 120fps
export class PerformanceScheduler {
  private static instance: PerformanceScheduler;
  private tasks: Array<{ fn: () => void; priority: number; lastRun: number; interval: number }> = [];
  private isRunning = false;
  private frameId?: number;

  static getInstance(): PerformanceScheduler {
    if (!PerformanceScheduler.instance) {
      PerformanceScheduler.instance = new PerformanceScheduler();
    }
    return PerformanceScheduler.instance;
  }

  addTask(fn: () => void, priority: number = 1, interval: number = 0): void {
    this.tasks.push({
      fn,
      priority,
      lastRun: 0,
      interval
    });
    
    // Sort by priority (higher number = higher priority)
    this.tasks.sort((a, b) => b.priority - a.priority);
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
  }

  stop(): void {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  private tick = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    const frameTimeTarget = PERFORMANCE_TARGETS.FRAME_TIME_MS;
    const frameStartTime = now;

    // Execute tasks within frame time budget
    for (const task of this.tasks) {
      const elapsed = performance.now() - frameStartTime;
      if (elapsed > frameTimeTarget * 0.8) break; // Leave 20% buffer

      if (now - task.lastRun >= task.interval) {
        try {
          task.fn();
          task.lastRun = now;
        } catch (error) {
          console.warn('Performance task error:', error);
        }
      }
    }

    this.frameId = requestAnimationFrame(this.tick);
  };

  clear(): void {
    this.tasks = [];
  }
}

// Extreme optimization coordinator
export class ExtremeOptimizationCoordinator {
  private static instance: ExtremeOptimizationCoordinator;
  private fpsMonitor: ExtremeFPSMonitor;
  private memoryManager: MemoryManager;
  private qualityManager: AdaptiveQualityManager;
  private resourcePreloader: ResourcePreloader;
  private scheduler: PerformanceScheduler;
  private frameRateLimiter: FrameRateLimiter;
  private isInitialized = false;
  private optimizationCallbacks: Array<(metrics: PerformanceMetrics) => void> = [];

  static getInstance(): ExtremeOptimizationCoordinator {
    if (!ExtremeOptimizationCoordinator.instance) {
      ExtremeOptimizationCoordinator.instance = new ExtremeOptimizationCoordinator();
    }
    return ExtremeOptimizationCoordinator.instance;
  }

  private constructor() {
    this.memoryManager = MemoryManager.getInstance();
    this.qualityManager = AdaptiveQualityManager.getInstance();
    this.resourcePreloader = ResourcePreloader.getInstance();
    this.scheduler = PerformanceScheduler.getInstance();
    this.frameRateLimiter = new FrameRateLimiter(PERFORMANCE_TARGETS.TARGET_FPS);
    this.fpsMonitor = new ExtremeFPSMonitor(this.handlePerformanceUpdate.bind(this));
  }

  initialize(): void {
    if (this.isInitialized) return;

    // Start performance monitoring
    this.fpsMonitor.start();
    this.scheduler.start();

    // Schedule periodic optimizations
    this.scheduler.addTask(() => {
      this.memoryManager.forceGarbageCollection();
    }, 1, 10000); // Every 10 seconds

    this.scheduler.addTask(() => {
      this.optimizeRenderingPipeline();
    }, 2, 5000); // Every 5 seconds

    this.scheduler.addTask(() => {
      this.adaptiveQualityCheck();
    }, 3, 1000); // Every second

    this.isInitialized = true;
  }

  private handlePerformanceUpdate(metrics: PerformanceMetrics): void {
    // Update quality based on performance
    this.qualityManager.updateQuality(metrics);

    // Adjust frame rate limiter
    if (metrics.fps < PERFORMANCE_TARGETS.CRITICAL_FPS) {
      this.frameRateLimiter.setTargetFPS(60);
    } else if (metrics.fps >= PERFORMANCE_TARGETS.TARGET_FPS && metrics.stability > 0.9) {
      this.frameRateLimiter.setTargetFPS(PERFORMANCE_TARGETS.TARGET_FPS);
    }

    // Notify callbacks
    this.optimizationCallbacks.forEach(callback => {
      try {
        callback(metrics);
      } catch (error) {
        console.warn('Optimization callback error:', error);
      }
    });
  }

  private optimizeRenderingPipeline(): void {
    // Force WebGL state cleanup
    if (typeof window !== 'undefined' && window.WebGLRenderingContext) {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (gl) {
          gl.flush();
          gl.finish();
        }
      }
    }
  }

  private adaptiveQualityCheck(): void {
    const currentFPS = this.fpsMonitor.getFPS();
    const memoryUsage = this.memoryManager.getMemoryUsage();
    
    // Emergency quality reduction
    if (currentFPS < PERFORMANCE_TARGETS.LOW_FPS || 
        memoryUsage > PERFORMANCE_TARGETS.GC_THRESHOLD_MB * 1024 * 1024) {
      this.triggerEmergencyOptimization();
    }
  }

  private triggerEmergencyOptimization(): void {
    // Force lowest quality
    this.qualityManager['currentQuality'] = 'minimal';
    
    // Aggressive memory cleanup
    this.memoryManager.forceGarbageCollection();
    
    // Clear all caches
    this.memoryManager['clearCaches']();
    
    // Reduce frame rate target
    this.frameRateLimiter.setTargetFPS(30);
  }

  // Public API
  onPerformanceUpdate(callback: (metrics: PerformanceMetrics) => void): void {
    this.optimizationCallbacks.push(callback);
  }

  offPerformanceUpdate(callback: (metrics: PerformanceMetrics) => void): void {
    const index = this.optimizationCallbacks.indexOf(callback);
    if (index > -1) {
      this.optimizationCallbacks.splice(index, 1);
    }
  }

  shouldRender(): boolean {
    return this.frameRateLimiter.shouldRender();
  }

  getCurrentQuality(): QualityLevel {
    return this.qualityManager.getCurrentQuality();
  }

  getQualitySettings(): QualitySettings {
    return this.qualityManager.getQualitySettings();
  }

  getPerformanceMetrics(): PerformanceMetrics | null {
    return {
      fps: this.fpsMonitor.getFPS(),
      avgFrameTime: 0,
      maxFrameTime: 0,
      minFrameTime: 0,
      frameTimeVariance: 0,
      isTargetFPS: this.fpsMonitor.getFPS() >= PERFORMANCE_TARGETS.TARGET_FPS,
      isCriticalFPS: this.fpsMonitor.getFPS() < PERFORMANCE_TARGETS.CRITICAL_FPS,
      isLowFPS: this.fpsMonitor.getFPS() < PERFORMANCE_TARGETS.LOW_FPS,
      frameDrops: 0,
      stability: 1,
    };
  }

  async preloadCriticalResources(onProgress?: (progress: number) => void): Promise<void> {
    return this.resourcePreloader.preloadAll(onProgress);
  }

  triggerOptimization(): void {
    this.triggerEmergencyOptimization();
  }

  getMemoryUsage(): number {
    return this.memoryManager.getMemoryUsage();
  }

  dispose(): void {
    this.fpsMonitor.stop();
    this.scheduler.stop();
    this.optimizationCallbacks = [];
    this.isInitialized = false;
  }
}

// Export singleton instances
export const memoryManager = MemoryManager.getInstance();
export const qualityManager = AdaptiveQualityManager.getInstance();
export const resourcePreloader = ResourcePreloader.getInstance();
export const performanceScheduler = PerformanceScheduler.getInstance();
export const extremeOptimizationCoordinator = ExtremeOptimizationCoordinator.getInstance();