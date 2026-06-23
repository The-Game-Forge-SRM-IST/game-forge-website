'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { Settings, Award } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  index: number;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

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

  return (
    <div
      onClick={() => onViewDetails(project)}
      className="group bg-surface-container-low border border-outline-variant/35 overflow-hidden hover:border-secondary-container/50 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Visual Header */}
      <div className="relative h-48 overflow-hidden bg-surface-container-lowest">
        {!imageError && project.images.length > 0 ? (
          <img
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
            src={project.images[0]}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-outline-variant">
            <Settings className="w-10 h-10 mb-2 opacity-50" />
            <span className="font-mono text-[10px]">NO_VISUAL_RECORD</span>
          </div>
        )}
        
        {/* Status Tag */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 font-mono text-[9px] uppercase font-bold tracking-widest border ${getStatusBadgeClass(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
        </div>

        {/* Award Badge */}
        {project.awards && project.awards.length > 0 && (
          <div className="absolute top-4 right-4 bg-secondary-container border border-secondary text-white p-1" title="Award Winner">
            <Award className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-6 flex flex-col flex-grow font-mono">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-sans text-lg font-bold text-white group-hover:text-tertiary transition-colors uppercase leading-tight line-clamp-1">
            {project.title}
          </h3>
        </div>
        
        <p className="text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="bg-surface-container-highest px-2 py-0.5 text-[9px] text-on-surface uppercase border border-outline-variant/30"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="bg-surface-container-highest px-2 py-0.5 text-[9px] text-on-surface border border-outline-variant/30">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div>
          <button className="w-full py-3 bg-secondary-container text-white font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 group-hover:brightness-110 active:scale-[0.98]">
            INITIATE_INSPECT
          </button>
        </div>
      </div>
    </div>
  );
}