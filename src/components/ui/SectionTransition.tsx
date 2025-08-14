'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useResponsive } from '@/hooks/useResponsive';
import { sectionVariants, staggerContainer, getMotionTransition } from '@/utils/motionUtils';

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
  threshold?: number;
  triggerOnce?: boolean;
  effect?: 'default' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom' | 'gaming' | 'glitch';
  intensity?: 'subtle' | 'normal' | 'dramatic';
}

export default function SectionTransition({
  children,
  className = '',
  delay = 0,
  stagger = false,
  threshold = 0.1,
  triggerOnce = true,
  effect = 'gaming',
  intensity = 'normal',
}: SectionTransitionProps) {
  const { shouldReduceAnimations } = useResponsive();
  
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin: '-50px 0px',
  });

  const intensityMultipliers = {
    subtle: 0.5,
    normal: 1,
    dramatic: 1.5,
  };

  const multiplier = intensityMultipliers[intensity];

  const effectVariants = {
    default: sectionVariants,
    'slide-up': {
      hidden: { opacity: 0, y: 50 * multiplier },
      visible: { opacity: 1, y: 0 },
    },
    'slide-left': {
      hidden: { opacity: 0, x: 50 * multiplier },
      visible: { opacity: 1, x: 0 },
    },
    'slide-right': {
      hidden: { opacity: 0, x: -50 * multiplier },
      visible: { opacity: 1, x: 0 },
    },
    zoom: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    gaming: {
      hidden: {
        opacity: 0,
        y: 30 * multiplier,
        scale: 0.95,
        rotateX: -10 * multiplier,
        filter: 'blur(4px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          staggerChildren: stagger ? 0.1 : 0,
        },
      },
    },
    glitch: {
      hidden: {
        opacity: 0,
        x: -10 * multiplier,
        skewX: 5 * multiplier,
        filter: 'hue-rotate(90deg) saturate(2)',
      },
      visible: {
        opacity: 1,
        x: 0,
        skewX: 0,
        filter: 'hue-rotate(0deg) saturate(1)',
        transition: {
          duration: 0.6,
          ease: [0.68, -0.55, 0.265, 1.55],
          staggerChildren: stagger ? 0.05 : 0,
        },
      },
    },
  };

  const variants = shouldReduceAnimations 
    ? undefined 
    : stagger && effect !== 'gaming' && effect !== 'glitch'
      ? staggerContainer 
      : effectVariants[effect];

  const transition = getMotionTransition(
    shouldReduceAnimations,
    {
      duration: effect === 'gaming' ? 0.8 : effect === 'glitch' ? 0.6 : 0.5,
      delay,
      ease: effect === 'gaming' ? [0.25, 0.1, 0.25, 1] : 
            effect === 'glitch' ? [0.68, -0.55, 0.265, 1.55] :
            [0.4, 0, 0.2, 1],
    },
    {
      duration: 0.2,
      delay: 0,
      ease: 'linear',
    }
  );

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial={shouldReduceAnimations ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
      transition={effect === 'gaming' || effect === 'glitch' ? undefined : transition}
      className={className}
      style={{ perspective: '1000px' }}
    >
      {children}
    </motion.div>
  );
}