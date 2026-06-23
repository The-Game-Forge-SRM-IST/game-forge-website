'use client';

import { useState, useMemo, memo } from 'react';
import Link from 'next/link';
import { Search, Anvil, RefreshCw } from 'lucide-react';
import { Project, TeamMember } from '@/types';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ProjectModal } from '@/components/ui/ProjectModal';

interface ProjectsSectionProps {
  projects: Project[];
  teamMembers: TeamMember[];
}

type FilterType = 'all' | 'completed' | 'in-progress' | 'planned';

const ProjectsSection = memo(function ProjectsSection({ projects, teamMembers }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(5); // Bento count initial

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Status Filter
      const matchesFilter = filter === 'all' || project.status === filter;

      // 2. Search Query
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.technologies.some((t) => t.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, searchQuery]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, itemsToShow);
  }, [filteredProjects, itemsToShow]);

  const hasMore = filteredProjects.length > itemsToShow;

  const loadMore = () => {
    setItemsToShow((prev) => prev + 6);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const filterOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'planned', label: 'Planned' },
  ] as const;

  return (
    <section id="projects" className="py-24 border-b border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Header Section */}
        <div className="mb-12 border-l-4 border-secondary-container pl-6">
          <h2 className="font-sans text-4xl md:text-5xl text-on-surface mb-4 uppercase tracking-tighter font-extrabold">
            Crafted Projects
          </h2>
          <p className="font-mono text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Forging the next generation of interactive experiences. Explore the masterworks and experimental prototypes hammered out in The Game Forge.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12 bg-surface-container p-6 border border-outline-variant/20">
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilter(opt.value);
                  setItemsToShow(5); // Reset vis count
                }}
                className={`px-4 py-1.5 font-mono text-[10px] uppercase border transition-colors ${
                  filter === opt.value
                    ? 'border-tertiary text-tertiary bg-tertiary/10 font-bold'
                    : 'border-outline-variant text-on-surface-variant hover:border-tertiary/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant px-10 py-2 font-mono text-[10px] focus:border-tertiary outline-none text-on-surface placeholder:text-outline-variant uppercase"
              placeholder="SEARCH FORGE..."
            />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {displayedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleViewDetails}
              index={index}
            />
          ))}

          {/* Submit Masterwork Card slot */}
          <Link
            href="/recruitment"
            className="group bg-transparent border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-12 hover:border-tertiary/50 transition-all cursor-pointer bg-surface-container-lowest/50 min-h-[300px]"
          >
            <Anvil className="w-12 h-12 text-outline group-hover:text-tertiary group-hover:scale-110 transition-all" />
            <span className="font-mono text-sm text-on-surface mt-4 uppercase group-hover:text-tertiary transition-colors font-bold block text-center">
              Submit Masterwork
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant mt-2 text-center leading-normal max-w-[200px] block">
              Join the forge movement. Show the world what you're crafting.
            </span>
          </Link>
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={loadMore}
              className="flex items-center gap-4 px-8 py-4 bg-surface-container-low border border-outline-variant font-mono text-xs uppercase text-on-surface hover:bg-tertiary hover:text-on-tertiary hover:border-tertiary transition-all group"
            >
              ACTIVATE_NEXT_SECTOR <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 font-mono text-xs text-outline-variant border border-dashed border-outline-variant/30">
            NO_PROJECTS_FOUND_IN_FOUNDRY
          </div>
        )}

        {/* Statistics Panels */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="text-center p-6 bg-surface-container-low border border-outline-variant/30">
            <div className="text-2xl font-bold text-tertiary mb-1">
              {projects.length}
            </div>
            <div className="text-on-surface-variant text-[10px] uppercase tracking-wider">Total Projects</div>
          </div>
          <div className="text-center p-6 bg-surface-container-low border border-outline-variant/30">
            <div className="text-2xl font-bold text-secondary mb-1">
              {projects.filter((p) => p.status === 'completed').length}
            </div>
            <div className="text-on-surface-variant text-[10px] uppercase tracking-wider">Forge Live</div>
          </div>
          <div className="text-center p-6 bg-surface-container-low border border-outline-variant/30">
            <div className="text-2xl font-bold text-tertiary mb-1">
              {projects.filter((p) => p.status === 'in-progress').length}
            </div>
            <div className="text-on-surface-variant text-[10px] uppercase tracking-wider">Tempering Stage</div>
          </div>
          <div className="text-center p-6 bg-surface-container-low border border-outline-variant/30">
            <div className="text-2xl font-bold text-outline mb-1">
              {Array.from(new Set(projects.flatMap((p) => p.technologies))).length}
            </div>
            <div className="text-on-surface-variant text-[10px] uppercase tracking-wider">Engine Specs</div>
          </div>
        </div>
      </div>

      {/* Details modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          teamMembers={teamMembers}
        />
      )}
    </section>
  );
});

export default ProjectsSection;