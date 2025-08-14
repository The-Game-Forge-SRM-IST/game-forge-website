'use client';

import { motion } from 'framer-motion';
import { Megaphone, Clock, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import AnnouncementCard from '@/components/ui/AnnouncementCard';
import { Announcement } from '@/types';
import announcementsData from '@/data/announcements.json';

const filterOptions = [
  { value: 'all', label: 'All Announcements' },
  { value: 'news', label: 'News' },
  { value: 'event', label: 'Events' },
  { value: 'achievement', label: 'Achievements' },
  { value: 'recruitment', label: 'Recruitment' },
];

export default function AnnouncementsSection() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const announcements = announcementsData as Announcement[];

  // Sort announcements by date (newest first) and filter by type
  const filteredAnnouncements = useMemo(() => {
    const sorted = [...announcements].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (selectedFilter === 'all') {
      return sorted;
    }
    
    return sorted.filter(announcement => announcement.type === selectedFilter);
  }, [announcements, selectedFilter]);

  const newAnnouncementsCount = announcements.filter(a => a.isNew).length;

  return (
    <section id="announcements" className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Megaphone className="text-blue-400" size={32} />
            </motion.div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Club Announcements
              </h2>
              {newAnnouncementsCount > 0 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-400 font-medium mt-2"
                >
                  {newAnnouncementsCount} new announcement{newAnnouncementsCount !== 1 ? 's' : ''}
                </motion.p>
              )}
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Stay updated with the latest news, events, achievements, and opportunities from The Game Forge community.
          </motion.p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <div className="flex items-center gap-2 text-gray-400 mr-4">
            <Filter size={18} />
            <span className="font-medium">Filter by:</span>
          </div>
          
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${selectedFilter === option.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Announcements Grid */}
        <motion.div
          layout
          className="grid gap-6 md:gap-8"
        >
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnnouncementCard 
                  announcement={announcement} 
                  index={index}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block mb-4"
              >
                <Clock className="text-gray-500" size={48} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                No announcements found
              </h3>
              <p className="text-gray-500">
                No announcements match the selected filter. Try selecting a different category.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Load More Button (for future implementation) */}
        {filteredAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-lg text-white font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled
            >
              <span className="opacity-50">Load More Announcements</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}