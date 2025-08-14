'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Skeleton animation variants
const skeletonVariants = {
  loading: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Card skeleton for team members, projects, etc.
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gray-800/50 rounded-lg p-6 ${className}`}
      variants={skeletonVariants}
      animate="loading"
    >
      <div className="space-y-4">
        {/* Image placeholder */}
        <div className="w-full h-48 bg-gray-700/50 rounded-lg" />
        
        {/* Title placeholder */}
        <div className="h-6 bg-gray-700/50 rounded w-3/4" />
        
        {/* Description placeholders */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-700/50 rounded w-full" />
          <div className="h-4 bg-gray-700/50 rounded w-2/3" />
        </div>
        
        {/* Button placeholder */}
        <div className="h-10 bg-gray-700/50 rounded w-1/3" />
      </div>
    </motion.div>
  );
}

// Grid skeleton for sections
export function GridSkeleton({ 
  count = 6, 
  className = "",
  cardClassName = ""
}: { 
  count?: number;
  className?: string;
  cardClassName?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} className={cardClassName} />
      ))}
    </div>
  );
}

// Text skeleton for content areas
export function TextSkeleton({ 
  lines = 3, 
  className = "" 
}: { 
  lines?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`space-y-3 ${className}`}
      variants={skeletonVariants}
      animate="loading"
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-700/50 rounded ${
            index === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </motion.div>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center"
      variants={skeletonVariants}
      animate="loading"
    >
      <div className="text-center space-y-8">
        {/* Logo placeholder */}
        <div className="w-32 h-32 bg-gray-700/50 rounded-full mx-auto" />
        
        {/* Title placeholder */}
        <div className="space-y-4">
          <div className="h-12 bg-gray-700/50 rounded w-80 mx-auto" />
          <div className="h-6 bg-gray-700/50 rounded w-96 mx-auto" />
        </div>
        
        {/* Button placeholders */}
        <div className="flex gap-4 justify-center">
          <div className="h-12 bg-gray-700/50 rounded w-32" />
          <div className="h-12 bg-gray-700/50 rounded w-32" />
        </div>
      </div>
    </motion.div>
  );
}

// Navigation skeleton
export function NavigationSkeleton() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm"
      variants={skeletonVariants}
      animate="loading"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo placeholder */}
          <div className="w-8 h-8 bg-gray-700/50 rounded" />
          
          {/* Navigation items placeholder */}
          <div className="hidden md:flex space-x-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-700/50 rounded w-16" />
            ))}
          </div>
          
          {/* Mobile menu button placeholder */}
          <div className="md:hidden w-6 h-6 bg-gray-700/50 rounded" />
        </div>
      </div>
    </motion.nav>
  );
}

// Gallery skeleton
export function GallerySkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="aspect-square bg-gray-700/50 rounded-lg"
          variants={skeletonVariants}
          animate="loading"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Form skeleton
export function FormSkeleton() {
  return (
    <motion.div
      className="space-y-6"
      variants={skeletonVariants}
      animate="loading"
    >
      {/* Form title */}
      <div className="h-8 bg-gray-700/50 rounded w-1/2" />
      
      {/* Form fields */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-700/50 rounded w-1/4" />
          <div className="h-12 bg-gray-700/50 rounded w-full" />
        </div>
      ))}
      
      {/* Submit button */}
      <div className="h-12 bg-gray-700/50 rounded w-32" />
    </motion.div>
  );
}

// Loading spinner component
export function LoadingSpinner({ 
  size = 'medium',
  className = ""
}: {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="w-full h-full border-2 border-green-500/30 border-t-green-500 rounded-full" />
    </motion.div>
  );
}

// Section loading wrapper
export function SectionLoader({ 
  isLoading, 
  skeleton, 
  children,
  className = ""
}: {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {isLoading ? skeleton : children}
    </div>
  );
}

// Progressive image loader with skeleton
export function ProgressiveImage({
  src,
  alt,
  className = "",
  skeletonClassName = "",
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  [key: string]: unknown;
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className="relative">
      {isLoading && !hasError && (
        <motion.div
          className={`absolute inset-0 bg-gray-700/50 rounded ${skeletonClassName}`}
          variants={skeletonVariants}
          animate="loading"
        />
      )}
      
      {hasError ? (
        <div className={`bg-gray-800/50 rounded flex items-center justify-center ${className}`}>
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={500}
          height={300}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}