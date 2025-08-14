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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          aria-describedby="lightbox-description"
        >
          {/* Header with controls */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/70 to-transparent safe-area-inset-top">
            <div className="text-white flex-1 min-w-0">
              <h3 id="lightbox-title" className="text-base sm:text-lg font-semibold truncate">
                {currentImage.title}
              </h3>
              <p className="text-sm text-gray-300" aria-live="polite">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="p-3 text-white hover:bg-white/20 focus:bg-white/20 rounded-lg transition-colors touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                title={isZoomed ? 'Zoom out (Z)' : 'Zoom in (Z)'}
                aria-label={isZoomed ? 'Zoom out image' : 'Zoom in image'}
                aria-pressed={isZoomed}
              >
                {isZoomed ? <ZoomOut size={20} aria-hidden="true" /> : <ZoomIn size={20} aria-hidden="true" />}
              </button>
              
              <button
                onClick={onClose}
                className="p-3 text-white hover:bg-white/20 focus:bg-white/20 rounded-lg transition-colors touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Close lightbox (Escape)"
                aria-label="Close lightbox"
              >
                <X size={20} aria-hidden="true" />
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
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-white hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors z-10 touch-manipulation min-h-[56px] min-w-[56px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Previous image (Left arrow or H)"
                aria-label={`Previous image, ${images[currentIndex - 1]?.title || 'untitled'}`}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={24} className="sm:w-6 sm:h-6" aria-hidden="true" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-white hover:bg-white/20 focus:bg-white/20 rounded-full transition-colors z-10 touch-manipulation min-h-[56px] min-w-[56px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Next image (Right arrow or L)"
                aria-label={`Next image, ${images[currentIndex + 1]?.title || 'untitled'}`}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight size={24} className="sm:w-6 sm:h-6" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Main image container */}
          <div 
            className="flex items-center justify-center h-full p-4 sm:p-8 md:p-16 safe-area-inset-left safe-area-inset-right"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isZoomed ? (window.innerWidth < 768 ? 1.2 : 1.5) : 1,
                transition: { duration: 0.3 }
              }}
              className="relative max-w-full max-h-full cursor-pointer overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
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
                className="max-w-full max-h-full object-contain shadow-2xl"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </motion.div>
          </div>

          {/* Image info footer */}
          {currentImage.description && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <div className="text-white text-center">
                <p className="text-sm text-gray-300 mb-1">
                  <time dateTime={currentImage.date}>
                    {new Date(currentImage.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </p>
                <p id="lightbox-description" className="text-sm">{currentImage.description}</p>
                {currentImage.tags && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2" role="list" aria-label="Image tags">
                    {currentImage.tags.map((tag) => (
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
            </div>
          )}

          {/* Thumbnail strip for navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm max-w-xs overflow-x-auto">
              {images.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((image, index) => {
                const actualIndex = Math.max(0, currentIndex - 2) + index;
                return (
                  <button
                    key={image.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to this image - would need callback from parent
                    }}
                    className={`relative w-12 h-12 rounded overflow-hidden transition-all flex-shrink-0 ${
                      actualIndex === currentIndex 
                        ? 'ring-2 ring-white scale-110' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}