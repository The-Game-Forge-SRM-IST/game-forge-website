'use client';

import { Variants, Transition } from 'framer-motion';

// Gaming-inspired easing curves
export const gamingEasing = {
  smooth: [0.25, 0.1, 0.25, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  power: [0.77, 0, 0.175, 1],
  expo: [0.19, 1, 0.22, 1],
} as const;

// Base animation durations
export const animationDurations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

// Section transition variants
export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: animationDurations.slow,
      ease: gamingEasing.smooth,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 1.05,
    transition: {
      duration: animationDurations.normal,
      ease: gamingEasing.power,
    },
  },
};

// Card animation variants
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: animationDurations.slow,
      ease: gamingEasing.smooth,
    },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: animationDurations.fast,
      ease: gamingEasing.smooth,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: animationDurations.fast,
      ease: gamingEasing.power,
    },
  },
};

// Button animation variants
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
    y: -1,
    transition: {
      duration: animationDurations.fast,
      ease: gamingEasing.smooth,
    },
  },
  tap: {
    scale: 0.97,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    y: 0,
    transition: {
      duration: animationDurations.fast,
      ease: gamingEasing.power,
    },
  },
};

// Gaming-inspired hover effects
export const gamingHoverVariants: Variants = {
  rest: {
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    z: 0,
  },
  hover: {
    scale: 1.02,
    rotateY: 5,
    rotateX: 2,
    z: 50,
    transition: {
      duration: animationDurations.normal,
      ease: gamingEasing.elastic,
    },
  },
};

// Stagger animation for lists
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: animationDurations.slow,
      ease: gamingEasing.smooth,
    },
  },
};

// Page transition variants
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: animationDurations.slow,
      ease: gamingEasing.smooth,
    },
  },
  out: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    transition: {
      duration: animationDurations.normal,
      ease: gamingEasing.power,
    },
  },
};

// Floating animation for decorative elements
export const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Pulse animation for interactive elements
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Glow effect variants
export const glowVariants: Variants = {
  rest: {
    boxShadow: '0 0 0px rgba(34, 197, 94, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
    transition: {
      duration: animationDurations.normal,
      ease: gamingEasing.smooth,
    },
  },
};

// Utility function to create reduced motion variants
export const createReducedMotionVariants = (variants: Variants): Variants => {
  const reducedVariants: Variants = {};
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null) {
      reducedVariants[key] = {
        ...variant,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        y: 0,
        x: 0,
        transition: {
          duration: animationDurations.fast,
          ease: 'linear',
        },
      };
    }
  });
  
  return reducedVariants;
};

// Utility function to get appropriate transition based on motion preferences
export const getMotionTransition = (
  hasReducedMotion: boolean,
  normalTransition: Transition,
  reducedTransition?: Transition
): Transition => {
  if (hasReducedMotion) {
    return reducedTransition || {
      duration: animationDurations.fast,
      ease: 'linear',
    };
  }
  return normalTransition;
};

// Gaming-inspired particle trail effect
export const particleTrailVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
  },
  visible: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    x: [0, Math.random() * 100 - 50],
    y: [0, Math.random() * 100 - 50],
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
};

// Typewriter effect variants
export const typewriterVariants: Variants = {
  hidden: {
    width: 0,
  },
  visible: {
    width: 'auto',
    transition: {
      duration: 2,
      ease: 'linear',
    },
  },
};

// Gaming UI element variants
export const gamingUIVariants: Variants = {
  idle: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 0px rgba(34, 197, 94, 0)',
  },
  active: {
    borderColor: 'rgba(34, 197, 94, 0.8)',
    boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)',
    transition: {
      duration: animationDurations.normal,
      ease: gamingEasing.smooth,
    },
  },
  error: {
    borderColor: 'rgba(239, 68, 68, 0.8)',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: animationDurations.slow,
      ease: gamingEasing.bounce,
    },
  },
};

