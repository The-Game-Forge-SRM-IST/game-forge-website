'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { TeamMember } from '@/types';
import TeamMemberCard from '@/components/ui/TeamMemberCard';
import teamData from '@/data/team.json';

const GUILDS = [
  { id: 'ALL', label: 'ALL_GUILDS' },
  { id: 'ENGINEERING', label: 'ENGINEERING' }, // Development
  { id: 'CRAFTING', label: 'CRAFTING' },       // Design & Art
  { id: 'OPERATIONS', label: 'OPERATIONS' },   // Management
  { id: 'COGNITIVE', label: 'COGNITIVE' },     // AI For Game Dev
] as const;

type GuildId = typeof GUILDS[number]['id'];

export default function TeamSection() {
  const [activeGuild, setActiveGuild] = useState<GuildId>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(5); // Initial visible members

  const teamMembers = useMemo(() => teamData as TeamMember[], []);

  // Filter members by search query AND guild department mapping
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      // 1. Guild filter
      let matchesGuild = false;
      if (activeGuild === 'ALL') {
        matchesGuild = true;
      } else if (activeGuild === 'ENGINEERING') {
        matchesGuild = member.department === 'Development';
      } else if (activeGuild === 'CRAFTING') {
        matchesGuild = member.department === 'Design' || member.department === 'Art';
      } else if (activeGuild === 'OPERATIONS') {
        matchesGuild = member.department === 'Management';
      } else if (activeGuild === 'COGNITIVE') {
        matchesGuild = member.department === 'AI For Game Dev';
      }

      // 2. Search query filter
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.skills.some((s) => s.toLowerCase().includes(q));

      return matchesGuild && matchesSearch;
    });
  }, [activeGuild, searchQuery, teamMembers]);

  const displayedMembers = useMemo(() => {
    return filteredMembers.slice(0, itemsToShow);
  }, [filteredMembers, itemsToShow]);

  const hasMore = filteredMembers.length > itemsToShow;

  const loadMore = useCallback(() => {
    setItemsToShow((prev) => prev + 6);
  }, []);

  return (
    <section id="team" className="py-24 border-b border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Header Section */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant text-tertiary font-mono text-[10px] uppercase mb-4 tracking-widest">
            <span className="w-1.5 h-1.5 bg-secondary animate-pulse rounded-full" />
            REGISTRY_CORE // MASTER_SMITHS
          </div>
          <h2 className="font-sans text-4xl md:text-5xl text-on-surface mb-4 uppercase tracking-tighter font-extrabold">
            FORGE ARTISANS
          </h2>
          <p className="font-mono text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            The master craftsmen shaping digital realms from raw code and pixels. Filter by guild or explore the full registry.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-12 flex flex-col lg:flex-row gap-4 items-center justify-between border-b border-outline-variant/30 pb-8">
          {/* Search box */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant focus:border-tertiary focus:ring-0 text-on-surface font-mono text-xs py-3 pl-12 pr-4 transition-all uppercase placeholder:text-outline-variant outline-none"
              placeholder="LOCATE_ARTISAN_ID..."
            />
          </div>

          {/* Guild filters */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {GUILDS.map((guild) => (
              <button
                key={guild.id}
                onClick={() => {
                  setActiveGuild(guild.id);
                  setItemsToShow(5); // Reset visible count
                }}
                className={`px-4 py-2 font-mono text-[10px] uppercase border transition-all whitespace-nowrap ${
                  activeGuild === guild.id
                    ? 'bg-tertiary border-tertiary text-on-tertiary font-bold'
                    : 'border-outline-variant text-on-surface-variant hover:border-tertiary/50'
                }`}
              >
                {guild.label}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {displayedMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}

          {/* Dynamic "Strike the Anvil" recruitment slot */}
          <div
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="group border border-dashed border-outline-variant/40 p-6 flex flex-col items-center justify-center text-center hover:border-secondary/50 hover:bg-secondary/[0.03] transition-all cursor-pointer bg-surface-container-low min-h-[300px]"
          >
            <div className="w-16 h-16 border border-dashed border-outline-variant/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-secondary transition-transform">
              <Plus className="w-6 h-6 text-outline group-hover:text-secondary" />
            </div>
            <h3 className="font-sans text-lg text-on-surface mb-2 uppercase font-bold tracking-tight">
              STRIKE_THE_ANVIL
            </h3>
            <p className="font-mono text-xs text-on-surface-variant mb-6 leading-relaxed max-w-[240px]">
              Join the Forge registry and showcase your craftsmanship to the master smiths.
            </p>
            <button className="font-mono text-[10px] text-secondary flex items-center gap-2 group-hover:gap-4 transition-all uppercase font-bold">
              SUBMIT_APPLICATION &rarr;
            </button>
          </div>
        </div>

        {/* Load More Button */}
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
        {filteredMembers.length === 0 && (
          <div className="text-center py-16 font-mono text-xs text-outline-variant border border-dashed border-outline-variant/30">
            NO_SMITH_IDS_FOUND_IN_SECTOR
          </div>
        )}
      </div>
    </section>
  );
}