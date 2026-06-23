'use client';

import { Announcement } from '@/types';

interface AnnouncementCardProps {
  announcement: Announcement;
  index: number;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).toUpperCase();
    } catch {
      return dateString.toUpperCase();
    }
  };

  // Configuration mapping based on type
  const getTypeConfig = (type: Announcement['type']) => {
    switch (type) {
      case 'news':
        return {
          label: 'LOG_NEWS',
          icon: 'newspaper',
          borderStyle: 'border-outline-variant hover:border-primary',
          textStyle: 'text-primary',
          badgeBg: 'bg-primary/10 text-primary border-primary/20'
        };
      case 'event':
        return {
          label: 'LOG_EVENTS',
          icon: 'calendar_today',
          borderStyle: 'border-outline-variant hover:border-tertiary',
          textStyle: 'text-tertiary',
          badgeBg: 'bg-tertiary/10 text-tertiary border-tertiary/20'
        };
      case 'achievement':
        return {
          label: 'LOG_ACHIEVEMENTS',
          icon: 'workspace_premium',
          borderStyle: 'border-outline-variant hover:border-primary',
          textStyle: 'text-primary',
          badgeBg: 'bg-primary/20 text-on-surface border-primary/30'
        };
      case 'recruitment':
        return {
          label: 'LOG_RECRUITMENT',
          icon: 'engineering',
          borderStyle: 'border-outline-variant hover:border-secondary',
          textStyle: 'text-secondary',
          badgeBg: 'bg-secondary/15 text-secondary border-secondary/30'
        };
    }
  };

  const config = getTypeConfig(announcement.type);

  // Mouse follow glow effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Hover colors match type accents
    let glowColor = 'rgba(196, 199, 203, 0.04)'; // primary
    if (announcement.type === 'recruitment') glowColor = 'rgba(172, 1, 44, 0.04)';
    else if (announcement.type === 'event') glowColor = 'rgba(145, 215, 138, 0.04)';

    card.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor} 0%, transparent 70%), #1c1b1b`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = '';
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative p-6 bg-surface-container-low border ${config.borderStyle} transition-all duration-300 group`}
    >
      {/* Rivets in top right */}
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="rivet" />
        <div className="rivet" />
      </div>

      {/* New Notice Banner */}
      {announcement.isNew && (
        <div className="absolute -top-3 left-4 bg-secondary text-white font-mono text-[9px] font-bold px-2 py-0.5 border border-secondary/50 tracking-widest animate-pulse">
          NEW_NOTICE
        </div>
      )}

      {/* Header Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4 border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-3">
          {/* Symbol */}
          <span className={`material-symbols-outlined text-2xl ${config.textStyle}`}>
            {config.icon}
          </span>
          <div>
            {/* Title */}
            <h3 className="font-sans text-lg font-bold text-on-surface uppercase tracking-tight group-hover:text-white transition-colors">
              {announcement.title}
            </h3>
            
            {/* Meta row */}
            <div className="flex items-center gap-2 font-mono text-[10px] text-outline-variant mt-0.5">
              <span>{formatDate(announcement.date)}</span>
              <span className="w-1 h-1 bg-outline-variant/50 rounded-full" />
              <span className={`inline-flex items-center gap-1 font-bold ${config.textStyle}`}>
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* Small Tag */}
        <div className={`self-start sm:self-center font-mono text-[9px] font-bold px-2.5 py-1 border uppercase tracking-wider ${config.badgeBg}`}>
          {announcement.type}
        </div>
      </div>

      {/* Body content */}
      <p className="font-mono text-xs md:text-sm text-on-surface-variant leading-relaxed">
        {announcement.content}
      </p>
    </div>
  );
}