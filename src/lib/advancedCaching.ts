/**
 * Advanced Caching and Preloading System for Maximum Performance
 */

import * as THREE from 'three';

// Cache configuration
const CACHE_CONFIG = {
  MAX_TEXTURE_CACHE_SIZE: 50,
  MAX_GEOMETRY_CACHE_SIZE: 30,
  MAX_MATERIAL_CACHE_SIZE: 20,
  MAX_SHADER_CACHE_SIZE: 10,
  CACHE_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
  PRELOAD_BATCH_SIZE: 3,
  PRELOAD_DELAY_MS: 16, // ~60fps
} as const;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size?: number; // For memory tracking
}

// Advanced LRU Cache with memory management
class AdvancedLRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private currentMemoryUsage = 0;
  private maxMemoryUsage: number;

  constructor(maxSize: number, maxMemoryMB: number = 50) {
    this.maxSize = maxSize;
    this.maxMemoryUsage = maxMemoryMB * 1024 * 1024; // Convert to bytes
  }

  set(key: string, value: T, size?: number): void {
    const now = Date.now();
    
    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.currentMemoryUsage -= existing.size || 0;
    }

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      size: size || 0,
    };

    this.cache.set(key, entry);
    this.currentMemoryUsage += entry.size || 0;

    // Cleanup if necessary
    this.cleanup();
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > CACHE_CONFIG.CACHE_EXPIRY_MS) {
      this.delete(key);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentMemoryUsage -= entry.size || 0;
      
      // Dispose if it's a Three.js object
      if (entry.data && typeof (entry.data as any).dispose === 'function') {
        (entry.data as any).dispose();
      }
    }
    return this.cache.delete(key);
  }

  private cleanup(): void {
    // Remove expired entries
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > CACHE_CONFIG.CACHE_EXPIRY_MS) {
        this.delete(key);
      }
    }

    // Remove least recently used entries if over size limit
    while (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.delete(firstKey);
      }
    }

    // Remove entries if over memory limit
    while (this.currentMemoryUsage > this.maxMemoryUsage && this.cache.size > 0) {
      // Find least frequently used entry
      let leastUsedKey = '';
      let leastUsedCount = Infinity;
      
      for (const [key, entry] of this.cache.entries()) {
        if (entry.accessCount < leastUsedCount) {
          leastUsedCount = entry.accessCount;
          leastUsedKey = key;
        }
      }
      
      if (leastUsedKey) {
        this.delete(leastUsedKey);
      } else {
        break;
      }
    }
  }

  clear(): void {
    for (const [key] of this.cache.entries()) {
      this.delete(key);
    }
    this.cache.clear();
    this.currentMemoryUsage = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.currentMemoryUsage,
      maxMemoryUsage: this.maxMemoryUsage,
      hitRate: this.calculateHitRate(),
    };
  }

  private calculateHitRate(): number {
    if (this.cache.size === 0) return 0;
    
    let totalAccesses = 0;
    for (const entry of this.cache.values()) {
      totalAccesses += entry.accessCount;
    }
    
    return totalAccesses / this.cache.size;
  }
}

// Specialized caches for different resource types
export class TextureCache extends AdvancedLRUCache<THREE.Texture> {
  constructor() {
    super(CACHE_CONFIG.MAX_TEXTURE_CACHE_SIZE, 100); // 100MB for textures
  }

  createTexture(key: string, factory: () => THREE.Texture): THREE.Texture {
    let texture = this.get(key);
    if (!texture) {
      texture = factory();
      
      // Estimate texture memory usage
      const size = this.estimateTextureSize(texture);
      this.set(key, texture, size);
    }
    return texture;
  }

  private estimateTextureSize(texture: THREE.Texture): number {
    if (!texture.image) return 1024; // Default estimate
    
    const width = texture.image.width || 256;
    const height = texture.image.height || 256;
    const channels = 4; // RGBA
    const bytesPerChannel = 1; // 8-bit
    
    return width * height * channels * bytesPerChannel;
  }
}

