'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

export default function Logo({ size = 'md', showText = true, className = '', onClick }: LogoProps) {
  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <motion.div
        className={`${sizeClasses[size]} relative flex-shrink-0`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <img 
          src="/images/ClubLogo.png" 
          alt="The Game Forge Club Logo"
          className="w-full h-full object-contain rounded-lg shadow-lg"
        />
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-red-400/10 rounded-lg blur-sm" />
      </motion.div>
      
      {showText && (
        <span className="text-xl font-bold text-white">
          The Game <span className="text-green-400">Forge</span>
        </span>
      )}
    </div>
  );
}