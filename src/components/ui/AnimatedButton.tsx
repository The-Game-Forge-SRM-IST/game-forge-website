'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import { buttonVariants, glowVariants } from '@/utils/motionUtils';
import { ReactNode, useState, useEffect, useMemo } from 'react';
import { ClientOnly } from '@/components/ui';
import { useTheme } from '@/providers/ThemeProvider';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glowEffect?: boolean;
  particleEffect?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
  loadingText?: string;
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  glowEffect = false,
  particleEffect = false,
  className = '',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}: AnimatedButtonProps) {
  const { shouldReduceAnimations, getTouchTargetSize } = useResponsive();
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate stable particle positions using a seeded random function
  const particles = useMemo(() => {
    if (!isMounted) return [];

    // Simple seeded random function for consistent results
    let seed = 12345; // Fixed seed for consistency
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      initialX: seededRandom() * 100,
      initialY: seededRandom() * 100,
      animateX: [
        seededRandom() * 100,
        seededRandom() * 100,
        seededRandom() * 100,
      ],
      animateY: [
        seededRandom() * 100,
        seededRandom() * 100,
        seededRandom() * 100,
      ],
      duration: 3 + seededRandom() * 2,
      delay: seededRandom() * 2,
    }));
  }, [isMounted]);

  const baseClasses = `
    relative overflow-hidden font-semibold rounded-xl transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getTouchTargetSize()}
    ${loading ? 'cursor-wait' : ''}
    ${isPressed ? 'transform scale-95' : ''}
    ${resolvedTheme === 'light' ? 'focus:ring-offset-white' : 'focus:ring-offset-black'}
  `;

  const variantClasses = {
    primary: 'bg-green-400 text-black hover:bg-green-300 focus:ring-green-400',
    secondary: 'bg-blue-500 text-white hover:bg-blue-400 focus:ring-blue-500',
    outline: resolvedTheme === 'light'
      ? 'border-2 border-border-color text-foreground hover:bg-background-secondary hover:border-green-400 focus:ring-green-400'
      : 'border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 focus:ring-white/50',
    ghost: resolvedTheme === 'light'
      ? 'text-foreground hover:bg-background-secondary focus:ring-green-400'
      : 'text-white hover:bg-white/10 focus:ring-white/50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const motionVariants = shouldReduceAnimations ? undefined : buttonVariants;
  const glowMotionVariants = shouldReduceAnimations ? undefined : glowVariants;

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const isDisabled = disabled || loading;

  return (
    <motion.button
      variants={motionVariants}
      initial="rest"
      whileHover={isDisabled ? undefined : shouldReduceAnimations ? { scale: 1.02 } : "hover"}
      whileTap={isDisabled ? undefined : shouldReduceAnimations ? { scale: 0.98 } : "tap"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      {...props}
    >
      {/* Glow effect */}
      {glowEffect && !shouldReduceAnimations && (
        <motion.div
          variants={glowMotionVariants}
          initial="rest"
          whileHover="hover"
          className="absolute inset-0 rounded-xl"
        />
      )}

      {/* Particle effect background */}
      {particleEffect && !shouldReduceAnimations && (
        <ClientOnly>
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className={`absolute w-1 h-1 rounded-full ${resolvedTheme === 'light' ? 'bg-green-400/50' : 'bg-white/30'
                  }`}
                initial={{
                  x: particle.initialX + '%',
                  y: particle.initialY + '%',
                  opacity: 0,
                }}
                animate={{
                  x: particle.animateX.map(x => x + '%'),
                  y: particle.animateY.map(y => y + '%'),
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: particle.delay,
                }}
              />
            ))}
          </div>
        </ClientOnly>
      )}

      {/* Shimmer effect */}
      {!shouldReduceAnimations && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent -skew-x-12 ${resolvedTheme === 'light' ? 'via-green-400/20' : 'via-white/10'
            }`}
          initial={{ x: '-100%' }}
          whileHover={{
            x: '200%',
            transition: { duration: 0.6, ease: 'easeInOut' },
          }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={shouldReduceAnimations ? {} : { rotate: 360 }}
              transition={shouldReduceAnimations ? {} : { duration: 1, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
            <span className="sr-only">{loadingText}</span>
            <span aria-hidden="true">{loadingText}</span>
          </>
        ) : (
          children
        )}
      </span>

      {/* Gaming-style border animation */}
      {!shouldReduceAnimations && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
          <motion.div
            className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-white/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileHover={{ scaleY: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />
          <motion.div
            className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-white/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileHover={{ scaleY: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          />
        </>
      )}

      {/* Gaming corner brackets */}
      {!shouldReduceAnimations && (
        <>
          <motion.div
            className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-white/30"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-white/30"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-white/30"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-white/30"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          />
        </>
      )}
    </motion.button>
  );
}