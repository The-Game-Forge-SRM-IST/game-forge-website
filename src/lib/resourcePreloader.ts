/**
 * Advanced Resource Preloader for Critical Performance Assets
 */

import React from 'react';
import { smartResourceManager } from './advancedCaching';
import * as THREE from 'three';

// Critical resources that should be preloaded immediately
const CRITICAL_RESOURCES = {
  // Textures
  textures: [
    '/images/ClubLogo.png',
    '/images/team/placeholder.jpg',
    '/images/projects/placeholder.jpg',
  ],
  
  // Fonts (if using custom fonts)
  fonts: [
    // Add custom font URLs here
  ],
  
  // Audio (if using audio)
  audio: [
    // Add audio file URLs here
  ],
} as const;

// Preload priority levels
export type PreloadPriority = 'critical' | 'high' | 'medium' | 'low';

interface PreloadItem {
  url: string;
  type: 'texture' | 'geometry' | 'audio' | 'font' | 'model';
  priority: PreloadPriority;
  key: string;
}

class ResourcePreloader {
  private static instance: ResourcePreloader;
  private preloadQueue: PreloadItem[] = [];
  private loadedResources = new Set<string>();
  private isPreloading = false;
  private progress = 0;
  private onProgressCallbacks: Array<(progress: number) => void> = [];

  static getInstance(): ResourcePreloader {
    if (!ResourcePreloader.instance) {
      ResourcePreloader.instance = new ResourcePreloader();
    }
    return ResourcePreloader.instance;
  }

  // Add resource to preload queue
  addResource(item: PreloadItem): void {
    if (!this.loadedResources.has(item.key)) {
      this.preloadQueue.push(item);
      this.sortQueueByPriority();
    }
  }

  // Add multiple resources
  addResources(items: PreloadItem[]): void {
    items.forEach(item => this.addResource(item));
  }

