'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

// Detect if device is mobile or low-end
const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
  return isMobileUA || isSmallScreen || isLowEnd;
};

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Game Forge...');
  const [isVisible, setIsVisible] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const { resolvedTheme } = useTheme();

  const loadingSteps = [
    { progress: 15, text: 'Initializing Game Forge...', duration: 300 },
    { progress: 35, text: 'Loading epic components...', duration: 250 },
    { progress: 55, text: 'Preparing gaming content...', duration: 200 },
    { progress: 70, text: 'Loading ambient music...', duration: 200 },
    { progress: 85, text: 'Optimizing performance...', duration: 150 },
    { progress: 95, text: 'Finalizing experience...', duration: 150 },
    { progress: 100, text: 'Ready to forge games!', duration: 300 },
  ];

  useEffect(() => {
    // Detect mobile device
    setIsMobileDevice(isMobile());

    // Preload audio during loading screen
    const preloadAudio = () => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = '/C418  - Sweden - Minecraft Volume Alpha.mp3';
      audio.load();
      console.log('🎵 Audio preloading started during loading screen');
      
      // Store in window for BackgroundMusic component to use
      (window as any).__preloadedAudio = audio;
    };

    // Start audio preload early
    setTimeout(preloadAudio, 500);

    // Staggered animation sequence
    setTimeout(() => setShowLogo(true), 150);
    // Only show particles on desktop for performance
    setTimeout(() => setShowParticles(!isMobile()), 300);
    setTimeout(() => setShowProgress(true), 600);

    // Start loading sequence
    let currentStep = 0;
    let timeoutId: NodeJS.Timeout;

    const runNextStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];

        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
          setProgress(step.progress);
          setLoadingText(step.text);
        });

        currentStep++;
        timeoutId = setTimeout(runNextStep, step.duration);
      } else {
        // Loading complete - start epic exit animation
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onLoadingComplete, 800);
        }, 400);
      }
    };

    // Start the loading sequence after initial animations
    setTimeout(runNextStep, 800);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onLoadingComplete]);

  // Mobile: Ultra-minimal loading screen
  if (isMobileDevice) {
    return (
      <AnimatePresence>
        {isVisible && (
          <div className={`fixed inset-0 z-[9999] flex items-center justify-center ${
            resolvedTheme === 'light' ? 'loading-screen-light' : 'loading-screen-dark'
          }`}>
            <div className="text-center max-w-sm mx-auto px-6">
              {/* Simple logo */}
              {showLogo && (
                <div className="w-24 h-24 mx-auto mb-6 relative" style={{ aspectRatio: '1 / 1' }}>
                  <div
                    className="absolute inset-0 border-2 border-blue-400 animate-spin"
                    style={{
                      animationDuration: '3s',
                      borderRadius: '50%',
                      aspectRatio: '1 / 1'
                    }}
                  />
                  <div
                    className="absolute inset-4 bg-gradient-to-br from-blue-500 via-green-500 to-red-500 flex items-center justify-center"
                    style={{
                      borderRadius: '50%',
                      aspectRatio: '1 / 1'
                    }}
                  >
                    <Image
                      src="/images/ClubLogo.png"
                      alt="The Game Forge Club Logo"
                      width={40}
                      height={40}
                      className="object-contain rounded-full"
                      priority
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <span
                      className="text-white font-bold text-xl"
                      style={{ display: 'none' }}
                    >
                      GF
                    </span>
                  </div>
                </div>
              )}

              {/* Simple title */}
              <h1 className="text-2xl font-bold text-white mb-2">
                The Game Forge
              </h1>
              <p className="text-gray-300 text-base mb-6">
                Where creativity meets code
              </p>

              {/* Simple progress */}
              {showProgress && (
                <div className="w-full max-w-xs mx-auto">
                  <p className="text-gray-400 text-sm mb-3">{loadingText}</p>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{progress}%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: Full experience
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: 'blur(20px)',
            rotateY: 15
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden ${
            resolvedTheme === 'light' ? 'loading-screen-light' : 'loading-screen-dark'
          }`}
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
            `
          }}
        >
          {/* Optimized Background - Desktop vs Mobile */}
          <div className="absolute inset-0">
            {isMobileDevice ? (
              /* Mobile: Minimal background for performance */
              <>
                {/* Simple gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20" />

                {/* Minimal animated grid */}
                <motion.div
                  className="absolute inset-0 opacity-[0.05]"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%']
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  style={{
                    backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                  }}
                />

                {/* Simple pulsing orbs - only 3 for mobile */}
                {Array.from({ length: 3 }, (_, i) => (
                  <motion.div
                    key={`mobile-orb-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${20 + (i * 30)}%`,
                      top: `${20 + (i * 20)}%`,
                      width: '80px',
                      height: '80px',
                      background: `radial-gradient(circle, ${[
                        'rgba(59, 130, 246, 0.1)',
                        'rgba(34, 197, 94, 0.1)',
                        'rgba(239, 68, 68, 0.1)'
                      ][i]} 0%, transparent 70%)`,
                      filter: 'blur(20px)'
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </>
            ) : (
              /* Desktop: Full effects */
              <>
                {/* Dynamic floating particles */}
                <AnimatePresence>
                  {showParticles && Array.from({ length: 60 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${2 + Math.random() * 3}px`,
                        height: `${2 + Math.random() * 3}px`,
                        background: [
                          'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                          'linear-gradient(45deg, #22c55e, #15803d)',
                          'linear-gradient(45deg, #ef4444, #dc2626)',
                          'linear-gradient(45deg, #f59e0b, #d97706)',
                          'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                          'linear-gradient(45deg, #06b6d4, #0891b2)'
                        ][i % 6],
                        boxShadow: `0 0 ${4 + Math.random() * 6}px ${[
                          'rgba(59, 130, 246, 0.5)',
                          'rgba(34, 197, 94, 0.5)',
                          'rgba(239, 68, 68, 0.5)',
                          'rgba(245, 158, 11, 0.5)',
                          'rgba(139, 92, 246, 0.5)',
                          'rgba(6, 182, 212, 0.5)'
                        ][i % 6]}`
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0.8, 0],
                        scale: [0, 1, 1.3, 0],
                        y: [0, -80 - Math.random() * 150],
                        x: [0, (Math.random() - 0.5) * 80],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: 'easeOut'
                      }}
                    />
                  ))}
                </AnimatePresence>

                {/* Animated circuit grid */}
                <motion.div
                  className="absolute inset-0 opacity-[0.08]"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%']
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(34, 197, 94, 0.4) 1px, transparent 1px),
                      linear-gradient(45deg, rgba(239, 68, 68, 0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px, 80px 80px, 40px 40px',
                  }}
                />

                {/* Pulsing energy orbs */}
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={`energy-orb-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${15 + (i * 8)}%`,
                      top: `${10 + (i * 9)}%`,
                      width: `${50 + Math.random() * 30}px`,
                      height: `${50 + Math.random() * 30}px`,
                      background: `radial-gradient(circle, ${[
                        'rgba(59, 130, 246, 0.15)',
                        'rgba(34, 197, 94, 0.15)',
                        'rgba(239, 68, 68, 0.15)',
                        'rgba(245, 158, 11, 0.15)',
                        'rgba(139, 92, 246, 0.15)'
                      ][i % 5]} 0%, transparent 70%)`,
                      filter: 'blur(15px)'
                    }}
                    animate={{
                      scale: [1, 1.8, 1.3, 1],
                      opacity: [0.2, 0.5, 0.3, 0.2],
                      x: [0, Math.sin(i * 0.5) * 60, 0],
                      y: [0, Math.cos(i * 0.7) * 40, 0],
                    }}
                    transition={{
                      duration: 5 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut'
                    }}
                  />
                ))}

                {/* Scanning lines effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
                      'linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)',
                      'linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.1) 50%, transparent 100%)'
                    ],
                    backgroundPosition: ['-100% 0%', '100% 0%', '-100% 0%']
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </>
            )}
          </div>

          {/* Loading Content */}
          <div className="relative z-10 text-center max-w-lg mx-auto px-6">
            {/* Epic Animated Logo */}
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0, y: 50 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.5,
                    ease: [0.175, 0.885, 0.32, 1.275],
                    type: 'spring',
                    stiffness: 80,
                    damping: 12
                  }}
                  className="mb-8"
                >
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                    {isMobileDevice ? (
                      /* Mobile: Simplified logo */
                      <>
                        {/* Single rotating ring */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-green-400 border-b-red-400 border-l-yellow-400"
                        />

                        {/* Simple pulsing glow */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.4, 0.7, 0.4]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute -inset-4 rounded-full blur-xl bg-gradient-to-r from-blue-500/30 via-green-500/30 to-red-500/30"
                        />

                        {/* Logo center - simplified and properly circular */}
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute inset-6 rounded-full flex items-center justify-center shadow-xl overflow-hidden bg-gradient-to-br from-blue-500 via-green-500 to-red-500"
                          style={{
                            aspectRatio: '1 / 1',
                            borderRadius: '50%'
                          }}
                        >
                          {/* Club Logo with enhanced animations */}
                          <motion.div
                            animate={{
                              filter: [
                                'brightness(1) contrast(1) saturate(1) hue-rotate(0deg)',
                                'brightness(1.3) contrast(1.3) saturate(1.4) hue-rotate(10deg)',
                                'brightness(1.1) contrast(1.1) saturate(1.2) hue-rotate(-5deg)',
                                'brightness(1) contrast(1) saturate(1) hue-rotate(0deg)'
                              ],
                              rotate: [0, 8, -4, 0],
                              scale: [1, 1.05, 1.02, 1]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-16 h-16 relative rounded-full overflow-hidden flex items-center justify-center"
                            style={{
                              aspectRatio: '1 / 1',
                              borderRadius: '50%'
                            }}
                          >
                            <Image
                              src="/images/ClubLogo.png"
                              alt="The Game Forge Club Logo"
                              width={48}
                              height={48}
                              className="object-contain rounded-full"
                              priority
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'block';
                              }}
                            />
                          </motion.div>

                          {/* Enhanced Fallback with epic styling */}
                          <motion.span
                            animate={{
                              textShadow: [
                                '0 0 20px rgba(59,130,246,1), 0 0 40px rgba(59,130,246,0.5)',
                                '0 0 30px rgba(34,197,94,1), 0 0 60px rgba(34,197,94,0.5)',
                                '0 0 25px rgba(239,68,68,1), 0 0 50px rgba(239,68,68,0.5)',
                                '0 0 20px rgba(245,158,11,1), 0 0 40px rgba(245,158,11,0.5)'
                              ],
                              scale: [1, 1.1, 1.05, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-white font-bold text-2xl tracking-wider drop-shadow-2xl"
                            style={{
                              display: 'none',
                              fontFamily: 'system-ui, -apple-system, sans-serif',
                              fontWeight: 900
                            }}
                          >
                            GF
                          </motion.span>
                        </motion.div>
                      </>
                    ) : (
                      /* Desktop: Full effects */
                      <>
                        {/* Outer rotating ring with gradient */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'conic-gradient(from 0deg, #3b82f6, #22c55e, #ef4444, #f59e0b, #8b5cf6, #3b82f6)',
                            padding: '4px'
                          }}
                        >
                          <div className="w-full h-full bg-slate-950 rounded-full" />
                        </motion.div>

                        {/* Middle counter-rotating ring */}
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-6 rounded-full"
                          style={{
                            background: 'conic-gradient(from 180deg, #22c55e, #3b82f6, #8b5cf6, #ef4444, #22c55e)',
                            padding: '3px'
                          }}
                        >
                          <div className="w-full h-full bg-slate-950 rounded-full" />
                        </motion.div>

                        {/* Inner pulsing ring */}
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: 360
                          }}
                          transition={{
                            scale: { duration: 2, repeat: Infinity },
                            rotate: { duration: 15, repeat: Infinity, ease: 'linear' }
                          }}
                          className="absolute inset-12 rounded-full"
                          style={{
                            background: 'conic-gradient(from 90deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #ef4444)',
                            padding: '2px'
                          }}
                        >
                          <div className="w-full h-full bg-slate-950 rounded-full" />
                        </motion.div>

                        {/* Epic pulsing glow */}
                        <motion.div
                          animate={{
                            scale: [1, 1.4, 1.2, 1],
                            opacity: [0.3, 0.8, 0.6, 0.3]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute -inset-8 rounded-full blur-3xl"
                          style={{
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(34, 197, 94, 0.3) 25%, rgba(239, 68, 68, 0.3) 50%, rgba(245, 158, 11, 0.2) 75%, transparent 100%)'
                          }}
                        />

                        {/* Logo center with enhanced effects */}
                        <motion.div
                          animate={{
                            scale: [1, 1.08, 1.02, 1],
                            boxShadow: [
                              '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)',
                              '0 0 40px rgba(34, 197, 94, 0.8), 0 0 80px rgba(34, 197, 94, 0.4)',
                              '0 0 35px rgba(239, 68, 68, 0.8), 0 0 70px rgba(239, 68, 68, 0.4)',
                              '0 0 30px rgba(245, 158, 11, 0.8), 0 0 60px rgba(245, 158, 11, 0.4)'
                            ]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute inset-8 rounded-full flex items-center justify-center shadow-2xl overflow-hidden backdrop-blur-sm"
                          style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(34, 197, 94, 0.9) 25%, rgba(239, 68, 68, 0.9) 50%, rgba(245, 158, 11, 0.9) 75%, rgba(139, 92, 246, 0.9) 100%)',
                            border: '2px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          {/* Club Logo with enhanced animations */}
                          <motion.div
                            animate={{
                              filter: [
                                'brightness(1) contrast(1) saturate(1) hue-rotate(0deg)',
                                'brightness(1.3) contrast(1.3) saturate(1.4) hue-rotate(10deg)',
                                'brightness(1.1) contrast(1.1) saturate(1.2) hue-rotate(-5deg)',
                                'brightness(1) contrast(1) saturate(1) hue-rotate(0deg)'
                              ],
                              rotate: [0, 8, -4, 0],
                              scale: [1, 1.05, 1.02, 1]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-20 h-20 relative rounded-full overflow-hidden"
                          >
                            <Image
                              src="/images/ClubLogo.png"
                              alt="The Game Forge Club Logo"
                              fill
                              className="object-contain"
                              priority
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'block';
                              }}
                            />
                          </motion.div>

                          {/* Enhanced Fallback with epic styling */}
                          <motion.span
                            animate={{
                              textShadow: [
                                '0 0 20px rgba(59,130,246,1), 0 0 40px rgba(59,130,246,0.5)',
                                '0 0 30px rgba(34,197,94,1), 0 0 60px rgba(34,197,94,0.5)',
                                '0 0 25px rgba(239,68,68,1), 0 0 50px rgba(239,68,68,0.5)',
                                '0 0 20px rgba(245,158,11,1), 0 0 40px rgba(245,158,11,0.5)'
                              ],
                              scale: [1, 1.1, 1.05, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-white font-bold text-3xl tracking-wider drop-shadow-2xl"
                            style={{
                              display: 'none',
                              fontFamily: 'system-ui, -apple-system, sans-serif',
                              fontWeight: 900
                            }}
                          >
                            GF
                          </motion.span>
                        </motion.div>
                      </>
                    )}

                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight relative"
                  >
                    <motion.span
                      className="relative inline-block"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 25%, #ef4444 50%, #f59e0b 75%, #8b5cf6 100%)',
                        backgroundSize: '300% 300%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        textShadow: [
                          '0 0 30px rgba(59, 130, 246, 0.5)',
                          '0 0 40px rgba(34, 197, 94, 0.5)',
                          '0 0 35px rgba(239, 68, 68, 0.5)',
                          '0 0 30px rgba(245, 158, 11, 0.5)'
                        ]
                      }}
                      transition={{
                        backgroundPosition: { duration: 4, repeat: Infinity, ease: 'linear' },
                        textShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                      }}
                    >
                      The Game Forge
                      {/* Glowing underline */}
                      <motion.div
                        className="absolute -bottom-2 left-0 h-1 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #3b82f6, #22c55e, #ef4444, #f59e0b, #8b5cf6)',
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
                        }}
                        animate={{
                          width: ['0%', '100%', '100%', '0%'],
                          boxShadow: [
                            '0 0 20px rgba(59, 130, 246, 0.6)',
                            '0 0 30px rgba(34, 197, 94, 0.6)',
                            '0 0 25px rgba(239, 68, 68, 0.6)',
                            '0 0 20px rgba(245, 158, 11, 0.6)'
                          ]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1
                        }}
                      />
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: [0, 1, 0.8, 1],
                      y: 0,
                      scale: [1, 1.03, 1.01, 1]
                    }}
                    transition={{
                      opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                      scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                      y: { duration: 0.8, delay: 1.2 }
                    }}
                    className="text-gray-100 text-lg md:text-xl font-semibold relative"
                    style={{
                      textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <motion.span
                      animate={{
                        color: ['#f1f5f9', '#e2e8f0', '#cbd5e1', '#f1f5f9']
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      Where creativity meets code
                    </motion.span>

                    {/* Subtle glow effect */}
                    <motion.div
                      className="absolute inset-0 -z-10 blur-xl opacity-30"
                      animate={{
                        background: [
                          'linear-gradient(90deg, rgba(59, 130, 246, 0.3), transparent)',
                          'linear-gradient(90deg, rgba(34, 197, 94, 0.3), transparent)',
                          'linear-gradient(90deg, rgba(239, 68, 68, 0.3), transparent)',
                          'linear-gradient(90deg, rgba(59, 130, 246, 0.3), transparent)'
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Section */}
            <AnimatePresence>
              {showProgress && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="w-full max-w-sm mx-auto"
                >
                  <div className="mb-6">
                    <motion.p
                      key={loadingText}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-gray-200 text-base mb-4 font-medium min-h-[24px]"
                    >
                      {loadingText}
                    </motion.p>

                    {/* Ultra Epic Progress Bar */}
                    <div className="relative w-full bg-slate-800/40 rounded-full h-6 overflow-hidden backdrop-blur-md border-2 border-slate-600/30 shadow-2xl">
                      {/* Background glow */}
                      <motion.div
                        className="absolute -inset-2 rounded-full blur-lg opacity-50"
                        animate={{
                          background: [
                            'linear-gradient(90deg, rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.4), rgba(239, 68, 68, 0.4))',
                            'linear-gradient(90deg, rgba(34, 197, 94, 0.4), rgba(239, 68, 68, 0.4), rgba(245, 158, 11, 0.4))',
                            'linear-gradient(90deg, rgba(239, 68, 68, 0.4), rgba(245, 158, 11, 0.4), rgba(139, 92, 246, 0.4))',
                            'linear-gradient(90deg, rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.4), rgba(239, 68, 68, 0.4))'
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />

                      <motion.div
                        className="h-full rounded-full relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 25%, #ef4444 50%, #f59e0b 75%, #8b5cf6 100%)',
                          backgroundSize: '200% 100%'
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${progress}%`,
                          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                        }}
                        transition={{
                          width: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
                          backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' }
                        }}
                      >
                        {/* Multiple shine effects */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 w-8"
                          animate={{ x: ['-200%', '300%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        />

                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 w-12"
                          animate={{ x: ['-250%', '350%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Pulsing energy */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)'
                          }}
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Progress particles */}
                        {Array.from({ length: 8 }, (_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              right: `${i * 12}%`,
                              top: '50%',
                              transform: 'translateY(-50%)'
                            }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.5, 1.5, 0.5],
                              y: [0, -4, 0]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: 'easeInOut'
                            }}
                          />
                        ))}
                      </motion.div>

                      {/* Outer glow ring */}
                      <motion.div
                        className="absolute -inset-1 rounded-full"
                        style={{
                          background: 'conic-gradient(from 0deg, #3b82f6, #22c55e, #ef4444, #f59e0b, #8b5cf6, #3b82f6)',
                          padding: '1px'
                        }}
                        animate={{
                          rotate: 360,
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                          rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                          opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                        }}
                      >
                        <div className="w-full h-full bg-slate-950 rounded-full" />
                      </motion.div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>0%</span>
                      <motion.span
                        key={progress}
                        initial={{ scale: 1.1, color: '#ffffff' }}
                        animate={{ scale: 1, color: '#9ca3af' }}
                        transition={{ duration: 0.4 }}
                        className="font-mono"
                      >
                        {progress}%
                      </motion.span>
                      <span>100%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Orbs - Simplified for mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6, ease: 'easeOut' }}
              className="flex justify-center space-x-4 mt-8"
            >
              {Array.from({ length: isMobileDevice ? 3 : 7 }, (_, i) => (
                <motion.div
                  key={i}
                  className="relative"
                >
                  {/* Main orb */}
                  <motion.div
                    className="w-3 h-3 rounded-full relative"
                    style={{
                      background: [
                        'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        'linear-gradient(135deg, #22c55e, #15803d)',
                        'linear-gradient(135deg, #ef4444, #dc2626)',
                        'linear-gradient(135deg, #f59e0b, #d97706)',
                        'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        'linear-gradient(135deg, #06b6d4, #0891b2)',
                        'linear-gradient(135deg, #ec4899, #be185d)'
                      ][i],
                      boxShadow: `0 0 20px ${[
                        'rgba(59, 130, 246, 0.6)',
                        'rgba(34, 197, 94, 0.6)',
                        'rgba(239, 68, 68, 0.6)',
                        'rgba(245, 158, 11, 0.6)',
                        'rgba(139, 92, 246, 0.6)',
                        'rgba(6, 182, 212, 0.6)',
                        'rgba(236, 72, 153, 0.6)'
                      ][i]}`
                    }}
                    animate={isMobileDevice ? {
                      // Mobile: Simplified animations
                      scale: [1, 1.8, 1],
                      opacity: [0.5, 1, 0.5],
                      y: [0, -10, 0]
                    } : {
                      // Desktop: Full animations
                      scale: [1, 2.5, 1.2, 1],
                      opacity: [0.4, 1, 0.7, 0.4],
                      y: [0, -25, -5, 0],
                      rotate: [0, 180, 360],
                      boxShadow: [
                        `0 0 20px ${['rgba(59, 130, 246, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(139, 92, 246, 0.6)', 'rgba(6, 182, 212, 0.6)', 'rgba(236, 72, 153, 0.6)'][i % 7]}`,
                        `0 0 40px ${['rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(236, 72, 153, 0.8)'][i % 7]}`,
                        `0 0 25px ${['rgba(59, 130, 246, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(6, 182, 212, 0.7)', 'rgba(236, 72, 153, 0.7)'][i % 7]}`,
                        `0 0 20px ${['rgba(59, 130, 246, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(139, 92, 246, 0.6)', 'rgba(6, 182, 212, 0.6)', 'rgba(236, 72, 153, 0.6)'][i % 7]}`
                      ]
                    }}
                    transition={{
                      duration: isMobileDevice ? 1.5 : 2.2,
                      repeat: Infinity,
                      delay: i * (isMobileDevice ? 0.2 : 0.15),
                      ease: isMobileDevice ? 'easeInOut' : [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {/* Inner glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: [
                          'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                          'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
                          'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                          'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
                          'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                          'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
                          'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)'
                        ][i]
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 0.3, 0.8]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.div>

                  {/* Outer blur effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-md -z-10"
                    style={{
                      background: [
                        '#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'
                      ][i],
                      width: '20px',
                      height: '20px'
                    }}
                    animate={{
                      scale: [1.5, 3, 1.8, 1.5],
                      opacity: [0.3, 0.8, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut'
                    }}
                  />

                  {/* Trail effect */}
                  <motion.div
                    className="absolute w-1 h-8 -top-6 left-1/2 transform -translate-x-1/2 rounded-full"
                    style={{
                      background: `linear-gradient(to bottom, ${[
                        'rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(236, 72, 153, 0.8)'
                      ][i]}, transparent)`
                    }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scaleY: [0.5, 1.5, 0.5]
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: i * 0.15 + 0.3,
                      ease: 'easeInOut'
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30 pointer-events-none" />

          {/* Animated Corner Accents */}
          <motion.div
            className="absolute top-0 left-0 w-40 h-40 rounded-br-full"
            animate={{
              background: [
                'radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-0 right-0 w-40 h-40 rounded-bl-full"
            animate={{
              background: [
                'radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle at bottom left, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.2) 0%, transparent 70%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-40 h-40 rounded-tr-full"
            animate={{
              background: [
                'radial-gradient(circle at top right, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle at top right, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle at top right, rgba(239, 68, 68, 0.2) 0%, transparent 70%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-full"
            animate={{
              background: [
                'radial-gradient(circle at top left, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle at top left, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                'radial-gradient(circle at top left, rgba(139, 92, 246, 0.2) 0%, transparent 70%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/20 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}