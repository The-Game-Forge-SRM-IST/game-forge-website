'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project, TeamMember } from '@/types';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
}

export function ProjectModal({ project, isOpen, onClose, teamMembers }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<boolean[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
      setImageError(new Array(project.images.length).fill(false));
    }
  }, [project]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!project || !mounted) return null;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'planned':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      default:
        return 'Unknown';
    }
  };

  const projectTeamMembers = teamMembers.filter(member => 
    project.teamMembers.includes(member.id)
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleImageError = (index: number) => {
    setImageError(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
              {/* Image Gallery */}
              {project.images.length > 0 && (
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-80">
                  {!imageError[currentImageIndex] ? (
                    <Image
                      src={project.images[currentImageIndex]}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(currentImageIndex)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🎮</span>
                        </div>
                        <p className="text-sm">Project Image</p>
                      </div>
                    </div>
                  )}

                  {/* Image Navigation */}
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Status and Awards Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                    {project.awards && project.awards.length > 0 && (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        🏆 Award Winner
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{project.title}</h2>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">{project.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {project.itchUrl && (
                    <a
                      href={project.itchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Play on itch.io
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  )}
                </div>

                {/* Long Description */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">About This Project</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{project.longDescription}</p>
                </div>

                {/* Technologies */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 sm:px-3 py-1 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700/50 text-xs sm:text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                {projectTeamMembers.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      Team Members
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                      {projectTeamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                            {member.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium text-sm sm:text-base truncate">{member.name}</p>
                            <p className="text-gray-400 text-xs sm:text-sm truncate">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards */}
                {project.awards && project.awards.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Awards & Recognition
                    </h3>
                    <div className="space-y-2">
                      {project.awards.map((award, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                        >
                          <div className="text-yellow-400 text-xl">🏆</div>
                          <p className="text-yellow-200">{award}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}