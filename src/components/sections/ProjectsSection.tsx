'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Project, TeamMember } from '@/types';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { 
  useProgressiveLoading, 
  getGPUOptimizedVariants, 
  useSmartAnimations 
} from '@/utils/performanceOptimizer';

interface ProjectsSectionProps {
  projects: Project[];
  teamMembers: TeamMember[];
}

type FilterType = 'all' | 'completed' | 'in-progress' | 'planned';

const ProjectsSection = memo(function ProjectsSection({ projects, teamMembers }: ProjectsSectionProps) {
  const { ref, loadingStage } = useProgressiveLoading(0.1);
  const canAnimate = useSmartAnimations();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAll, setShowAll] = useState(false);
  
  const initialProjectsToShow = 6; // Show 6 projects initially (2 rows of 3)

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter(project => project.status === filter);
  }, [projects, filter]);

  const displayedProjects = useMemo(() => {
    if (showAll) return filteredProjects;
    return filteredProjects.slice(0, initialProjectsToShow);
  }, [filteredProjects, showAll, initialProjectsToShow]);

  const hasMoreProjects = filteredProjects.length > initialProjectsToShow;

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setShowAll(false); // Reset show all when filter changes
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  // Memoize filter options to prevent recalculation
  const filterOptions: { value: FilterType; label: string; count: number }[] = useMemo(() => [
    { value: 'all', label: 'All Projects', count: projects.length },
    { value: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { value: 'in-progress', label: 'In Progress', count: projects.filter(p => p.status === 'in-progress').length },
    { value: 'planned', label: 'Planned', count: projects.filter(p => p.status === 'planned').length },
  ], [projects]);

  // Get optimized animation variants
  const variants = getGPUOptimizedVariants();
  
  // Progressive loading stages
  if (loadingStage === 'idle') {
    return <section ref={ref} id="projects" className="relative py-20" />;
  }
  
  if (loadingStage === 'skeleton') {
    return (
      <section ref={ref} id="projects" className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-64 h-12 bg-gray-700/30 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-700/30 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800/20 rounded-xl p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-700/30 rounded-lg mb-4" />
                <div className="w-3/4 h-6 bg-gray-700/30 rounded mb-2" />
                <div className="w-full h-4 bg-gray-700/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="projects" className="relative py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          variants={canAnimate && loadingStage === 'animations' ? variants.container : {}}
          initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
          animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            variants={canAnimate ? variants.item : {}}
          >
            Our <span className="text-green-400">Projects</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            variants={canAnimate ? variants.item : {}}
          >
            Explore the innovative games and interactive experiences created by our club members.
            From retro platformers to cutting-edge VR experiences, discover the creativity and technical prowess of The Game Forge.
          </motion.p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8 px-4 sm:px-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="text-sm text-gray-400 hidden sm:inline">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation ${
                    filter === option.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                  }`}
                >
                  <span className="hidden sm:inline">{option.label}</span>
                  <span className="sm:hidden">{option.label.split(' ')[0]}</span>
                  <span className="ml-1">({option.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length > 0 ? (
          <>
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0'
              variants={canAnimate && loadingStage === 'animations' ? variants.container : {}}
              initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
              animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
            >
              {displayedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={canAnimate ? variants.item : {}}
                  className="gpu-accelerated"
                >
                  <ProjectCard
                    project={project}
                    onViewDetails={handleViewDetails}
                    index={index}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Show More/Less Button */}
            {hasMoreProjects && (
              <div className="flex justify-center mt-8 sm:mt-12">
                {!showAll ? (
                  <button
                    onClick={handleShowMore}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full
                             hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105
                             shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <span>Show More Projects</span>
                    <span className="text-sm opacity-80">({filteredProjects.length - initialProjectsToShow} more)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleShowLess}
                    className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-full
                             hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105
                             shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <span>Show Less</span>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
              <span className="text-4xl">🎮</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400">
              No projects match the current filter. Try selecting a different filter option.
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 mb-1 sm:mb-2">
              {projects.length}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">Total Projects</div>
          </div>
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">Completed</div>
          </div>
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400 mb-1 sm:mb-2">
              {projects.filter(p => p.awards && p.awards.length > 0).length}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">Award Winners</div>
          </div>
          <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">
              {Array.from(new Set(projects.flatMap(p => p.technologies))).length}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">Technologies</div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        teamMembers={teamMembers}
      />
    </section>
  );
});

export { ProjectsSection };