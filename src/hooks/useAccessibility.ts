'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface AccessibilityPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersReducedTransparency: boolean;
  colorScheme: 'light' | 'dark' | 'no-preference';
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
}

interface FocusManagement {
  trapFocus: (container: HTMLElement) => () => void;
  restoreFocus: (element?: HTMLElement) => void;
  announceLiveRegion: (message: string, priority?: 'polite' | 'assertive') => void;
  skipToContent: () => void;
}

export function useAccessibility() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersReducedTransparency: false,
    colorScheme: 'no-preference',
    fontSize: 'medium',
  });

  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [currentFocus] = useState<HTMLElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  // Detect user preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersReducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 
                    window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'no-preference',
        fontSize: 'medium', // Could be enhanced to detect system font size preferences
      });
    };

    updatePreferences();

    // Listen for changes in user preferences
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-reduced-transparency: reduce)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-color-scheme: light)'),
    ];

    mediaQueries.forEach(mq => mq.addEventListener('change', updatePreferences));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updatePreferences));
    };
  }, []);

  // Detect keyboard usage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-user');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.classList.remove('keyboard-user');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Create live region for announcements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    liveRegionRef.current = liveRegion;

    return () => {
      if (liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    };
  }, []);

  // Focus management utilities: keep stable identity by memoizing the object
  const restoreFocus = useCallback((element?: HTMLElement) => {
    const elementToFocus = element || lastFocusedElement.current;
    if (elementToFocus && typeof elementToFocus.focus === 'function') {
      elementToFocus.focus();
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        restoreFocus();
      }
    };

    // Store the currently focused element
    lastFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the first element
    firstElement?.focus();

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [restoreFocus]);

  const announceLiveRegion = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Clear the message after a short delay to allow for re-announcements
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const skipToContent = useCallback(() => {
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const focusManagement: FocusManagement = useMemo(() => ({
    trapFocus,
    restoreFocus,
    announceLiveRegion,
    skipToContent
  }), [trapFocus, restoreFocus, announceLiveRegion, skipToContent]);

  // Keyboard navigation helpers
  const handleArrowNavigation = useCallback((
    e: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void,
    orientation: 'horizontal' | 'vertical' | 'both' = 'both'
  ) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
      items[newIndex]?.focus();
    }
  }, []);

  // Color contrast utilities
  const getContrastRatio = useCallback((color1: string, color2: string): number => {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd want a more robust color parsing library
    const getLuminance = (color: string): number => {
      // This is a simplified version - you'd want proper color parsing
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;
      
      const [r, g, b] = rgb.map(x => {
        const val = parseInt(x) / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }, []);

  const meetsWCAGContrast = useCallback((color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  }, [getContrastRatio]);

  // Screen reader utilities
  const announcePageChange = useCallback((pageName: string) => {
    announceLiveRegion(`Navigated to ${pageName}`, 'assertive');
  }, [announceLiveRegion]);

  const announceLoadingState = useCallback((isLoading: boolean, context?: string) => {
    const message = isLoading 
      ? `Loading${context ? ` ${context}` : ''}...` 
      : `${context || 'Content'} loaded`;
    announceLiveRegion(message, 'polite');
  }, [announceLiveRegion]);

  // Generate accessible IDs
  const generateId = useCallback((prefix: string = 'accessible'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  return {
    preferences,
    isKeyboardUser,
    currentFocus,
    focusManagement,
    handleArrowNavigation,
    getContrastRatio,
    meetsWCAGContrast,
    announcePageChange,
    announceLoadingState,
    generateId,
    // Convenience getters
    shouldReduceMotion: preferences.prefersReducedMotion,
    shouldUseHighContrast: preferences.prefersHighContrast,
    shouldReduceTransparency: preferences.prefersReducedTransparency,
    isDarkMode: preferences.colorScheme === 'dark',
  };
}

export default useAccessibility;