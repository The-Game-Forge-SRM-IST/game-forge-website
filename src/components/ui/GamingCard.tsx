'use client';

import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import { cardVariants, gamingHoverVariants, getMotionTransition } from '@/utils/motionUtils';
import { ReactNode, useState, useEffect } from 'react';
import { ClientOnly } from '@/components/ui';

interface GamingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: 'lift' | 'tilt' | 'glow' | 'scale';
  glowColor?: 'green' | 'blue' | 'red' | 'white';
  onClick?: () => void;
}

export default function GamingCard({
  children,
  className = '',
  delay = 0,
  hoverEffect = 'lift',
  glowColor = 'green',
  onClick,
}: GamingCardProps) {
  const { shouldReduceAnimations } = useResponsive();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const glowColors = {
    green: 'rgba(34, 197, 94, 0.3)',
    blue: 'rgba(59, 130, 246, 0.3)',
    red: 'rgba(239, 68, 68, 0.3)',
    white: 'rgba(255, 255, 255, 0.2)',
  };

  const hoverVariants = {
    lift: {
      y: -8,
      scale: 1.02,
      boxShadow: `0 20px 40px ${glowColors[glowColor]}`,
    },
    tilt: {
      rotateY: 5,
      rotateX: 2,
      scale: 1.02,
      boxShadow: `0 15px 30px ${glowColors[glowColor]}`,
    },
    glow: {
      boxShadow: `0 0 30px ${glowColors[glowColor]}`,
      scale: 1.01,
    },
    scale: {
      scale: 1.05,
      boxShadow: `0 10px 25px ${glowColors[glowColor]}`,
    },
  };

  const motionVariants = shouldReduceAnimations ? undefined : cardVariants;

  return (
    <motion.div
      variants={motionVariants}
      initial={shouldReduceAnimations ? undefined : "hidden"}
      whileInView={shouldReduceAnimations ? undefined : "visible"}
      whileHover={shouldReduceAnimations ? undefined : hoverVariants[hoverEffect]}
      whileTap={shouldReduceAnimations ? undefined : "tap"}
      viewport={{ once: true, margin: "-50px" }}
      transition={getMotionTransition(
        shouldReduceAnimations,
        { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
        { duration: 0.2, delay: 0, ease: 'linear' }
      )}
      className={`
        relative cursor-pointer transform-gpu
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      {/* Gaming-style corner decorations */}
      {!shouldReduceAnimations && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/20" />
        </>
      )}

      {/* Animated border */}
      {!shouldReduceAnimations && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Particle effects on hover */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-${glowColor}-400/60`}
              initial={{
                x: '50%',
                y: '50%',
                opacity: 0,
                scale: 0,
              }}
              whileHover={isMounted ? {
                x: ((i * 37) % 100) + '%', // Pseudo-random but consistent
                y: ((i * 73) % 100) + '%',
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              } : {}}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}