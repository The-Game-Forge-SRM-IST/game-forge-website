'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
      setImageErrors(new Array(project.images.length).fill(false));
    }
  }, [project]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  const projectTeamMembers = teamMembers.filter((m) =>
    project.teamMembers.includes(m.id)
  );

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'FORGE LIVE';
      case 'in-progress':
        return 'TEMPERING STAGE';
      case 'planned':
        return 'HAZARD CLASS';
      default:
        return 'UNREGISTERED';
    }
  };

  const getStatusBadgeClass = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-tertiary-container text-on-tertiary-container border-tertiary-container/30';
      case 'in-progress':
        return 'bg-surface-container-highest text-on-surface border-outline-variant/30';
      case 'planned':
        return 'bg-error-container text-on-error-container border-error-container/30';
      default:
        return 'bg-surface-container-low text-on-surface-variant';
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[49] pt-20 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl bg-surface-container border border-outline-variant p-6 md:p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto max-h-[calc(90vh-80px)] font-mono text-xs">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 border border-outline-variant hover:border-secondary hover:text-secondary bg-surface-container-high transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Top: Status Badges and Title */}
        <header className="pr-12">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-0.5 font-mono text-[9px] font-bold border ${getStatusBadgeClass(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
            {project.awards && project.awards.length > 0 && (
              <span className="px-2 py-0.5 bg-secondary-container text-white border border-secondary text-[9px] font-bold">
                AWARD WINNER
              </span>
            )}
          </div>
          <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-tight">
            {project.title}
          </h2>
          <p className="text-on-surface-variant text-[11px] mt-1 leading-relaxed">
            {project.description}
          </p>
        </header>

        {/* Gallery Slider */}
        {project.images && project.images.length > 0 && (
          <div className="relative h-64 md:h-[400px] border border-outline-variant p-1 bg-surface-container-high overflow-hidden">
            {!imageErrors[currentImageIndex] ? (
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                onError={() => handleImageError(currentImageIndex)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-outline-variant">
                <span className="text-3xl">🎮</span>
                <span className="mt-2 text-[10px]">VISUAL_RECORD_UNAVAILABLE</span>
              </div>
            )}

            {project.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 border border-white/20 bg-black/60 hover:bg-black/80 hover:border-white/50 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 border border-white/20 bg-black/60 hover:bg-black/80 hover:border-white/50 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Index indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/50 px-3 py-1.5 border border-white/10">
                  {project.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-1.5 h-1.5 ${
                        idx === currentImageIndex ? 'bg-tertiary' : 'bg-outline-variant'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Dynamic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-outline-variant/30 pt-6">
          {/* Left Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white/40 uppercase mb-2">Detailed Blueprint (Description)</h3>
              <p className="text-on-surface-variant leading-relaxed text-xs">
                {project.longDescription}
              </p>
            </div>

            {project.awards && project.awards.length > 0 && (
              <div>
                <h3 className="text-white/40 uppercase mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-tertiary" /> Forging Distinctions (Awards)
                </h3>
                <div className="space-y-1.5">
                  {project.awards.map((award, i) => (
                    <div key={i} className="p-2 border border-secondary/20 bg-secondary-container/5 text-secondary-fixed text-[11px]">
                      🏆 {award}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Details */}
          <div className="space-y-6">
            {/* Tech stack */}
            <div>
              <h3 className="text-white/40 uppercase mb-2">Smelted Technologies</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-surface-container-high border border-outline-variant text-[10px] text-on-surface-variant"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Team members */}
            {projectTeamMembers.length > 0 && (
              <div>
                <h3 className="text-white/40 uppercase mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Contributing Smiths
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {projectTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-2.5 bg-surface-container-high border border-outline-variant/50 flex flex-col justify-center"
                    >
                      <span className="text-white font-sans font-bold text-xs uppercase line-clamp-1">{member.name}</span>
                      <span className="text-on-surface-variant text-[9px] uppercase tracking-wider mt-0.5 line-clamp-1">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action play links */}
        <div className="flex flex-wrap gap-4 border-t border-outline-variant/30 pt-6">
          {project.itchUrl && (
            <a
              href={project.itchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-secondary-container text-white border border-secondary transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 font-bold uppercase text-center"
            >
              <ExternalLink className="w-4 h-4" /> PLAY_ON_ITCH
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-surface-container-high border border-outline-variant hover:border-tertiary hover:text-tertiary transition-colors flex items-center justify-center gap-2 font-bold uppercase text-center"
            >
              <Github className="w-4 h-4" /> INSPECT_REPOSITORIES
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}