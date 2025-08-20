'use client';

import { motion } from 'framer-motion';
import { Calendar, Trophy, Users, Newspaper } from 'lucide-react';
import { Announcement } from '@/types';

interface AnnouncementCardProps {
  announcement: Announcement;
  index: number;
}

const typeIcons = {
  news: Newspaper,
  event: Calendar,
  achievement: Trophy,
  recruitment: Users,
};

const typeColors = {
  news: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  event: 'from-green-500/20 to-green-600/20 border-green-500/30',
  achievement: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
  recruitment: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
};

const typeTextColors = {
  news: 'text-blue-400',
  event: 'text-green-400',
  achievement: 'text-yellow-400',
  recruitment: 'text-purple-400',
};

export default function AnnouncementCard({ announcement, index }: AnnouncementCardProps) {
  const IconComponent = typeIcons[announcement.type];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`
        relative p-6 rounded-xl border backdrop-blur-sm
        bg-gradient-to-br ${typeColors[announcement.type]}
        hover:shadow-lg hover:shadow-black/20
        transition-all duration-300 group
        ${announcement.isNew ? 'ring-2 ring-white/20' : ''}
      `}
    >
      {/* New Badge */}
      {announcement.isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            NEW
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className={`p-3 rounded-lg bg-black/20 ${typeTextColors[announcement.type]}`}
        >
          <IconComponent size={24} />
        </motion.div>
        
        <div className="flex-1">
          <motion.h3 
            className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {announcement.title}
          </motion.h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={14} />
            <span>{formatDate(announcement.date)}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className={`capitalize font-medium ${typeTextColors[announcement.type]}`}>
              {announcement.type}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.p 
        className="text-gray-300 leading-relaxed"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {announcement.content}
      </motion.p>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}