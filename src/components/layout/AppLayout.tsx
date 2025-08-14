'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import EpicGamerBackground from '../three/EpicGamerBackground';
import CustomCursor from '../ui/CustomCursor';
import { createRAFThrottle, optimizeTransforms } from '@/utils/performanceOptimizer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // High-performance smooth scroll with RAF
  const scrollToSection = useCallback((sectionId: string) => {
    // Immediate state update for instant UI feedback
    setActiveSection(sectionId);
    setIsNavigating(true);

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const targetPosition = absoluteTop - headerOffset;
      const finalPosition = Math.max(0, targetPosition);

      // Custom smooth scroll with RAF for better performance
      const startPosition = window.scrollY;
      const distance = finalPosition - startPosition;
      const duration = 600; // 600ms for smooth but fast scroll
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easedProgress = easeInOutCubic(progress);
        const currentPosition = startPosition + (distance * easedProgress);
        
        window.scrollTo(0, currentPosition);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          // Brief delay before re-enabling section detection
          setTimeout(() => setIsNavigating(false), 100);
        }
      };

      requestAnimationFrame(animateScroll);
    } else {
      setIsNavigating(false);
    }
  }, []);

  // Simple, elegant scroll-based section detection
  const updateActiveSection = useCallback(() => {
    if (isNavigating) return;

    const sections = ['home', 'team', 'projects', 'achievements', 'gallery', 'events', 'announcements', 'apply', 'contact'];
    const scrollY = window.scrollY;
    const headerOffset = 100;

    // Handle top of page
    if (scrollY < 200) {
      if (activeSection !== 'home') {
        setActiveSection('home');
      }
      return;
    }

    // Find the section that's currently most visible
    let currentSection = 'home';
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        
        // Check if we've scrolled past this section's start point
        if (scrollY >= elementTop - headerOffset) {
          currentSection = sectionId;
        }
      }
    }

    if (currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  }, [activeSection, isNavigating]);

  // Ultra-optimized scroll handler with RAF throttling
  const throttledScrollHandler = useMemo(() => 
    createRAFThrottle(() => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollY / maxScroll);
      
      // Update active section based on scroll position
      updateActiveSection();
    }), [updateActiveSection]
  );

  // Simple scroll-based section detection
  useEffect(() => {
    // Initialize GPU optimizations
    optimizeTransforms();
    
    // Set up scroll progress tracking and section detection
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Initial section detection
    updateActiveSection();
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [throttledScrollHandler, updateActiveSection]);



  return (
    <div className="min-h-screen text-white relative">
      {/* Custom Gaming Cursor */}
      <CustomCursor />
      
      {/* Three.js Background */}
      <div className="three-background">
        <EpicGamerBackground 
          scrollProgress={scrollProgress}
          activeSection={activeSection}
        />
      </div>

      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        onSectionClick={(sectionId) => {
          console.log(`🔥 AppLayout: Received navigation click for ${sectionId}`);
          scrollToSection(sectionId);
        }}
      />

      {/* Main Content */}
      <main className="pt-16 relative z-10"> {/* Account for fixed header and ensure content is above background */}
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}