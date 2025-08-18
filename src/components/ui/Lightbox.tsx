'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Share2 } from 'lucide-react';
import Image from 'next/image';
import { GalleryImage } from '@/types';

// --- Helper Components ---

interface LightboxButtonProps {
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const LightboxButton = ({ onClick, title, ariaLabel, children, disabled = false }: LightboxButtonProps) => (
  <button
    onClick={onClick}
    className="p-2 text-white rounded-full transition-all duration-300 enabled:hover:bg-white/20 enabled:focus:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation"
    title={title}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {children}
  </button>
);

interface ThumbnailProps {
  image: GalleryImage;
  isSelected: boolean;
  onClick: () => void;
}

const Thumbnail = memo(({ image, isSelected, onClick }: ThumbnailProps) => (
  <button 
    onClick={onClick}
    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/80 ${
      isSelected ? 'ring-2 ring-white/80 scale-105' : 'ring-1 ring-white/20 hover:ring-white/50 hover:scale-105'
    }`}
  >
    <Image
      src={image.src}
      alt={`Thumbnail for ${image.alt}`}
      fill
      className="object-cover"
      sizes="80px"
    />
    {isSelected && <div className="absolute inset-0 bg-black/50" />}
  </button>
));

Thumbnail.displayName = 'Thumbnail';

// --- Main Lightbox Component ---

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
  const [showThumbnails, setShowThumbnails] = useState(true);
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;
    switch (event.key) {
      case 'Escape': onClose(); break;
      case 'ArrowLeft': onPrevious(); break;
      case 'ArrowRight': onNext(); break;
      case 'z': setIsZoomed(z => !z); break;
      case 't': setShowThumbnails(t => !t); break;
    }
  }, [isOpen, onClose, onNext, onPrevious]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Preload next and previous images
      if (images[currentIndex + 1]) new window.Image().src = images[currentIndex + 1].src;
      if (images[currentIndex - 1]) new window.Image().src = images[currentIndex - 1].src;
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, currentIndex, images]);

  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  if (!currentImage) return null;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: currentImage.title,
          text: currentImage.description,
          url: window.location.href, // Or a direct link to the image if available
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center"
          role="dialog" aria-modal="true"
        >
          {/* Header */}
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent"
          >
            <div>
              <h3 className="text-lg font-bold text-white truncate">{currentImage.title}</h3>
              <p className="text-sm text-gray-300">{currentIndex + 1} / {images.length}</p>
            </div>
            <div className="flex items-center gap-2">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <LightboxButton onClick={handleShare} title="Share" ariaLabel="Share image">
                  <Share2 size={20} />
                </LightboxButton>
              )}
              <LightboxButton onClick={() => setIsZoomed(!isZoomed)} title={isZoomed ? 'Zoom out (Z)' : 'Zoom in (Z)'} ariaLabel={isZoomed ? 'Zoom out' : 'Zoom in'}>
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </LightboxButton>
              <LightboxButton onClick={onClose} title="Close (Esc)" ariaLabel="Close lightbox">
                <X size={24} />
              </LightboxButton>
            </div>
          </motion.header>

          {/* Main Content */}
          <div className="relative flex-1 flex items-center justify-center w-full h-full overflow-hidden">
            {/* Previous Button */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4">
              <LightboxButton onClick={onPrevious} title="Previous (←)" ariaLabel="Previous image" disabled={currentIndex === 0}>
                <ChevronLeft size={32} />
              </LightboxButton>
            </div>

            {/* Image Stage */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12"
            >
              <motion.div
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  priority
                  className="object-contain shadow-2xl shadow-black/50"
                  sizes="100vw"
                />
              </motion.div>
            </motion.div>

            {/* Next Button */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4">
              <LightboxButton onClick={onNext} title="Next (→)" ariaLabel="Next image" disabled={currentIndex === images.length - 1}>
                <ChevronRight size={32} />
              </LightboxButton>
            </div>
          </div>

          {/* Footer with Thumbnails */}
          <motion.footer
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-4"
          >
            <div className="flex justify-center">
              <div className="flex gap-2 sm:gap-3 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {images.map((img, index) => (
                  <Thumbnail 
                    key={img.id}
                    image={img}
                    isSelected={index === currentIndex}
                    onClick={() => {
                      // Navigate to the clicked thumbnail's index
                      const diff = index - currentIndex;
                      if (diff > 0) {
                        // Go forward
                        for (let i = 0; i < diff; i++) onNext();
                      } else if (diff < 0) {
                        // Go backward
                        for (let i = 0; i < Math.abs(diff); i++) onPrevious();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}