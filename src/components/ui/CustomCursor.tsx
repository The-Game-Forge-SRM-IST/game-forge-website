'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CustomCursorProps {
  className?: string;
}

export default function CustomCursor({ className = '' }: CustomCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click' | 'text' | 'gaming'>('default');
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Check if device is mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isMobileUA || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render cursor on mobile devices
  if (isMobile) {
    return null;
  }
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring animation for cursor movement with gaming feel
  const springConfig = { damping: 20, stiffness: 800, mass: 0.3 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Calculate velocity for dynamic effects
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      setMouseVelocity({ x: deltaX, y: deltaY });
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    const handleMouseDown = () => {
      setIsClicking(true);
      setCursorVariant('click');
    };
    
    const handleMouseUp = () => {
      setIsClicking(false);
      setCursorVariant(isHovering ? 'hover' : 'default');
    };

    // Detect hoverable elements with gaming-specific detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.matches('a, button, [role="button"], input, textarea, select, .cursor-pointer, [data-cursor="hover"]');
      const isText = target.matches('p, span, h1, h2, h3, h4, h5, h6, [data-cursor="text"]');
      const isGaming = target.matches('.achievement-card, .project-card, .gallery-item, [data-cursor="gaming"]');
      
      if (isGaming) {
        setIsHovering(true);
        setCursorVariant('gaming');
      } else if (isText) {
        setIsHovering(true);
        setCursorVariant('text');
      } else if (isHoverable) {
        setIsHovering(true);
        setCursorVariant('hover');
      } else {
        setIsHovering(false);
        setCursorVariant('default');
      }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isHovering]);

  const cursorVariants = {
    default: {
      scale: 1,
      rotate: 0,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      border: '2px solid rgba(59, 130, 246, 1)',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)',
      borderRadius: '50%',
    },
    hover: {
      scale: 1.5,
      rotate: 45,
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      border: '2px solid rgba(34, 197, 94, 1)',
      boxShadow: '0 0 25px rgba(34, 197, 94, 0.8), 0 0 50px rgba(34, 197, 94, 0.4)',
      borderRadius: '30%',
    },
    click: {
      scale: 0.8,
      rotate: 180,
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      border: '2px solid rgba(239, 68, 68, 1)',
      boxShadow: '0 0 30px rgba(239, 68, 68, 1), 0 0 60px rgba(239, 68, 68, 0.5)',
      borderRadius: '20%',
    },
    text: {
      scale: 1.2,
      rotate: 0,
      backgroundColor: 'rgba(245, 158, 11, 0.8)',
      border: '2px solid rgba(245, 158, 11, 1)',
      boxShadow: '0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.3)',
      borderRadius: '20%',
    },
    gaming: {
      scale: 2,
      rotate: 90,
      backgroundColor: 'rgba(139, 92, 246, 0.9)',
      border: '3px solid rgba(139, 92, 246, 1)',
      boxShadow: '0 0 35px rgba(139, 92, 246, 1), 0 0 70px rgba(139, 92, 246, 0.6), 0 0 100px rgba(139, 92, 246, 0.3)',
      borderRadius: '25%',
    }
  };

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom Cursor */}
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 pointer-events-none z-[10000] mix-blend-difference ${className}`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={isVisible ? 'visible' : 'hidden'}
        variants={{
          visible: { opacity: 1 },
          hidden: { opacity: 0 }
        }}
      >
        {/* Main cursor */}
        <motion.div
          className="w-full h-full relative overflow-hidden"
          variants={cursorVariants}
          animate={cursorVariant}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          style={{
            clipPath: cursorVariant === 'gaming' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined
          }}
        >
          {/* Dynamic inner glow based on cursor state */}
          <motion.div
            className="absolute inset-1"
            style={{ borderRadius: 'inherit' }}
            animate={{
              background: cursorVariant === 'gaming' ? [
                'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(139,92,246,0.5) 50%, transparent 100%)',
                'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(139,92,246,0.8) 50%, transparent 100%)',
                'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(139,92,246,0.5) 50%, transparent 100%)'
              ] : [
                'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)'
              ]
            }}
            transition={{ duration: cursorVariant === 'gaming' ? 1 : 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Rotating ring with dynamic speed */}
          <motion.div
            className="absolute inset-0 border border-white/40"
            style={{ borderRadius: 'inherit' }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: cursorVariant === 'gaming' ? 1.5 : 3, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
          />
          
          {/* Gaming mode: Additional rotating elements */}
          {cursorVariant === 'gaming' && (
            <>
              <motion.div
                className="absolute inset-1 border border-white/60"
                style={{ borderRadius: 'inherit' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-white transform -translate-x-1/2 -translate-y-1/2"
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}
          
          {/* Default pulsing dot */}
          {cursorVariant !== 'gaming' && (
            <motion.div
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          
          {/* Velocity-based streaks */}
          {(Math.abs(mouseVelocity.x) > 5 || Math.abs(mouseVelocity.y) > 5) && (
            <motion.div
              className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-white/60 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                rotate: Math.atan2(mouseVelocity.y, mouseVelocity.x) * (180 / Math.PI),
                scaleX: Math.min(Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2) / 10, 3)
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />
          )}
        </motion.div>

        {/* Enhanced trailing particles */}
        {Array.from({ length: cursorVariant === 'gaming' ? 6 : 3 }, (_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${cursorVariant === 'gaming' ? 'w-1.5 h-1.5' : 'w-1 h-1'}`}
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: cursorVariant === 'gaming' 
                ? `linear-gradient(45deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.6))`
                : 'rgba(255, 255, 255, 0.8)'
            }}
            animate={{
              x: [0, -25 - i * 12, -50 - i * 18],
              y: [0, Math.sin(i) * 15, Math.sin(i) * 25],
              opacity: [0.9, 0.5, 0],
              scale: [1, 0.7, 0.3],
              rotate: cursorVariant === 'gaming' ? [0, 180, 360] : 0
            }}
            transition={{
              duration: cursorVariant === 'gaming' ? 0.6 : 0.8,
              repeat: Infinity,
              delay: i * 0.08,
              ease: 'easeOut'
            }}
          />
        ))}
        
        {/* Gaming mode: Extra epic particles */}
        {cursorVariant === 'gaming' && Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={`gaming-${i}`}
            className="absolute w-0.5 h-4 bg-gradient-to-t from-purple-400 to-transparent"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'bottom'
            }}
            animate={{
              rotate: [i * 90, i * 90 + 360],
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>

      {/* Enhanced cursor trail effect */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full ${
          cursorVariant === 'gaming' ? 'w-24 h-24' : 'w-16 h-16'
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          marginLeft: cursorVariant === 'gaming' ? '-36px' : '-24px',
          marginTop: cursorVariant === 'gaming' ? '-36px' : '-24px'
        }}
        animate={isVisible ? 'visible' : 'hidden'}
        variants={{
          visible: { opacity: cursorVariant === 'gaming' ? 0.4 : 0.3 },
          hidden: { opacity: 0 }
        }}
      >
        <motion.div
          className="w-full h-full rounded-full"
          animate={{
            background: cursorVariant === 'gaming' ? [
              'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(34, 197, 94, 0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 100%)'
            ] : [
              'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
            ],
            scale: cursorVariant === 'gaming' ? [1, 1.4, 1.2, 1] : [1, 1.2, 1],
            rotate: cursorVariant === 'gaming' ? [0, 180, 360] : 0
          }}
          transition={{
            background: { duration: cursorVariant === 'gaming' ? 2 : 4, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: cursorVariant === 'gaming' ? 1.5 : 2, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 3, repeat: Infinity, ease: 'linear' }
          }}
        />
        
        {/* Gaming mode: Additional trail rings */}
        {cursorVariant === 'gaming' && (
          <>
            <motion.div
              className="absolute inset-4 rounded-full border border-purple-400/30"
              animate={{ rotate: -360, scale: [1, 1.1, 1] }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-blue-400/20"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }}
            />
          </>
        )}
      </motion.div>
    </>
  );
}