// Enhanced micro-animation variants
export const microAnimations = {
  // Button press feedback
  buttonPress: {
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeOut' },
  },
  
  // Icon bounce on hover
  iconBounce: {
    y: [-2, 0, -2],
    transition: {
      duration: 0.6,
      repeat: Infinity,
    },
  },
  
  // Text shimmer effect
  textShimmer: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
  
  // Gaming-style loading dots
  loadingDot: (delay: number) => ({
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay,
    },
  }),
  
  // Notification badge pulse
  badgePulse: {
    scale: [1, 1.1, 1],
    boxShadow: [
      '0 0 0 0 rgba(34, 197, 94, 0.7)',
      '0 0 0 10px rgba(34, 197, 94, 0)',
      '0 0 0 0 rgba(34, 197, 94, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
  
  // Gaming cursor trail
  cursorTrail: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// Gaming-inspired section transitions
export const gamingSectionTransitions = {
  // Slide in from different directions based on section
  slideInVariants: (direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
    const directions = {
      left: { x: -100, y: 0 },
      right: { x: 100, y: 0 },
      up: { x: 0, y: 50 },
      down: { x: 0, y: -50 },
    };
    
    return {
      hidden: {
        opacity: 0,
        ...directions[direction],
        scale: 0.9,
        filter: 'blur(4px)',
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration: 0.8,
          ease: gamingEasing.smooth,
          staggerChildren: 0.1,
        },
      },
    };
  },
  
  // Matrix-style digital rain effect
  digitalRain: {
    hidden: {
      opacity: 0,
      y: -20,
      scaleY: 0,
    },
    visible: {
      opacity: [0, 1, 1, 0],
      y: [0, 0, 100, 100],
      scaleY: [0, 1, 1, 0],
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      },
    },
  },
  
  // Glitch effect for dramatic entrances
  glitchEffect: {
    hidden: {
      opacity: 0,
      x: 0,
      skewX: 0,
    },
    visible: {
      opacity: 1,
      x: [0, -2, 2, 0],
      skewX: [0, 2, -2, 0],
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        times: [0, 0.3, 0.7, 1],
      },
    },
  },
};

// Interactive element feedback animations
export const interactiveFeedback = {
  // Ripple effect for buttons
  ripple: {
    scale: [0, 4],
    opacity: [1, 0],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  
  // Gaming-style selection highlight
  selectionHighlight: {
    boxShadow: [
      '0 0 0 0 rgba(34, 197, 94, 0)',
      '0 0 0 4px rgba(34, 197, 94, 0.3)',
      '0 0 0 8px rgba(34, 197, 94, 0)',
    ],
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  
  // Magnetic hover effect
  magneticHover: (strength: number = 10) => ({
    x: [-strength, strength, -strength, 0],
    y: [-strength/2, strength/2, -strength/2, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  }),
  
  // Gaming UI beep visualization
  beepVisualization: {
    scale: [1, 1.05, 1],
    borderColor: [
      'rgba(34, 197, 94, 0.3)',
      'rgba(34, 197, 94, 1)',
      'rgba(34, 197, 94, 0.3)',
    ],
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

// Scroll-triggered animations
export const scrollAnimations = {
  // Parallax scrolling variants
  parallax: (speed: number = 0.5) => ({
    y: `${speed * 100}%`,
    transition: {
      ease: 'linear',
    },
  }),
  
  // Scale on scroll
  scaleOnScroll: {
    scale: [0.8, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.8,
      ease: gamingEasing.smooth,
    },
  },
  
  // Rotate on scroll
  rotateOnScroll: {
    rotate: [0, 360],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Gaming-themed loading animations
export const loadingAnimations = {
  // Spinning gaming logo
  spinningLogo: {
    rotate: [0, 360],
    scale: [1, 1.1, 1],
    transition: {
      rotate: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
      scale: {
        duration: 1,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      },
    },
  },
  
  // Progress bar fill
  progressFill: (progress: number) => ({
    scaleX: progress,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  
  // Skeleton loading shimmer
  skeletonShimmer: {
    backgroundPosition: ['-200px 0', '200px 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};