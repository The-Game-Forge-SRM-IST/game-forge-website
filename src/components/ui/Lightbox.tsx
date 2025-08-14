'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { GalleryImage } from '@/types';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious
}: LightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const currentImage = images[currentIndex];

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      case 'ArrowLeft':
      case 'h': // Vim-style navigation
        event.preventDefault();
        onPrevious();
        break;
      case 'ArrowRight':
      case 'l': // Vim-style navigation
        event.preventDefault();
        onNext();
        break;
      case 'z':
      case 'Z':
      case '+':
      case '=':
        event.preventDefault();
        setIsZoomed(!isZoomed);
        break;
      case 'Home':
        event.preventDefault();
        // Navigate to first image - would need callback from parent
        break;
      case 'End':
        event.preventDefault();
        // Navigate to last image - would need callback from parent
        break;
    }
  }, [isOpen, onClose, onNext, onPrevious, isZoomed]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // Reset zoom when image changes
  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md overflow-hidden"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          aria-describedby="lightbox-description"
        >
          {/* Header with controls */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white flex-1 min-w-0">
              <h3 id="lightbox-title" className="text-lg sm:text-xl font-bold truncate">
                {currentImage.title}
              </h3>
              <p className="text-sm text-gray-300" aria-live="polite">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
            
            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="p-2 text-white hover:bg-white/20 focus:bg-white/20 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                title={isZoomed ? 'Zoom out (Z)' : 'Zoom in (Z)'}
                aria-label={isZoomed ? 'Zoom out image' : 'Zoom in image'}
                aria-pressed={isZoomed}
              >
                {isZoomed ? <ZoomOut size={18} aria-hidden="true" /> : <ZoomIn size={18} aria-hidden="true" />}
              </button>
              
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white/20 focus:bg-white/20 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Close lightbox (Escape)"
                aria-label="Close lightbox"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors z-10 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Previous image (Left arrow or H)"
                aria-label={`Previous image, ${images[currentIndex - 1]?.title || 'untitled'}`}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors z-10 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Next image (Right arrow or L)"
                aria-label={`Next image, ${images[currentIndex + 1]?.title || 'untitled'}`}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </>
          )}

          {/* Main image container - Maximum size */}
          <div 
            className="absolute inset-0 flex items-center justify-center pt-16 pb-16 px-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isZoomed ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.3 : 1.8) : 1,
                transition: { duration: 0.3 }
              }}
              className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg overflow-hidden"
              onClick={() => setIsZoomed(!isZoomed)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsZoomed(!isZoomed);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${isZoomed ? 'Zoom out' : 'Zoom in'} image: ${currentImage.title}`}
              style={{
                touchAction: isZoomed ? 'pan-x pan-y' : 'manipulation'
              }}
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={1200}
                height={800}
                className="block shadow-2xl rounded-lg"
                priority
                sizes="(max-width: 768px) 98vw, (max-width: 1200px) 96vw, 94vw"
                style={{
                  maxWidth: '98vw',
                  maxHeight: 'calc(100vh - 128px)', // Reduced padding: 64px top + 64px bottom
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </motion.div>
          </div>

          {/* Image info footer - Compact */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="text-white text-center">
              <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
                {/* Date */}
                <time dateTime={currentImage.date} className="text-gray-300">
                  {new Date(currentImage.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
                
                {/* Image counter */}
                {images.length > 1 && (
                  <span className="font-medium bg-black/60 px-3 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                  </span>
                )}
                
                {/* Tags */}
                {currentImage.tags && currentImage.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2" role="list" aria-label="Image tags">
                    {currentImage.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-white/20 rounded-full"
                        role="listitem"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Description on separate line if exists */}
              {currentImage.description && (
                <p id="lightbox-description" className="text-sm text-gray-300 mt-2 max-w-2xl mx-auto">
                  {currentImage.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}