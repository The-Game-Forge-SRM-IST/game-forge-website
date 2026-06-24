'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APPLICATION_CONFIG } from '@/config/application';

interface NavigationProps {
  activeSection: string;
}

const navigationItems = [
  { href: '/projects', id: 'projects', label: 'Projects' },
  { href: '/smiths', id: 'smiths', label: 'Smiths' },
  { href: '/events', id: 'events', label: 'Events' },
  { href: '/contact', id: 'contact', label: 'Contact' },
];

export default function Navigation({ activeSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState<boolean | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Fetch live application status from dynamic route with cache-busting
    fetch(`/api/application-status?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.isOpen === 'boolean') {
          setIsAppOpen(data.isOpen);
        }
      })
      .catch((err) => console.error('Failed to load live application status:', err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav
      id="navigation"
      className={`fixed top-0 left-0 right-0 h-20 z-[100] flex items-center justify-between px-margin-mobile md:px-margin-desktop transition-all duration-300 border-b border-white/5 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      style={{ transform: 'translate3d(0, 0, 0)' }}
      role="navigation"
      aria-label="Forge navigation"
    >
      {/* Brand Logo & Name */}
      <Link
        href="/"
        className="flex items-center gap-4 cursor-pointer select-none"
        onClick={() => setIsOpen(false)}
      >
        <img
          alt="The Game Forge Anvil Logo"
          className="w-10 h-10 object-contain pixelated"
          src="/images/ClubLogo.png"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="font-sans text-xl md:text-2xl font-bold tracking-tighter text-on-surface uppercase select-none">
          THE GAME FORGE
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 font-mono text-xs uppercase tracking-wider">
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`inline-flex items-center transition-colors duration-200 pb-1 border-b-2 ${
              activeSection === item.id
                ? 'text-tertiary border-tertiary font-bold'
                : 'text-on-surface-variant hover:text-tertiary border-transparent'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right Action Button & Mobile Toggle */}
      <div className="flex items-center gap-4">
        {/* CTA always visible, linking to dynamic recruitment status page */}
        <Link
          href="/recruitment"
          onClick={() => setIsOpen(false)}
          className="hidden md:inline-flex items-center justify-center bg-secondary text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-2 border border-secondary transition-all hover:brightness-110 active:scale-95"
        >
          Join the Forge
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center p-2 text-on-surface-variant hover:text-on-surface"
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute top-20 left-0 right-0 bg-background border-b border-outline-variant/30 flex flex-col p-6 gap-4 md:hidden z-40"
          >
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`w-full text-center font-mono text-sm py-2 px-4 border ${
                  activeSection === item.id
                    ? 'text-tertiary border-tertiary bg-tertiary/5 font-bold'
                    : 'text-on-surface-variant border-outline-variant/35 hover:border-tertiary/50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile CTA Button inside drawer - always show */}
            <Link
              href="/recruitment"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-secondary text-white font-mono text-sm font-bold uppercase tracking-wider py-3 border border-secondary transition-all hover:brightness-110 active:scale-95 mt-2"
            >
              Join the Forge
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}