  // Sort queue by priority
  private sortQueueByPriority(): void {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    this.preloadQueue.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  // Preload texture
  private async preloadTexture(url: string, key: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          // Optimize texture settings for performance
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.format = THREE.RGBAFormat;
          
          // Cache the texture
          smartResourceManager.getTexture(key, () => texture);
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  // Preload audio
  private async preloadAudio(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioContext.decodeAudioData(arrayBuffer);
  }

  // Preload font
  private async preloadFont(url: string, fontFamily: string): Promise<FontFace> {
    const font = new FontFace(fontFamily, `url(${url})`);
    await font.load();
    document.fonts.add(font);
    return font;
  }

  // Preload individual resource
  private async preloadResource(item: PreloadItem): Promise<any> {
    try {
      let resource: any;

      switch (item.type) {
        case 'texture':
          resource = await this.preloadTexture(item.url, item.key);
          break;
        case 'audio':
          resource = await this.preloadAudio(item.url);
          break;
        case 'font':
          resource = await this.preloadFont(item.url, item.key);
          break;
        default:
          // Generic fetch for other resources
          const response = await fetch(item.url);
          resource = await response.blob();
      }

      this.loadedResources.add(item.key);
      return resource;
    } catch (error) {
      console.warn(`Failed to preload resource ${item.key}:`, error);
      throw error;
    }
  }

  // Start preloading all resources
  async preloadAll(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) return;

    this.isPreloading = true;
    this.progress = 0;
    
    const total = this.preloadQueue.length;
    let completed = 0;

    // Process resources in batches based on priority
    const criticalItems = this.preloadQueue.filter(item => item.priority === 'critical');
    const highItems = this.preloadQueue.filter(item => item.priority === 'high');
    const mediumItems = this.preloadQueue.filter(item => item.priority === 'medium');
    const lowItems = this.preloadQueue.filter(item => item.priority === 'low');

    // Preload critical resources first (blocking)
    for (const item of criticalItems) {
      try {
        await this.preloadResource(item);
        completed++;
        this.updateProgress(completed / total);
      } catch (error) {
        completed++;
        this.updateProgress(completed / total);
      }
    }

    // Preload high priority resources (parallel, small batches)
    await this.preloadBatch(highItems, 3, (batchCompleted) => {
      completed += batchCompleted;
      this.updateProgress(completed / total);
    });

    // Preload medium priority resources (parallel, larger batches)
    await this.preloadBatch(mediumItems, 5, (batchCompleted) => {
      completed += batchCompleted;
      this.updateProgress(completed / total);
    });

    // Preload low priority resources (background, large batches)
    this.preloadBatch(lowItems, 8, (batchCompleted) => {
      completed += batchCompleted;
      this.updateProgress(completed / total);
    }).catch(() => {
      // Ignore errors for low priority resources
    });

    this.isPreloading = false;
    this.preloadQueue = [];
  }

  // Preload resources in batches
  private async preloadBatch(
    items: PreloadItem[], 
    batchSize: number, 
    onBatchComplete: (completed: number) => void
  ): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      const results = await Promise.allSettled(
        batch.map(item => this.preloadResource(item))
      );
      
      const completed = results.filter(result => result.status === 'fulfilled').length;
      onBatchComplete(completed);
      
      // Small delay between batches to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // Update progress and notify callbacks
  private updateProgress(progress: number): void {
    this.progress = progress;
    this.onProgressCallbacks.forEach(callback => callback(progress));
  }

  // Add progress callback
  onProgress(callback: (progress: number) => void): void {
    this.onProgressCallbacks.push(callback);
  }

  // Remove progress callback
  offProgress(callback: (progress: number) => void): void {
    const index = this.onProgressCallbacks.indexOf(callback);
    if (index > -1) {
      this.onProgressCallbacks.splice(index, 1);
    }
  }

  // Get current progress
  getProgress(): number {
    return this.progress;
  }

  // Check if resource is loaded
  isResourceLoaded(key: string): boolean {
    return this.loadedResources.has(key);
  }

  // Get loading status
  isLoading(): boolean {
    return this.isPreloading;
  }

  // Clear all resources and queue
  clear(): void {
    this.preloadQueue = [];
    this.loadedResources.clear();
    this.progress = 0;
    this.onProgressCallbacks = [];
  }
}

// Initialize critical resources
export function initializeCriticalResources(): void {
  const preloader = ResourcePreloader.getInstance();

  // Add critical textures
  CRITICAL_RESOURCES.textures.forEach((url, index) => {
    preloader.addResource({
      url,
      type: 'texture',
      priority: 'critical',
      key: `critical_texture_${index}`
    });
  });

  // Add team member images (high priority)
  const teamImages = [
    '/images/team/RADHVIK.jpeg',
    '/images/team/adamya.png',
    '/images/team/anshu.jpeg',
    '/images/team/avdhoot.webp',
    '/images/team/dinesh.jpeg',
    '/images/team/gaurav.webp',
    '/images/team/menahaha.jpeg',
    '/images/team/mushir.webp',
    '/images/team/pawani.jpeg',
    '/images/team/prajjwal.jpeg',
    '/images/team/rajora.jpeg',
    '/images/team/rishav.webp',
    '/images/team/sanjithkumar.jpg',
    '/images/team/saswat.jpeg',
    '/images/team/sharad.webp',
    '/images/team/surya-kancharana.jpeg',
    '/images/team/suyash.jpeg',
    '/images/team/t.siddharthareddy.jpeg',
    '/images/team/thasleem.jpeg',
    '/images/team/udayan.jpeg',
    '/images/team/vivek-aryan.jpeg',
  ];

  teamImages.forEach((url, index) => {
    preloader.addResource({
      url,
      type: 'texture',
      priority: 'high',
      key: `team_image_${index}`
    });
  });

  // Add project images (medium priority)
  const projectImages = [
    '/images/projects/battle-arena-vr-1.jpg',
    '/images/projects/cyber-runner-1.jpg',
    '/images/projects/galaxy-ruler-1.png',
    '/images/projects/galaxy-ruler-2.png',
    '/images/projects/galaxy-ruler-3.png',
    '/images/projects/galaxy-ruler-4.png',
    '/images/projects/hbi-1.png',
    '/images/projects/hbi-2.png',
    '/images/projects/mystic-realms-1.jpg',
    '/images/projects/pixel-quest-1.jpg',
    '/images/projects/puzzle-dimension-1.jpg',
    '/images/projects/retro-revive-1.png',
    '/images/projects/retro-revive-2.png',
    '/images/projects/space-colony-1.jpg',
  ];

  projectImages.forEach((url, index) => {
    preloader.addResource({
      url,
      type: 'texture',
      priority: 'medium',
      key: `project_image_${index}`
    });
  });

  // Add gallery images (low priority)
  const galleryImages = [
    '/images/gallery/Club Membership Registration.jpeg',
    '/images/gallery/Clubmeetup.jpg',
    '/images/gallery/IIITDM Award.jpeg',
  ];

  galleryImages.forEach((url, index) => {
    preloader.addResource({
      url,
      type: 'texture',
      priority: 'low',
      key: `gallery_image_${index}`
    });
  });
}

// Export singleton instance
export const resourcePreloader = ResourcePreloader.getInstance();

// Hook for using resource preloader in React components
export function useResourcePreloader() {
  const [progress, setProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const preloader = ResourcePreloader.getInstance();
    
    const handleProgress = (progress: number) => {
      setProgress(progress);
    };

    preloader.onProgress(handleProgress);
    setIsLoading(preloader.isLoading());

    return () => {
      preloader.offProgress(handleProgress);
    };
  }, []);

  const startPreloading = React.useCallback(async () => {
    setIsLoading(true);
    await resourcePreloader.preloadAll();
    setIsLoading(false);
  }, []);

  return {
    progress,
    isLoading,
    startPreloading,
    isResourceLoaded: (key: string) => resourcePreloader.isResourceLoaded(key),
  };
}