'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TeamMember } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';
import { RippleEffect, MagneticHover } from './MicroAnimations';
import TeamMemberModal from './TeamMemberModal';

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export default function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobile } = useResponsive();

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
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      y: -5,
      transition: { duration: 0.3 }
    }
  };

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
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="group perspective-1000">
        <MagneticHover strength={4}>
          <RippleEffect
            color="rgba(34, 197, 94, 0.2)"
            className={`relative bg-gradient-to-br ${getDepartmentColor(member.department)} 
                       backdrop-blur-sm border rounded-xl overflow-hidden
                       transform-gpu transition-all duration-300 cursor-pointer
                       hover:shadow-2xl hover:shadow-black/50 h-[424px] flex flex-col`}
            onClick={handleCardClick}
          >
            <div>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
              </div>

              {/* Image Container - Fixed height for consistency */}
              <div className="relative h-64 overflow-hidden bg-gray-800/50">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 475px) 100vw, (max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  priority={index < 4}
                  quality={85}
                  onError={(e) => {
                    console.error(`Failed to load image for ${member.name}:`, member.image);
                    // Fallback to a placeholder or default image
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=1f2937&color=ffffff`;
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Department Badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                  <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg bg-black text-white border border-white/20">
                    <span className="hidden sm:inline">{member.department}</span>
                    <span className="sm:hidden">{member.department.substring(0, 3)}</span>
                  </span>
                </div>

                {/* Click to View Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                      <p className="text-white text-sm font-medium">Click to view details</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content - Fixed height for consistency */}
              <div className="p-4 sm:p-5 lg:p-6 h-40 flex flex-col justify-between">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base font-medium mb-3 line-clamp-2">
                    {member.role}
                  </p>
                </div>
                
                {/* Skills Preview - Fixed at bottom */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
                  {member.skills.slice(0, isMobile ? 2 : 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2.5 py-1 bg-white/5 text-xs sm:text-sm rounded-md text-gray-400 border border-white/10 truncate max-w-24 sm:max-w-none"
                      title={skill}
                    >
                      {skill.length > 8 ? skill.substring(0, 8) + '...' : skill}
                    </span>
                  ))}
                  {member.skills.length > (isMobile ? 2 : 3) && (
                    <span className="px-2.5 py-1 bg-white/5 text-xs sm:text-sm rounded-md text-gray-400 border border-white/10 font-medium">
                      +{member.skills.length - (isMobile ? 2 : 3)}
                    </span>
                  )}
                </div>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </RippleEffect>
        </MagneticHover>
      </div>

      {/* Modal */}
      <TeamMemberModal
        member={member}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}