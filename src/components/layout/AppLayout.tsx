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
          // Small delay before re-enabling section detection to prevent conflicts
          setTimeout(() => setIsNavigating(false), 200);
        }
      };

      requestAnimationFrame(animateScroll);
    } else {
      setIsNavigating(false);
    }
  }, []);

  // Ultra-optimized scroll handler with RAF throttling
  const throttledScrollHandler = useMemo(() => 
    createRAFThrottle(() => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollY / maxScroll);
    }), []
  );

  // High-performance section detection with intersection observer
  useEffect(() => {
    // Initialize GPU optimizations
    optimizeTransforms();
    
    // Set up scroll progress tracking
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Set up section detection for navigation highlighting
    const sections = ['home', 'team', 'projects', 'achievements', 'gallery', 'events', 'announcements', 'apply', 'contact'];
    const sectionElements = sections.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    
    if (sectionElements.length === 0) {
      // If sections aren't ready yet, try again after a short delay
      const retryTimeout = setTimeout(() => {
        const retryElements = sections.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
        if (retryElements.length > 0) {
          setupSectionObserver(retryElements, sections);
        }
      }, 1000);
      
      return () => {
        clearTimeout(retryTimeout);
        window.removeEventListener('scroll', throttledScrollHandler);
      };
    }
    
    const observer = setupSectionObserver(sectionElements, sections);
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      observer?.disconnect();
    };
  }, [throttledScrollHandler]);

  // Setup intersection observer for section detection
  const setupSectionObserver = (sectionElements: HTMLElement[], sections: string[]) => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Skip updates during manual navigation to prevent conflicts
        if (isNavigating) return;
        
        // Find the section that's most visible
        let maxVisibility = 0;
        let mostVisibleSection = 'home';
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
            maxVisibility = entry.intersectionRatio;
            const sectionId = entry.target.id;
            if (sections.includes(sectionId)) {
              mostVisibleSection = sectionId;
            }
          }
        });
        
        // Only update if we found a visible section and it's different from current
        if (maxVisibility > 0.1 && mostVisibleSection !== activeSection) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7], // Multiple thresholds for better detection
        rootMargin: '-80px 0px -50% 0px' // Account for header and focus on upper part of viewport
      }
    );
    
    sectionElements.forEach(element => observer.observe(element));
    return observer;
  };

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