'use client';

import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { microAnimations, interactiveFeedback } from '@/utils/motionUtils';

// Ripple effect component for buttons
interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  onClick?: () => void;
}

export function RippleEffect({ 
  children, 
  className = '', 
  color = 'rgba(34, 197, 94, 0.3)',
  onClick 
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const { shouldReduceAnimations } = useResponsive();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceAnimations) {
      onClick?.();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      {!shouldReduceAnimations && ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - 15,
            top: ripple.y - 15,
            width: 30,
            height: 30,
            backgroundColor: color,
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// Magnetic hover effect for interactive elements
interface MagneticHoverProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticHover({ 
  children, 
  strength = 10, 
  className = '' 
}: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { shouldReduceAnimations } = useResponsive();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceAnimations || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // More subtle movement calculation
    const deltaX = (e.clientX - centerX) / rect.width * strength * 0.5;
    const deltaY = (e.clientY - centerY) / rect.height * strength * 0.5;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    if (shouldReduceAnimations) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

// Gaming-style loading dots
interface LoadingDotsProps {
  count?: number;
  color?: string;
  size?: number;
}

export function LoadingDots({ 
  count = 3, 
  color = 'rgb(34, 197, 94)', 
  size = 8 
}: LoadingDotsProps) {
  const { shouldReduceAnimations } = useResponsive();

  return (
    <div className="flex space-x-2 items-center justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
          }}
          animate={shouldReduceAnimations ? {} : microAnimations.loadingDot(i * 0.2)}
        />
      ))}
    </div>
  );
}

// Text shimmer effect
interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: [string, string];
}

export function ShimmerText({ 
  children, 
  className = '',
  colors = ['rgba(255, 255, 255, 0.5)', 'rgba(34, 197, 94, 1)']
}: ShimmerTextProps) {
  const { shouldReduceAnimations } = useResponsive();

  if (shouldReduceAnimations) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={`bg-gradient-to-r from-transparent via-current to-transparent bg-clip-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[0]} 100%)`,
        backgroundSize: '200% 100%',
      }}
      animate={microAnimations.textShimmer}
    >
      {children}
    </motion.span>
  );
}

// Gaming-style notification badge
interface NotificationBadgeProps {
  count: number;
  children: React.ReactNode;
  className?: string;
}

export function NotificationBadge({ 
  count, 
  children, 
  className = '' 
}: NotificationBadgeProps) {
  const { shouldReduceAnimations } = useResponsive();

  return (
    <div className={`relative ${className}`}>
      {children}
      {count > 0 && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <motion.span
            animate={shouldReduceAnimations ? {} : microAnimations.badgePulse}
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}

// Gaming cursor trail effect
interface CursorTrailProps {
  color?: string;
  size?: number;
  trailLength?: number;
}

export function CursorTrail({ 
  color = 'rgba(34, 197, 94, 0.6)', 
  size = 4,
  trailLength = 10 
}: CursorTrailProps) {
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const { shouldReduceAnimations } = useResponsive();

  useEffect(() => {
    if (shouldReduceAnimations) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = { id: Date.now(), x: e.clientX, y: e.clientY };
      
      setTrails(prev => {
        const updated = [newTrail, ...prev.slice(0, trailLength - 1)];
        return updated;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceAnimations, trailLength]);

  if (shouldReduceAnimations) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="absolute rounded-full"
          style={{
            left: trail.x - size / 2,
            top: trail.y - size / 2,
            width: size,
            height: size,
            backgroundColor: color,
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ 
            scale: 0, 
            opacity: 0,
            transition: { 
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut' 
            }
          }}
        />
      ))}
    </div>
  );
}

// Gaming-style progress bar
interface GamingProgressBarProps {
  progress: number; // 0 to 1
  className?: string;
  color?: string;
  showPercentage?: boolean;
}

export function GamingProgressBar({ 
  progress, 
  className = '',
  color = 'rgb(34, 197, 94)',
  showPercentage = true 
}: GamingProgressBarProps) {
  const { shouldReduceAnimations } = useResponsive();

  return (
    <div className={`relative ${className}`}>
      {/* Background */}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
        {/* Progress fill */}
        <motion.div
          className="h-full rounded-full relative"
          style={{ transformOrigin: 'left', backgroundColor: color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={shouldReduceAnimations ? { duration: 0.1 } : { 
            duration: 0.5, 
            ease: 'easeOut' 
          }}
        >
          {/* Animated shine effect */}
          {!shouldReduceAnimations && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>
      </div>
      
      {/* Percentage display */}
      {showPercentage && (
        <motion.div
          className="absolute right-0 -top-6 text-xs text-gray-300 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(progress * 100)}%
        </motion.div>
      )}
    </div>
  );
}

// Icon bounce animation wrapper
interface BouncingIconProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function BouncingIcon({ 
  children, 
  className = '',
  delay = 0 
}: BouncingIconProps) {
  const { shouldReduceAnimations } = useResponsive();

  return (
    <motion.div
      className={className}
      animate={shouldReduceAnimations ? {} : microAnimations.iconBounce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}