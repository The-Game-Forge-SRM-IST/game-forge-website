'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Github, Globe, ExternalLink } from 'lucide-react';
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
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!member || !mounted) return null;

  const getGuildColorClass = (dept: string) => {
    return dept === 'Development' || dept === 'AI For Game Dev' ? 'text-tertiary border-tertiary/30' : 'text-secondary border-secondary/30';
  };

  const modalContent = (
    <div className="fixed inset-0 z-[49] pt-20 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-3xl bg-surface-container border border-outline-variant p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-2xl overflow-y-auto max-h-[calc(100vh-100px)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 border border-outline-variant hover:border-secondary hover:text-secondary bg-surface-container-high transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Left: Profile Image */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="w-full h-64 md:h-80 border border-outline-variant p-1 bg-surface-container-high relative overflow-hidden">
            <img
              src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=1f2937&color=ffffff`}
              alt={member.name}
              className="w-full h-full object-cover select-none pointer-events-none"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=1f2937&color=ffffff`;
              }}
            />
            <div className="absolute bottom-2 right-2 bg-background/90 px-3 py-1 border border-outline-variant">
              <span className={`font-mono text-[10px] uppercase font-bold ${getGuildColorClass(member.department).split(' ')[0]}`}>
                {member.department}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Technical Details */}
        <div className="flex-1 flex flex-col justify-between font-mono">
          <div className="space-y-6">
            <div>
              <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-tight mb-2">
                {member.name}
              </h2>
              <p className="text-sm text-tertiary uppercase tracking-wider font-semibold">
                {member.role}
              </p>
            </div>

            <div className="border-t border-outline-variant/30 pt-4">
              <h3 className="text-xs text-white/40 uppercase mb-2">Smith Statement</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {member.bio}
              </p>
            </div>

            <div className="border-t border-outline-variant/30 pt-4">
              <h3 className="text-xs text-white/40 uppercase mb-2">Forged Techniques (Skills)</h3>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-surface-container-high border border-outline-variant text-[10px] text-on-surface-variant uppercase"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="border-t border-outline-variant/30 pt-6 mt-8 flex flex-wrap gap-4">
            {member.socialLinks.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 border border-outline-variant hover:border-tertiary hover:text-tertiary text-xs transition-colors bg-surface-container-high"
              >
                <Globe size={14} />
                <span>LINKEDIN</span>
              </a>
            )}
            {member.socialLinks.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 border border-outline-variant hover:border-tertiary hover:text-tertiary text-xs transition-colors bg-surface-container-high"
              >
                <Github size={14} />
                <span>GITHUB</span>
              </a>
            )}
            {member.socialLinks.portfolio && (
              <a
                href={member.socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 border border-outline-variant hover:border-tertiary hover:text-tertiary text-xs transition-colors bg-surface-container-high"
              >
                <ExternalLink size={14} />
                <span>PORTFOLIO</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}