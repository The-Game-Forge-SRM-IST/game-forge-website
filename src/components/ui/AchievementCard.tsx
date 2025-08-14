'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Award, Target, Calendar, ChevronDown } from 'lucide-react';
import { Achievement } from '@/types';

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
  isLeft?: boolean;
}

export default function AchievementCard({ achievement, index, isLeft = false }: AchievementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: isLeft ? -100 : 100,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1
    }
  };

  const expandVariants = {
    collapsed: { 
      height: 0,
      opacity: 0,
      transition: { duration: 0.3 }
    },
    expanded: { 
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.3, delay: 0.1 }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'competition':
        return <Trophy className="w-5 h-5" />;
      case 'recognition':
        return <Award className="w-5 h-5" />;
      case 'milestone':
        return <Target className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'competition':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300';
      case 'recognition':
        return 'from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300';
      case 'milestone':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300';
    }
  };

  const getPlacementColor = (placement?: string) => {
    if (!placement) return 'bg-gray-500/20 text-gray-300';
    
    if (placement.includes('1st') || placement.includes('First')) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    } else if (placement.includes('2nd') || placement.includes('Second')) {
      return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
    } else if (placement.includes('3rd') || placement.includes('Third')) {
      return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    } else {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`relative ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
      {/* Timeline Connector */}
      <div className={`hidden md:block absolute top-8 w-4 h-4 bg-white rounded-full border-4 border-gray-900 z-10
                      ${isLeft ? 'right-0 transform translate-x-2' : 'left-0 transform -translate-x-2'}`} />
      
      {/* Card */}
      <div
        className={`bg-gradient-to-br ${getTypeColor(achievement.type)} 
                   backdrop-blur-sm border rounded-xl overflow-hidden
                   hover:shadow-2xl hover:shadow-black/50 transition-all duration-300
                   cursor-pointer group hover:scale-[1.02] hover:-translate-y-1`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(achievement.type)} border`}>
                {getTypeIcon(achievement.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {formatDate(achievement.date)}
                  </span>
                </div>
                {achievement.placement && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPlacementColor(achievement.placement)}`}>
                    {achievement.placement}
                  </span>
                )}
              </div>
            </div>
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400 group-hover:text-white transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
            {achievement.title}
          </h3>
          
          <p className="text-gray-300 leading-relaxed">
            {achievement.description}
          </p>

          {achievement.competition && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="text-sm text-gray-400">Competition: </span>
              <span className="text-sm font-medium text-white">
                {achievement.competition}
              </span>
            </div>
          )}
        </div>

        {/* Expandable Content */}
        <motion.div
          variants={expandVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 border-t border-white/10">
            <div className="pt-4 space-y-4">
              {/* Achievement Image */}
              {achievement.image && (
                <div className="relative h-48 rounded-lg overflow-hidden bg-gray-800/50">
                  <Image
                    src={achievement.image}
                    alt={achievement.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Achievement Type
                  </h4>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(achievement.type)}
                    <span className="text-gray-300 capitalize">
                      {achievement.type}
                    </span>
                  </div>
                </div>

                {achievement.competition && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                      Event
                    </h4>
                    <p className="text-gray-300">
                      {achievement.competition}
                    </p>
                  </div>
                )}
              </div>

              {/* Impact Statement */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                  Impact
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This achievement demonstrates our commitment to excellence in game development 
                  and showcases the technical skills and creativity of our team members. 
                  It contributes to our reputation as a leading game development club at SRM IST KTR.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}