/**
 * Image optimization utilities for Game Forge website
 * Handles image loading, optimization, and fallbacks
 */

import { useState, useEffect } from 'react';

// Image size configurations
export const IMAGE_SIZES = {
  team: {
    width: 400,
    height: 400,
    aspectRatio: '1:1'
  },
  project: {
    thumbnail: { width: 400, height: 300 },
    full: { width: 1200, height: 800 },
    aspectRatio: '4:3'
  },
  achievement: {
    width: 400,
    height: 300,
    aspectRatio: '4:3'
  },
  alumni: {
    width: 600,
    height: 700,
    aspectRatio: '6:7'
  },
  gallery: {
    small: { width: 400, height: 300 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 900 }
  }
};

// Placeholder image generator
export function generatePlaceholderUrl(
  width: number, 
  height: number, 
  text?: string,
  backgroundColor = '1f2937',
  textColor = 'ffffff'
): string {
  const displayText = text || `${width}×${height}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayText)}&size=${width}x${height}&background=${backgroundColor}&color=${textColor}&format=png`;
}

// Image path utilities
export function getTeamImagePath(memberId: string, memberName: string): string {
  const fallbackUrl = generatePlaceholderUrl(400, 400, memberName);
  return `/images/team/${memberId}.jpg`;
}

export function getProjectImagePath(projectId: string, imageIndex = 0): string {
  return `/images/projects/${projectId}-${imageIndex + 1}.jpg`;
}

export function getAchievementImagePath(achievementId: string): string {
  return `/images/achievements/${achievementId}.jpg`;
}

export function getAlumniImagePath(alumniId: string): string {
  return `/images/alumni/${alumniId}.jpg`;
}

export function getEventImagePath(eventId: string, imageIndex = 0): string {
  return `/images/events/${eventId}-${imageIndex + 1}.jpg`;
}

// Image loading hook with fallback
export function useImageWithFallback(src: string, fallbackSrc: string) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImageSrc(src);

    const img = new Image();
    
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    
    img.onerror = () => {
      setImageSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(true);
    };
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return { imageSrc, isLoading, hasError };
}

// Responsive image sizes for Next.js Image component
export function getResponsiveSizes(type: keyof typeof IMAGE_SIZES): string {
  switch (type) {
    case 'team':
      return '(max-width: 768px) 150px, (max-width: 1024px) 200px, 300px';
    case 'project':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'achievement':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px';
    case 'alumni':
      return '(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px';
    case 'gallery':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    default:
      return '100vw';
  }
}

// Image optimization configuration for Next.js
export const NEXT_IMAGE_CONFIG = {
  domains: [
    'ui-avatars.com',
    'images.unsplash.com',
    'picsum.photos'
  ],
  formats: ['image/webp', 'image/jpeg'],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  dangerouslyAllowSVG: false,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

// Image validation utilities
export function validateImageUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Image compression utility (client-side)
export function compressImage(
  file: File, 
  maxWidth: number, 
  maxHeight: number, 
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Lazy loading intersection observer
export function createImageObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
}

// Image preloading utility
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    
    img.src = src;
  });
}

// Batch image preloading
export async function preloadImages(urls: string[]): Promise<void> {
  try {
    await Promise.all(urls.map(preloadImage));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
}

// Generate srcSet for responsive images
export function generateSrcSet(basePath: string, sizes: number[]): string {
  return sizes
    .map(size => `${basePath}?w=${size} ${size}w`)
    .join(', ');
}

// Image format detection
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
}

// Get optimal image format
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'jpeg';
}