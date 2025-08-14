'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, ExternalLink } from 'lucide-react';
import { TeamMember } from '@/types';

interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!member || !mounted) return null;

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Development':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'Design':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'Art':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'Management':
        return 'from-red-500/20 to-red-600/20 border-red-500/30';
      case 'AI For Game Dev':
        return 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Container - Fixed to viewport */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={onClose}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-br ${getDepartmentColor(member.department)} backdrop-blur-sm border rounded-2xl overflow-hidden shadow-2xl`}>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-white" />
                </button>

                {/* Content */}
                <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                  {/* Image Section */}
                  <div className="relative w-full lg:w-1/2 h-64 lg:h-auto">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={90}
                      onError={(e) => {
                        console.error(`Failed to load image for ${member.name}:`, member.image);
                        // Fallback to a placeholder or default image
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=1f2937&color=ffffff`;
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    
                    {/* Department Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-4 py-2 rounded-full text-sm font-medium shadow-lg bg-black text-white border border-white/20">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="space-y-6">
                      {/* Header */}
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                          {member.name}
                        </h2>
                        <p className="text-lg text-gray-300 font-medium">
                          {member.role}
                        </p>
                      </div>

                      {/* Bio */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                        <p className="text-gray-300 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-white/10 text-sm rounded-lg text-gray-300 border border-white/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      {(member.socialLinks.linkedin || member.socialLinks.github || member.socialLinks.portfolio) && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
                          <div className="flex space-x-4">
                            {member.socialLinks.linkedin && (
                              <a
                                href={member.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors border border-blue-500/30"
                              >
                                <Linkedin size={18} />
                                <span className="text-sm">LinkedIn</span>
                              </a>
                            )}
                            {member.socialLinks.github && (
                              <a
                                href={member.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 rounded-lg transition-colors border border-gray-500/30"
                              >
                                <Github size={18} />
                                <span className="text-sm">GitHub</span>
                              </a>
                            )}
                            {member.socialLinks.portfolio && (
                              <a
                                href={member.socialLinks.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors border border-green-500/30"
                              >
                                <ExternalLink size={18} />
                                <span className="text-sm">Portfolio</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}