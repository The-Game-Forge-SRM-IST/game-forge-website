'use client';

import { useState, memo, lazy, Suspense } from 'react';
import { TeamMember } from '@/types';
import { Globe, Shield, Terminal, Settings } from 'lucide-react';

const TeamMemberModal = lazy(() => import('./TeamMemberModal'));

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate a mock unique reference ID based on name and role
  const refCode = `REF: ${String(index + 1).padStart(3, '0')}_${member.name.split(' ')[0].toUpperCase()}`;

  // Map departments to cool guild classifications
  const getGuildBadge = (dept: string) => {
    switch (dept) {
      case 'Development':
        return 'Engineering';
      case 'Design':
        return 'Crafting';
      case 'Art':
        return 'Harmonics';
      case 'Management':
        return 'Operations';
      case 'AI For Game Dev':
        return 'Cognitive';
      default:
        return 'Artisans';
    }
  };

  const getBorderGlowClass = (dept: string) => {
    return dept === 'Development' || dept === 'AI For Game Dev' ? 'glow-forest' : 'glow-forge';
  };

  return (
    <>
      <div
        className={`group bg-surface-container-low border border-outline-variant p-4 transition-all duration-300 ${getBorderGlowClass(
          member.department
        )} industrial-edge flex flex-col h-full`}
      >
        {/* Grayscale Image Container with Industrial Edge */}
        <div className="w-full h-48 border border-outline-variant p-1 relative overflow-hidden bg-surface-container-high mb-4">
          <img
            alt={`Portrait of ${member.name}`}
            className="w-full h-full object-cover transition-all select-none pointer-events-none"
            src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=300&background=1f2937&color=ffffff`}
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=300&background=1f2937&color=ffffff`;
            }}
          />
          <div
            className={`absolute inset-0 border-t-2 ${
              member.department === 'Development' || member.department === 'AI For Game Dev'
                ? 'border-tertiary/30'
                : 'border-secondary/30'
            }`}
          />
          <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-1 border border-outline-variant">
            <div
              className={`font-mono text-[9px] uppercase tracking-widest font-bold ${
                member.department === 'Development' || member.department === 'AI For Game Dev'
                  ? 'text-tertiary'
                  : 'text-secondary'
              }`}
            >
              {getGuildBadge(member.department)}
            </div>
          </div>
        </div>

        {/* Identity Details */}
        <div className="mb-4">
          <div className="text-outline font-mono text-[9px] mb-1">{refCode}</div>
          <h3 className="font-sans text-lg text-white uppercase font-bold tracking-tight line-clamp-1">
            {member.name}
          </h3>
          <p className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mt-1 line-clamp-1">
            {member.role}
          </p>
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
          {member.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-surface-container-high border border-outline-variant text-on-surface-variant font-mono text-[9px] uppercase"
            >
              {skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant text-on-surface-variant font-mono text-[9px]">
              +{member.skills.length - 3}
            </span>
          )}
        </div>

        {/* Interactive Bar */}
        <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
          <div className="flex gap-4">
            {member.socialLinks.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-outline hover:text-tertiary transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {member.socialLinks.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-outline hover:text-tertiary transition-colors"
                aria-label="GitHub Profile"
              >
                <Terminal className="w-4 h-4" />
              </a>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`font-mono text-[10px] hover:underline tracking-tighter uppercase font-bold ${
              member.department === 'Development' || member.department === 'AI For Game Dev'
                ? 'text-tertiary'
                : 'text-secondary'
            }`}
          >
            INSPECT_WORK
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Suspense fallback={<div className="font-mono text-xs text-outline p-4">Loading details...</div>}>
          <TeamMemberModal
            member={member}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}

export default memo(TeamMemberCard);