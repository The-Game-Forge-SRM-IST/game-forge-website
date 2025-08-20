'use client';

import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import { pageTransitionVariants, getMotionTransition } from '@/utils/motionUtils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  type?: 'fade' | 'slide' | 'scale' | 'gaming';
}

export default function PageTransition({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up',
  type = 'gaming'
}: PageTransitionProps) {
  const { shouldReduceAnimations } = useResponsive();

  const getDirectionOffset = () => {
    switch (direction) {
      case 'up': return { x: 0, y: 30 };
      case 'down': return { x: 0, y: -30 };
      case 'left': return { x: 30, y: 0 };
      case 'right': return { x: -30, y: 0 };
      default: return { x: 0, y: 30 };
    }
  };

  const offset = getDirectionOffset();

  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      in: { opacity: 1 },
      out: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, ...offset },
      in: { opacity: 1, x: 0, y: 0 },
      out: { opacity: 0, x: -offset.x, y: -offset.y }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      in: { opacity: 1, scale: 1 },
      out: { opacity: 0, scale: 1.1 }
    },
    gaming: {
      initial: { 
        opacity: 0, 
        scale: 0.95, 
        ...offset,
        rotateX: -5,
        filter: 'blur(4px)'
      },
      in: { 
        opacity: 1, 
        scale: 1, 
        x: 0, 
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)'
      },
      out: { 
        opacity: 0, 
        scale: 1.05, 
        x: -offset.x, 
        y: -offset.y,
        rotateX: 5,
        filter: 'blur(2px)'
      }
    }
  };

  const transition = getMotionTransition(
    shouldReduceAnimations,
    {
      duration: type === 'gaming' ? 0.8 : 0.5,
      delay,
      ease: type === 'gaming' ? [0.25, 0.1, 0.25, 1] : [0.4, 0, 0.2, 1],
    },
    {
      duration: 0.2,
      delay: 0,
      ease: 'linear',
    }
  );

  const variants = shouldReduceAnimations ? undefined : transitionVariants[type];

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}