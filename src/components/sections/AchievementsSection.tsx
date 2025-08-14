'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Target, Filter } from 'lucide-react';
import { Achievement } from '@/types';
import { AchievementCard } from '@/components/ui';
import { 
  useProgressiveLoading, 
  getGPUOptimizedVariants, 
  useSmartAnimations 
} from '@/utils/performanceOptimizer';
import achievementsData from '@/data/achievements.json';

const achievementTypes = ['All', 'Competition', 'Recognition', 'Milestone'] as const;
type AchievementType = typeof achievementTypes[number];

const AchievementsSection = memo(function AchievementsSection() {
  const { ref, loadingStage } = useProgressiveLoading(0.1);
  const canAnimate = useSmartAnimations();
  const [activeFilter, setActiveFilter] = useState<AchievementType>('All');

  // Memoize achievements data processing
  const achievements = useMemo(() => {
    return (achievementsData as Achievement[]).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  // Memoize filtered achievements
  const filteredAchievements = useMemo(() => {
    if (activeFilter === 'All') return achievements;
    return achievements.filter(achievement => 
      achievement.type === activeFilter.toLowerCase()
    );
  }, [activeFilter, achievements]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    const competitions = achievements.filter(a => a.type === 'competition').length;
    const recognitions = achievements.filter(a => a.type === 'recognition').length;
    const milestones = achievements.filter(a => a.type === 'milestone').length;
    return { competitions, recognitions, milestones };
  }, [achievements]);

  const getFilterIcon = (type: AchievementType) => {
    switch (type) {
      case 'Competition':
        return <Trophy size={16} />;
      case 'Recognition':
        return <Award size={16} />;
      case 'Milestone':
        return <Target size={16} />;
      default:
        return <Filter size={16} />;
    }
  };

  const getFilterColor = (type: AchievementType) => {
    switch (type) {
      case 'Competition':
        return activeFilter === type 
          ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50' 
          : 'hover:bg-yellow-500/20 hover:text-yellow-300 hover:border-yellow-500/30';
      case 'Recognition':
        return activeFilter === type 
          ? 'bg-blue-500/30 text-blue-300 border-blue-500/50' 
          : 'hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/30';
      case 'Milestone':
        return activeFilter === type 
          ? 'bg-green-500/30 text-green-300 border-green-500/50' 
          : 'hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/30';
      default:
        return activeFilter === type 
          ? 'bg-white/20 text-white border-white/50' 
          : 'hover:bg-white/10 hover:text-white hover:border-white/30';
    }
  };

  const getTypeCount = (type: AchievementType) => {
    if (type === 'All') return achievements.length;
    return achievements.filter(achievement => achievement.type === type.toLowerCase()).length;
  };

  // Get optimized animation variants
  const variants = getGPUOptimizedVariants();
  
  // Progressive loading stages
  if (loadingStage === 'idle') {
    return <section ref={ref} id="achievements" className="min-h-screen py-20 px-4" />;
  }
  
  if (loadingStage === 'skeleton') {
    return (
      <section ref={ref} id="achievements" className="min-h-screen py-20 px-4 bg-gray-900/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-8 bg-gray-700/30 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-12 bg-gray-700/30 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-700/30 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 rounded-xl bg-gray-800/20 animate-pulse">
                <div className="w-8 h-8 bg-gray-700/30 rounded mx-auto mb-2" />
                <div className="w-12 h-8 bg-gray-700/30 rounded mx-auto mb-1" />
                <div className="w-20 h-4 bg-gray-700/30 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="achievements" className="min-h-screen py-20 px-4 bg-gray-900/10 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={canAnimate && loadingStage === 'animations' ? variants.container : {}}
          initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
          animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
        >
          <motion.div 
            className="flex items-center justify-center mb-4"
            variants={canAnimate ? variants.item : {}}
          >
            <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
            <span className="text-yellow-400 font-semibold tracking-wider uppercase text-sm">
              Our Achievements
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            variants={canAnimate ? variants.item : {}}
          >
            Hall of{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Fame
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={canAnimate ? variants.item : {}}
          >
            Celebrating our journey of excellence, innovation, and recognition in the game development community. 
            Each achievement represents our commitment to pushing boundaries and creating exceptional gaming experiences.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={canAnimate && loadingStage === 'animations' ? variants.container : {}}
          initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
          animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
        >
          <motion.div 
            className="text-center p-6 rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm gpu-accelerated"
            variants={canAnimate ? variants.item : {}}
          >
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.competitions}</div>
            <div className="text-gray-300 font-medium">Competition Wins</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm gpu-accelerated"
            variants={canAnimate ? variants.item : {}}
          >
            <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-400 mb-1">{stats.recognitions}</div>
            <div className="text-gray-300 font-medium">Recognitions</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm gpu-accelerated"
            variants={canAnimate ? variants.item : {}}
          >
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-400 mb-1">{stats.milestones}</div>
            <div className="text-gray-300 font-medium">Milestones</div>
          </motion.div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={canAnimate && loadingStage === 'animations' ? variants.container : {}}
          initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
          animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
        >
          {achievementTypes.map((type) => (
            <motion.button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-6 py-3 rounded-full border transition-colors duration-300 font-medium
                         flex items-center gap-2 ${getFilterColor(type)}
                         text-gray-300 border-gray-600/50`}
              variants={canAnimate ? variants.item : {}}
            >
              {getFilterIcon(type)}
              {type}
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {getTypeCount(type)}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <motion.div 
            className="hidden md:block absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gradient-to-b from-white/20 via-white/40 to-white/20"
            variants={canAnimate && loadingStage === 'animations' ? variants.fadeIn : {}}
            initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
            animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
          />
          
          {/* Achievement Cards */}
          <motion.div 
            className="space-y-12"
            variants={canAnimate && loadingStage === 'animations' ? variants.container : {}}
            initial={canAnimate && loadingStage === 'animations' ? "hidden" : false}
            animate={canAnimate && loadingStage === 'animations' ? "visible" : {}}
          >
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                variants={canAnimate ? variants.item : {}}
                className="gpu-accelerated"
              >
                <AchievementCard
                  achievement={achievement}
                  index={index}
                  isLeft={index % 2 === 0}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No achievements found
            </h3>
            <p className="text-gray-500">
              Try selecting a different filter to see more achievements.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to be part of our next achievement?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join The Game Forge and contribute to our legacy of excellence in game development. 
              Together, we can achieve even greater milestones.
            </p>
            <button
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105"
              onClick={() => {
                const applySection = document.getElementById('apply');
                applySection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Join Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AchievementsSection;