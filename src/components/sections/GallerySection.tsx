'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Filter, Grid, List } from 'lucide-react';
import { GalleryImage } from '@/types';
import { Lightbox } from '@/components/ui/Lightbox';
import { 
  useProgressiveLoading, 
  getGPUOptimizedVariants, 
  useSmartAnimations 
} from '@/utils/performanceOptimizer';

interface GallerySectionProps {
  images: GalleryImage[];
}

const categoryLabels = {
  events: 'Events',
  workshops: 'Workshops', 
  competitions: 'Competitions',
  social: 'Social',
  projects: 'Projects'
};

const categoryColors = {
  events: 'bg-blue-500/20 text-blue-300',
  workshops: 'bg-green-500/20 text-green-300',
  competitions: 'bg-red-500/20 text-red-300',
  social: 'bg-purple-500/20 text-purple-300',
  projects: 'bg-yellow-500/20 text-yellow-300'
};

const GallerySection = memo(function GallerySection({ images }: GallerySectionProps) {
  const { ref, loadingStage } = useProgressiveLoading(0.1);
  const canAnimate = useSmartAnimations();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return images;
    return images.filter(image => image.category === selectedCategory);
  }, [images, selectedCategory]);

  // Get unique categories from images
  const categories = useMemo(() => {
    const cats = Array.from(new Set(images.map(img => img.category)));
    return cats.sort();
  }, [images]);

  // Handle image load for lazy loading effect
  const handleImageLoad = (imageId: string) => {
    setImagesLoaded(prev => new Set([...prev, imageId]));
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxIndex(-1);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => 
      prev < filteredImages.length - 1 ? prev + 1 : 0
    );
  };

  const previousImage = () => {
    setLightboxIndex((prev) => 
      prev > 0 ? prev - 1 : filteredImages.length - 1
    );
  };

  // Get optimized animation variants
  const variants = getGPUOptimizedVariants();
  
  // Progressive loading stages
  if (loadingStage === 'idle') {
    return <section ref={ref} id="gallery" className="py-20 relative overflow-hidden" />;
  }
  
  if (loadingStage === 'skeleton') {
    return (
      <section ref={ref} id="gallery" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-32 h-12 bg-gray-700/30 rounded mx-auto mb-6 animate-pulse" />
            <div className="w-96 h-6 bg-gray-700/30 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800/20 rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-700/30" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="gallery" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-green-900/10" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          variants={canAnimate && loadingStage === 'animations' ? variants.container : {}}
          initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
          animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            variants={canAnimate ? variants.item : {}}
          >
            Gallery
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            variants={canAnimate ? variants.item : {}}
          >
            A visual journey through our events, workshops, and memorable moments at The Game Forge.
          </motion.p>
        </motion.div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={20} className="text-gray-400 mr-2" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All ({images.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-white text-gray-900'
                    : `bg-gray-800 text-gray-300 hover:bg-gray-700 ${categoryColors[category as keyof typeof categoryColors]}`
                }`}
              >
                {categoryLabels[category as keyof typeof categoryLabels]} (
                {images.filter(img => img.category === category).length})
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'masonry'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Masonry view"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Grid view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Image grid */}
        <motion.div
          className={
            viewMode === 'masonry'
              ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          }
          variants={canAnimate && loadingStage === 'animations' ? variants.container : {}}
          initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
          animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${selectedCategory}-${image.id}`}
              className={`group cursor-pointer ${viewMode === 'masonry' ? 'break-inside-avoid' : ''}`}
              onClick={() => openLightbox(index)}
              variants={canAnimate ? variants.item : {}}
            >
              <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-500">
                {/* Image */}
                <div className="relative aspect-auto">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className={`w-full h-auto object-cover transition-opacity duration-500 ${
                      imagesLoaded.has(image.id) 
                        ? 'opacity-100' 
                        : 'opacity-0'
                    }`}
                    onLoad={() => handleImageLoad(image.id)}
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category badge */}
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                    categoryColors[image.category]
                  }`}>
                    {categoryLabels[image.category]}
                  </div>
                </div>

                {/* Image info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      {new Date(image.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {image.tags && image.tags.length > 0 && (
                      <span>#{image.tags[0]}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Grid size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">No images found in this category</p>
              <p className="text-sm mt-2">Try selecting a different category</p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </section>
  );
});

export { GallerySection };