export class GeometryCache extends AdvancedLRUCache<THREE.BufferGeometry> {
  constructor() {
    super(CACHE_CONFIG.MAX_GEOMETRY_CACHE_SIZE, 50); // 50MB for geometries
  }

  createGeometry(key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
    let geometry = this.get(key);
    if (!geometry) {
      geometry = factory();
      
      // Estimate geometry memory usage
      const size = this.estimateGeometrySize(geometry);
      this.set(key, geometry, size);
    }
    return geometry;
  }

  private estimateGeometrySize(geometry: THREE.BufferGeometry): number {
    let size = 0;
    
    for (const attribute of Object.values(geometry.attributes)) {
      if (attribute && attribute.array) {
        size += attribute.array.byteLength;
      }
    }
    
    if (geometry.index) {
      size += geometry.index.array.byteLength;
    }
    
    return size;
  }
}

export class MaterialCache extends AdvancedLRUCache<THREE.Material> {
  constructor() {
    super(CACHE_CONFIG.MAX_MATERIAL_CACHE_SIZE, 20); // 20MB for materials
  }

  createMaterial(key: string, factory: () => THREE.Material): THREE.Material {
    let material = this.get(key);
    if (!material) {
      material = factory();
      this.set(key, material, 1024); // Rough estimate for materials
    }
    return material;
  }
}

export class ShaderCache extends AdvancedLRUCache<THREE.ShaderMaterial> {
  constructor() {
    super(CACHE_CONFIG.MAX_SHADER_CACHE_SIZE, 10); // 10MB for shaders
  }

  createShader(key: string, factory: () => THREE.ShaderMaterial): THREE.ShaderMaterial {
    let shader = this.get(key);
    if (!shader) {
      shader = factory();
      this.set(key, shader, 2048); // Shaders can be larger due to compilation
    }
    return shader;
  }
}

// Advanced preloading system with priority queues
export class AdvancedPreloader {
  private static instance: AdvancedPreloader;
  private highPriorityQueue: Array<PreloadTask> = [];
  private mediumPriorityQueue: Array<PreloadTask> = [];
  private lowPriorityQueue: Array<PreloadTask> = [];
  private isPreloading = false;
  private preloadProgress = 0;
  private completedTasks = 0;
  private totalTasks = 0;
  private abortController?: AbortController;

  static getInstance(): AdvancedPreloader {
    if (!AdvancedPreloader.instance) {
      AdvancedPreloader.instance = new AdvancedPreloader();
    }
    return AdvancedPreloader.instance;
  }

  addTask(task: PreloadTask): void {
    this.totalTasks++;
    
    switch (task.priority) {
      case 'high':
        this.highPriorityQueue.push(task);
        break;
      case 'medium':
        this.mediumPriorityQueue.push(task);
        break;
      case 'low':
        this.lowPriorityQueue.push(task);
        break;
    }
  }

  async preloadAll(onProgress?: (progress: number, task?: string) => void): Promise<void> {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    this.preloadProgress = 0;
    this.completedTasks = 0;
    this.abortController = new AbortController();

    try {
      // Process queues in priority order
      await this.processQueue(this.highPriorityQueue, onProgress);
      await this.processQueue(this.mediumPriorityQueue, onProgress);
      await this.processQueue(this.lowPriorityQueue, onProgress);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Preloading error:', error);
      }
    } finally {
      this.isPreloading = false;
      this.abortController = undefined;
    }
  }

  private async processQueue(
    queue: PreloadTask[], 
    onProgress?: (progress: number, task?: string) => void
  ): Promise<void> {
    while (queue.length > 0 && !this.abortController?.signal.aborted) {
      const batch = queue.splice(0, CACHE_CONFIG.PRELOAD_BATCH_SIZE);
      
      await Promise.all(batch.map(async (task) => {
        try {
          await task.loader();
          this.completedTasks++;
          this.preloadProgress = this.completedTasks / this.totalTasks;
          onProgress?.(this.preloadProgress, task.name);
        } catch (error) {
          console.warn(`Failed to preload ${task.name}:`, error);
          this.completedTasks++;
          this.preloadProgress = this.completedTasks / this.totalTasks;
          onProgress?.(this.preloadProgress, task.name);
        }
      }));
      
      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, CACHE_CONFIG.PRELOAD_DELAY_MS));
    }
  }

  abort(): void {
    this.abortController?.abort();
    this.isPreloading = false;
  }

  getProgress(): number {
    return this.preloadProgress;
  }

  isActive(): boolean {
    return this.isPreloading;
  }

  clear(): void {
    this.highPriorityQueue = [];
    this.mediumPriorityQueue = [];
    this.lowPriorityQueue = [];
    this.totalTasks = 0;
    this.completedTasks = 0;
    this.preloadProgress = 0;
  }
}

