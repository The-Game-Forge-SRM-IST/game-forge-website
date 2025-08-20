'use client';

import { useState } from 'react';
import Image from 'next/image';
// motion intentionally unused in this file
import { ExternalLink, Github, Play, Users, Wrench } from 'lucide-react';
import { Project } from '@/types';
import { RippleEffect, MagneticHover, BouncingIcon } from './MicroAnimations';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  index: number;
}

export function ProjectCard({ project, onViewDetails, index }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

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

  return (
    <MagneticHover strength={3}>
      <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300">
      {/* Project Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {!imageError && project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={80}
            priority={index < 6}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Wrench className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Project Image</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
            <span className="hidden sm:inline">{getStatusText(project.status)}</span>
            <span className="sm:hidden">{getStatusText(project.status).substring(0, 4)}</span>
          </span>
        </div>

        {/* Awards Badge */}
        {project.awards && project.awards.length > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <span className="hidden sm:inline">🏆 Award Winner</span>
              <span className="sm:hidden">🏆</span>
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <RippleEffect
            color="rgba(34, 197, 94, 0.3)"
            onClick={() => onViewDetails(project)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <BouncingIcon>
              <Play className="w-4 h-4" />
            </BouncingIcon>
            View Details
          </RippleEffect>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-200 line-clamp-2">
            {project.title}
          </h3>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-gray-800/50 text-gray-300 rounded-md border border-gray-700/50 truncate max-w-20 sm:max-w-none"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-800/50 text-gray-400 rounded-md border border-gray-700/50">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Team Members Count */}
        <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
          <Users className="w-4 h-4" />
          <span className="truncate">{project.teamMembers.length} member{project.teamMembers.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {project.itchUrl && (
            <a
              href={project.itchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 touch-manipulation"
            >
              <ExternalLink className="w-4 h-4" />
              itch.io
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 border border-gray-600/50 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 touch-manipulation"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
        </div>
      </div>
      </div>
    </MagneticHover>
  );
}