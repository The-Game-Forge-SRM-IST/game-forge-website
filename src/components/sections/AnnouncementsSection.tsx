'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementCard from '@/components/ui/AnnouncementCard';
import { Announcement } from '@/types';
import announcementsData from '@/data/announcements.json';

const FILTER_OPTIONS = [
  { value: 'all', label: 'ALL_NOTICES' },
  { value: 'news', label: 'LOG_NEWS' },
  { value: 'event', label: 'LOG_EVENTS' },
  { value: 'achievement', label: 'LOG_ACHIEVEMENTS' },
  { value: 'recruitment', label: 'LOG_RECRUITMENT' },
] as const;

export default function AnnouncementsSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
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
    <section id="announcements" className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full relative overflow-hidden">
      {/* Structural Framing decoration */}
      <div className="absolute inset-y-0 left-0 w-px bg-outline-variant/30 hidden md:block" />
      <div className="absolute inset-y-0 right-0 w-px bg-outline-variant/30 hidden md:block" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="mb-16 border-b border-outline-variant pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-secondary-container/10 border border-secondary-container/30 text-secondary w-12 h-12 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">campaign</span>
            </div>
            <div>
              <h2 className="font-sans text-4xl md:text-5xl font-bold text-on-surface uppercase tracking-tight">
                NOTICE_BOARD
              </h2>
              {newAnnouncementsCount > 0 && (
                <div className="flex items-center gap-1.5 mt-2 font-mono text-xs text-secondary text-glow-red font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping" />
                  <span>{newAnnouncementsCount} NEW_TRANSMISSIONS_LIVE</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="font-mono text-xs md:text-sm text-on-surface-variant max-w-md leading-relaxed">
            CRITICAL BROADCASTS: Stay updated with the latest news, operational events, and recruitment alerts from the foundry logs.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {FILTER_OPTIONS.map((option) => {
            const count = option.value === 'all' 
              ? announcements.length 
              : announcements.filter(a => a.type === option.value).length;

            return (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`font-mono text-[11px] font-bold px-4 py-2 border uppercase active:scale-95 transition-all duration-200 flex items-center gap-2 ${
                  selectedFilter === option.value
                    ? 'bg-primary border-primary text-black'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-white'
                }`}
              >
                <span>{option.label}</span>
                <span className={`px-1 py-0.5 text-[9px] ${
                  selectedFilter === option.value ? 'bg-black/10 text-black' : 'bg-surface-container-high text-outline'
                }`}>
                  {String(count).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AnnouncementCard 
                    announcement={announcement} 
                    index={index}
                  />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 forge-border bg-surface-container-low">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">
                  hourglass_empty
                </span>
                <h3 className="font-sans text-xl font-bold text-outline-variant uppercase mb-2">
                  NO_TRANSMISSIONS_FOUND
                </h3>
                <p className="font-mono text-xs text-outline">
                  Adjust active filtering parameters to scan wider frequencies.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}