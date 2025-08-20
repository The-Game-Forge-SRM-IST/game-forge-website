'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';


interface NavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const navigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'team', label: 'Team' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'events', label: 'Events' },
  { id: 'announcements', label: 'Announcements' },
  // { id: 'alumni', label: 'Alumni' }, // Commented out for now - will be used in the future
  { id: 'apply', label: 'Apply to Club' },
  { id: 'contact', label: 'Contact Us' },
];

export default function Navigation({ activeSection, onSectionClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Debug logging
  useEffect(() => {
    console.log('🎯 Navigation component - activeSection is now:', activeSection);
  }, [activeSection]);

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simple scroll handling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const newIsScrolled = window.scrollY > 100;
          setIsScrolled(newIsScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSectionClick = (sectionId: string) => {
    // Immediate UI feedback - close mobile menu first
    setIsOpen(false);
    
    // Use RAF for smooth state update
    requestAnimationFrame(() => {
      onSectionClick(sectionId);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      handleSectionClick(sectionId);
    }
  };

  const toggleMobileMenu = () => {
    setIsOpen(prev => !prev);
  };

  // Render immediately for better performance
  if (!isMounted) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 navigation-fixed safe-area-inset-top ${
        isScrolled
          ? 'navigation-dark shadow-lg'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4 lg:gap-8">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 rounded-md p-2 mr-4 lg:mr-8"
            onClick={() => handleSectionClick('home')}
            onKeyDown={(e) => handleKeyDown(e, 'home')}
            tabIndex={0}
            role="button"
            aria-label="Go to home section"
          >
            <AnimatePresence mode="wait">
              {isScrolled ? (
                <motion.div
                  key="scrolled-logo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <Logo size="sm" showText={true} />
                </motion.div>
              ) : (
                <motion.div
                  key="text-only-logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-xl lg:text-2xl font-bold text-white">
                    The Game <span className="text-green-400">Forge</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-baseline space-x-1 xl:space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionClick(item.id);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={`px-2 xl:px-3 py-2 rounded-md text-sm xl:text-base font-medium transition-colors duration-300 relative whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black ${
                    activeSection === item.id
                      ? 'text-green-400 bg-green-400/10 shadow-lg shadow-green-400/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label} section`}
                  tabIndex={0}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-400 text-gray-400 hover:text-white hover:bg-gray-700/50"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
              aria-controls="mobile-menu"
              id="mobile-menu-button"
            >
              <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mobileMenuRef}
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden navigation-mobile z-50 mobile-menu-dark"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="mobile-menu-button"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionClick(item.id);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 touch-manipulation relative min-h-[44px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black ${
                    activeSection === item.id
                      ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                  role="menuitem"
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label} section`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-green-400 rounded-r-full" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}