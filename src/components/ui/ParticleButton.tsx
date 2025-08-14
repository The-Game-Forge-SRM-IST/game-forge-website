'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { ClientOnly } from '@/components/ui';

interface ParticleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  particleCount?: number;
  particleColor?: string;
  disabled?: boolean;
}

export default function ParticleButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  particleCount = 12,
  particleColor = 'rgba(34, 197, 94, 0.8)',
  disabled = false,
}: ParticleButtonProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; moveX: number; moveY: number; rotation: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { shouldReduceAnimations } = useResponsive();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const baseClasses = `
    relative overflow-hidden font-semibold rounded-xl transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
    disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3
  `;

  const variantClasses = {
    primary: 'bg-green-400 text-black hover:bg-green-300 focus:ring-green-400',
    secondary: 'bg-blue-500 text-white hover:bg-blue-400 focus:ring-blue-500',
    outline: 'border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 focus:ring-white/50',
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || shouldReduceAnimations || !isMounted) {
      onClick?.();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Simple seeded random function for consistent results
    let seed = Date.now() % 10000; // Use timestamp for some variation
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Create particles with stable random values
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      moveX: (seededRandom() - 0.5) * 100,
      moveY: (seededRandom() - 0.5) * 100,
      rotation: seededRandom() * 360,
    }));

    setParticles(newParticles);

    // Button press animation
    await controls.start({
      scale: 0.95,
      transition: { duration: 0.1 },
    });

    await controls.start({
      scale: 1,
      transition: { duration: 0.2, type: 'spring', stiffness: 500 },
    });

    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 1000);

    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      animate={controls}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={shouldReduceAnimations ? {} : { 
        scale: 1.05,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Particle effects */}
      <ClientOnly>
        {!shouldReduceAnimations && particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              backgroundColor: particleColor,
              left: particle.x - 4,
              top: particle.y - 4,
            }}
            initial={{
              scale: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              x: [0, particle.moveX],
              y: [0, particle.moveY],
              rotate: [0, particle.rotation],
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.02,
              ease: 'easeOut',
            }}
          />
        ))}
      </ClientOnly>

      {/* Gaming-style scan line effect */}
      {!shouldReduceAnimations && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{
            x: '200%',
            transition: { duration: 0.6, ease: 'easeInOut' },
          }}
        />
      )}

      {/* Gaming UI corners */}
      {!shouldReduceAnimations && (
        <>
          <motion.div
            className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-white/40"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-white/40"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-white/40"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-white/40"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          />
        </>
      )}
    </motion.button>
  );
}