interface PreloadTask {
  name: string;
  priority: 'high' | 'medium' | 'low';
  loader: () => Promise<any>;
}

// Smart resource manager that combines all caches
export class SmartResourceManager {
  private static instance: SmartResourceManager;
  private textureCache = new TextureCache();
  private geometryCache = new GeometryCache();
  private materialCache = new MaterialCache();
  private shaderCache = new ShaderCache();
  private preloader = AdvancedPreloader.getInstance();

  static getInstance(): SmartResourceManager {
    if (!SmartResourceManager.instance) {
      SmartResourceManager.instance = new SmartResourceManager();
    }
    return SmartResourceManager.instance;
  }

  // Texture management
  getTexture(key: string, factory: () => THREE.Texture): THREE.Texture {
    return this.textureCache.createTexture(key, factory);
  }

  preloadTexture(key: string, url: string, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    this.preloader.addTask({
      name: `texture_${key}`,
      priority,
      loader: async () => {
        const loader = new THREE.TextureLoader();
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });
        this.textureCache.set(key, texture, this.textureCache['estimateTextureSize'](texture));
        return texture;
      }
    });
  }

  // Geometry management
  getGeometry(key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
    return this.geometryCache.createGeometry(key, factory);
  }

  preloadGeometry(key: string, factory: () => THREE.BufferGeometry, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    this.preloader.addTask({
      name: `geometry_${key}`,
      priority,
      loader: async () => {
        const geometry = factory();
        this.geometryCache.set(key, geometry, this.geometryCache['estimateGeometrySize'](geometry));
        return geometry;
      }
    });
  }

  // Material management
  getMaterial(key: string, factory: () => THREE.Material): THREE.Material {
    return this.materialCache.createMaterial(key, factory);
  }

  preloadMaterial(key: string, factory: () => THREE.Material, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    this.preloader.addTask({
      name: `material_${key}`,
      priority,
      loader: async () => {
        const material = factory();
        this.materialCache.set(key, material, 1024);
        return material;
      }
    });
  }

  // Shader management
  getShader(key: string, factory: () => THREE.ShaderMaterial): THREE.ShaderMaterial {
    return this.shaderCache.createShader(key, factory);
  }

  // Preloading control
  async preloadAll(onProgress?: (progress: number, task?: string) => void): Promise<void> {
    return this.preloader.preloadAll(onProgress);
  }

  abortPreloading(): void {
    this.preloader.abort();
  }

  // Cache management
  clearAllCaches(): void {
    this.textureCache.clear();
    this.geometryCache.clear();
    this.materialCache.clear();
    this.shaderCache.clear();
    this.preloader.clear();
  }

  getCacheStats() {
    return {
      textures: this.textureCache.getStats(),
      geometries: this.geometryCache.getStats(),
      materials: this.materialCache.getStats(),
      shaders: this.shaderCache.getStats(),
      preloader: {
        progress: this.preloader.getProgress(),
        isActive: this.preloader.isActive(),
      }
    };
  }

  // Memory optimization
  optimizeMemoryUsage(): void {
    // Force cleanup of all caches
    this.textureCache['cleanup']();
    this.geometryCache['cleanup']();
    this.materialCache['cleanup']();
    this.shaderCache['cleanup']();
    
    // Suggest garbage collection
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }
}

// Export singleton instance
export const smartResourceManager = SmartResourceManager.getInstance();