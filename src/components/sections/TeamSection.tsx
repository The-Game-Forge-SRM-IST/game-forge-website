'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Filter } from 'lucide-react';
import { TeamMember } from '@/types';
import { TeamMemberCard } from '@/components/ui';
import teamData from '@/data/team.json';

const departments = ['All', 'Development', 'Design', 'Art', 'Management', 'AI For Game Dev'] as const;
type Department = typeof departments[number];

export default function TeamSection() {
  const [activeFilter, setActiveFilter] = useState<Department>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Memoize team data to avoid re-parsing JSON on every render
  const teamMembers = useMemo(() => teamData as TeamMember[], []);

  // Memoize filtered members to avoid recalculating on every render
  const filteredMembers = useMemo(() => {
    if (activeFilter === 'All') {
      return teamMembers;
    }
    return teamMembers.filter(member => member.department === activeFilter);
  }, [activeFilter, teamMembers]);

  // Calculate items to show (3 rows = 9 items on desktop, 6 on tablet, 3 on mobile)
  // layout sizing constants (currently unused)
  const initialItemsToShow = 9; // 3 rows on desktop
  const displayedMembers = showAll ? filteredMembers : filteredMembers.slice(0, initialItemsToShow);
  const hasMoreItems = filteredMembers.length > initialItemsToShow;

  // Use callback to prevent unnecessary re-renders of filter buttons
  const handleFilterChange = useCallback((dept: Department) => {
    setActiveFilter(dept);
    setShowAll(false); // Reset show all when filter changes
  }, []);

  const handleShowMore = useCallback(() => {
    setShowAll(true);
  }, []);

  const handleShowLess = useCallback(() => {
    setShowAll(false);
  }, []);

  useEffect(() => {
    // Reduce loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // animation variant placeholders (intentionally unused)

  // Memoize department counts to avoid recalculating on every render
  const departmentCounts = useMemo(() => {
    const counts: Record<Department, number> = {
      'All': teamMembers.length,
      'Development': 0,
      'Design': 0,
      'Art': 0,
      'Management': 0,
      'AI For Game Dev': 0
    };

    teamMembers.forEach(member => {
      counts[member.department as Department]++;
    });

    return counts;
  }, [teamMembers]);

  const getDepartmentCount = useCallback((dept: Department) => {
    return departmentCounts[dept];
  }, [departmentCounts]);

  const getFilterButtonColor = (dept: Department) => {
    switch (dept) {
      case 'Development':
        return activeFilter === dept 
          ? 'bg-blue-500/30 text-blue-300 border-blue-500/50' 
          : 'hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/30';
      case 'Design':
        return activeFilter === dept 
          ? 'bg-green-500/30 text-green-300 border-green-500/50' 
          : 'hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/30';
      case 'Art':
        return activeFilter === dept 
          ? 'bg-purple-500/30 text-purple-300 border-purple-500/50' 
          : 'hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/30';
      case 'Management':
        return activeFilter === dept 
          ? 'bg-red-500/30 text-red-300 border-red-500/50' 
          : 'hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30';
      case 'AI For Game Dev':
        return activeFilter === dept 
          ? 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50' 
          : 'hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30';
      default:
        return activeFilter === dept 
          ? 'bg-white/20 text-white border-white/50' 
          : 'hover:bg-white/10 hover:text-white hover:border-white/30';
    }
  };

  if (isLoading) {
    return (
      <section id="team" className="min-h-screen py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-8 bg-gray-700/50 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-12 bg-gray-700/50 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-700/50 rounded mx-auto animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-700/50" />
                <div className="p-6 space-y-3">
                  <div className="w-32 h-6 bg-gray-700/50 rounded" />
                  <div className="w-24 h-4 bg-gray-700/50 rounded" />
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-gray-700/50 rounded" />
                    <div className="w-20 h-6 bg-gray-700/50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="min-h-screen py-20 px-4 bg-gray-900/10 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-blue-400 mr-3" />
            <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm">
              Our Team
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Meet the{' '}
            <span className="bg-gradient-to-r from-blue-400 via-green-400 to-red-400 bg-clip-text text-transparent">
              Game Forge
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Meet the talented individuals behind The Game Forge, each bringing unique skills 
            and passion to game development. Together, we create extraordinary gaming experiences.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 px-4">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => handleFilterChange(dept)}
              className={`px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 rounded-full border transition-all duration-300 font-medium
                         flex items-center gap-2 ${getFilterButtonColor(dept)}
                         ${activeFilter === dept ? 'scale-105 shadow-lg' : 'scale-100'}
                         text-gray-300 border-gray-600/50 text-sm sm:text-base touch-manipulation min-h-[48px]`}
            >
              <Filter size={16} className="flex-shrink-0" />
              <span className="hidden xs:inline">{dept}</span>
              <span className="xs:hidden">{dept.length > 6 ? dept.substring(0, 6) + '...' : dept}</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold min-w-[24px] text-center">
                {getDepartmentCount(dept)}
              </span>
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-0">
          {displayedMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              index={index}
            />
          ))}
        </div>

        {/* Show More/Less Button */}
        {hasMoreItems && (
          <div className="flex justify-center mt-8 sm:mt-12">
            {!showAll ? (
              <button
                onClick={handleShowMore}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-full
                         hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105
                         shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>Show More Members</span>
                <span className="text-sm opacity-80">({filteredMembers.length - initialItemsToShow} more)</span>
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

        {/* Empty State */}
        {filteredMembers.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No team members found
            </h3>
            <p className="text-gray-500">
              Try selecting a different department filter.
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-0"
        >
          {departments.slice(1).map((dept) => {
            const count = getDepartmentCount(dept);
            const colors = {
              Development: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
              Design: 'text-green-400 border-green-500/30 bg-green-500/5',
              Art: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
              Management: 'text-red-400 border-red-500/30 bg-red-500/5',
              'AI For Game Dev': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5'
            };
            
            return (
              <motion.div
                key={dept}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`text-center p-6 sm:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 ${colors[dept as keyof typeof colors]}`}
              >
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${colors[dept as keyof typeof colors].split(' ')[0]}`}>
                  {count}
                </div>
                <div className="text-gray-300 font-medium text-sm sm:text-base lg:text-lg">
                  <div className="hidden sm:block">{dept} Team{count !== 1 ? ' Members' : ' Member'}</div>
                  <div className="sm:hidden">{dept}<br/>{count !== 1 ? 'Members' : 'Member'}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}