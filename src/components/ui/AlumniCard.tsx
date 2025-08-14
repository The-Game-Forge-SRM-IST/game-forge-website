'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Linkedin, Github, Globe } from 'lucide-react';
import { AlumniMember } from '@/types';

interface AlumniCardProps {
  alumni: AlumniMember;
  index: number;
}

export function AlumniCard({ alumni, index }: AlumniCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  const hoverVariants = {
    rest: { 
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      rotateY: 5,
      transition: { duration: 0.3 }
    }
  };

  const overlayVariants = {
    rest: { 
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 }
    },
    hover: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.05 }
    }
  };

  const contributionVariants = {
    rest: { opacity: 0, x: -10 },
    hover: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="group relative"
    >
      <motion.div
        variants={hoverVariants}
        initial="rest"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden h-full"
        style={{ perspective: '1000px' }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={alumni.image}
            alt={alumni.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          
          {/* Graduation Year Badge */}
          <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            Class of {alumni.graduationYear}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Name and Position */}
          <div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">
              {alumni.name}
            </h3>
            <p className="text-blue-400 font-medium">{alumni.currentPosition}</p>
            <p className="text-gray-400 text-sm">{alumni.currentCompany}</p>
          </div>

          {/* Bio */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {alumni.bio}
          </p>

          {/* Social Links */}
          <div className="flex space-x-3">
            {alumni.socialLinks.linkedin && (
              <motion.a
                href={alumni.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={18} />
              </motion.a>
            )}
            {alumni.socialLinks.github && (
              <motion.a
                href={alumni.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={18} />
              </motion.a>
            )}
            {alumni.socialLinks.portfolio && (
              <motion.a
                href={alumni.socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Globe size={18} />
              </motion.a>
            )}
          </div>
        </div>

        {/* Hover Overlay - Contributions */}
        <motion.div
          variants={overlayVariants}
          initial="rest"
          animate={isHovered ? "hover" : "rest"}
          className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm p-6 flex flex-col justify-center"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-400">
              <ExternalLink size={20} />
              <h4 className="font-bold text-lg">Club Contributions</h4>
            </div>
            
            <div className="space-y-2">
              {alumni.contributions.map((contribution, idx) => (
                <motion.div
                  key={idx}
                  variants={contributionVariants}
                  className="flex items-start space-x-2"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {contribution}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Hover to see more • Click social links to connect
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}