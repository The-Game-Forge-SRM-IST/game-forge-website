'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Linkedin, Instagram, ExternalLink } from 'lucide-react';
import { AnimatedButton } from '@/components/ui';


export default function HeroSection() {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const texts = useMemo(() => [
    'Where creativity meets code',
    'Innovation shapes the future of gaming',
    'Building tomorrow\'s games today',
    'Crafting digital experiences'
  ], []);

  // Simple scroll detection - just fade the hero logo
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const newIsScrolled = scrollY > 100;
          setIsScrolled(newIsScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const currentText = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, texts]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative safe-area-inset-top">
      {/* Subtle background overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      <div className="container-responsive text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Club Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isScrolled ? 0.4 : 1,
              scale: isScrolled ? 0.9 : 1,
            }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 mx-auto mb-4 sm:mb-6 relative">
              {/* The Game Forge Club Logo */}
              <img 
                src="/images/ClubLogo.png" 
                alt="The Game Forge Club Logo"
                className="w-full h-full object-contain rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              {/* Simple glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-red-400/20 rounded-lg blur-xl opacity-60" />
            </div>
          </motion.div>



          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-responsive-3xl font-bold mb-4 sm:mb-6 leading-tight text-center px-4"
          >
            The Game <span className="text-green-400">Forge</span>
          </motion.h1>

          {/* Club Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-0"
          >
            <p className="text-responsive-xl text-gray-300 max-w-4xl mx-auto leading-relaxed text-center">
              A game development club at <span className="text-blue-400 font-semibold">SRM IST KTR</span>
            </p>
            
            {/* Typewriter Animation */}
            <div className="h-12 sm:h-14 md:h-16 lg:h-20 flex items-center justify-center">
              <p className="text-responsive-lg text-gray-400 max-w-3xl mx-auto text-center leading-relaxed">
                {displayText}
                <span className="animate-pulse text-green-400">|</span>
              </p>
            </div>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10 px-4 sm:px-6 lg:px-0 max-w-lg mx-auto"
          >
            <AnimatedButton
              variant="primary"
              size="lg"
              glowEffect
              particleEffect
              onClick={() => scrollToSection('apply')}
              className="flex-1 sm:flex-none"
            >
              Join Our Community
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="flex-1 sm:flex-none"
            >
              <span>View Projects</span>
              <ExternalLink className="w-5 h-5" />
            </AnimatedButton>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex justify-center space-x-6 sm:space-x-8"
          >
            <motion.a
              href="https://www.linkedin.com/company/105910279/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 sm:p-5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-blue-600/20 transition-all duration-300 group touch-manipulation min-h-[56px] min-w-[56px] flex items-center justify-center"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400 group-hover:text-blue-300" />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/the_game_forge/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 sm:p-5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-pink-600/20 transition-all duration-300 group touch-manipulation min-h-[56px] min-w-[56px] flex items-center justify-center"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400 group-hover:text-pink-300" />
            </motion.a>
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
}