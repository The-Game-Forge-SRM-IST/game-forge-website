'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, Hammer, ArrowLeft, ArrowRight } from 'lucide-react';
import projectsData from '@/data/projects.json';
import teamData from '@/data/team.json';
import { Project, TeamMember } from '@/types';

export default function HeroSection() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Load projects from local data
  const projects = projectsData as Project[];
  const team = teamData as TeamMember[];

  // Find the featured project (prefer "The Quota" brackeys entry)
  const featuredProject = projects.find(p => p.id === 'the-quota') || projects.find(p => p.status === 'completed' && p.awards && p.awards.length > 0) || projects[0];

  // In-progress or planned projects for the WIP slider
  const wipProjects = projects.filter(p => p.id !== featuredProject.id);

  const getTeamNames = (memberIds: string[]) => {
    return memberIds
      .map(id => team.find(t => t.id === id)?.name || id)
      .join(', ');
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 350;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* 1. Hero Cover Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            alt="Forge Background"
            className="w-full h-full object-cover opacity-25 select-none pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjJ4hAOoh6OkNV8RV_rqpQC3ppVXoewoSH9yGVhT49ofYUCIkJWyBhqOmJw1omkiQNAy7yUOyjgRCQvUnKyPuBTDaDzGm0kQ8qEFyngiP6h9LAdfmvdiO8Y0MPf0CL8dmbTHXzdnkvrRw4-9lj5egWHWvQzY0meFXQa5p_jVMRJdjiOMuBYCHkWW1opT8UBgmH8fKVIJjLi-YgoIeh_XoX7NNJk3hZ2qevbz749t0Us4ZDP-gIJG2R_gy5vaEMJpxCRr8fzCLOZwY"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center mt-12 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-sans text-[52px] md:text-[96px] mb-2 leading-none uppercase text-white tracking-tighter font-extrabold select-none">
              THE GAME <br />
              <span className="text-tertiary text-glow-green block mt-2">FORGE</span>
            </h1>
            <p className="font-mono text-xs md:text-sm text-on-surface-variant max-w-xl mx-auto mt-6 uppercase tracking-wider">
              Iterative, high-precision game engineering and digital worldcrafting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16"
          >
            <Link
              href="/recruitment"
              className="w-full sm:w-auto text-center bg-secondary-container text-white font-mono text-xs font-bold px-10 py-4 uppercase border border-secondary-container hover:bg-secondary-container/80 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] interactive block sm:inline-block"
            >
              JOIN THE FORGE
            </Link>
            <a
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-3 font-mono text-xs font-bold text-on-surface hover:text-tertiary transition-colors group uppercase interactive"
              href="#latest"
            >
              VIEW ARTIFACTS
              <Hammer className="w-4 h-4 group-hover:translate-x-1 transition-transform text-tertiary" />
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 z-10 cursor-pointer"
          onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="material-symbols-outlined text-white">south</span>
        </div>
      </section>

      {/* 2. Featured Masterwork Project */}
      {featuredProject && (
        <section className="px-margin-mobile md:px-margin-desktop py-20" id="latest">
          <div className="forge-border industrial-card p-0 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-8 relative min-h-[300px] md:min-h-[500px] bg-surface-container-lowest">
                {featuredProject.images && featuredProject.images.length > 0 ? (
                  <img
                    alt={featuredProject.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 select-none pointer-events-none"
                    src={featuredProject.images[0]}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-container-low font-mono text-xs text-outline-variant">
                    NO_VISUAL_RECORD
                  </div>
                )}
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="bg-tertiary text-on-tertiary px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest">
                    Masterwork
                  </span>
                </div>
              </div>
              <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-center bg-surface-container-low border-l border-white/5">
                <div className="font-mono text-tertiary text-[10px] mb-4 uppercase tracking-widest">
                  CRAFT_ID: {featuredProject.id.toUpperCase()}
                </div>
                <h2 className="font-sans text-2xl md:text-3xl text-white mb-6 uppercase tracking-tight font-extrabold">
                  {featuredProject.title}
                </h2>
                <p className="font-mono text-xs md:text-sm text-on-surface-variant mb-8 leading-relaxed">
                  {featuredProject.description}
                </p>
                
                {featuredProject.teamMembers && featuredProject.teamMembers.length > 0 && (
                  <div className="mb-6 font-mono text-[10px] text-outline uppercase tracking-wider">
                    SMITHED BY: {getTeamNames(featuredProject.teamMembers)}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-10">
                  {featuredProject.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="font-mono text-[9px] border border-outline-variant px-3 py-1 bg-surface-container-highest uppercase text-on-surface-variant"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {featuredProject.itchUrl || featuredProject.githubUrl ? (
                  <a
                    href={featuredProject.itchUrl || featuredProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit border border-primary text-primary hover:bg-primary hover:text-on-primary px-8 py-3 font-mono text-xs font-bold transition-all uppercase interactive"
                  >
                    ACQUIRE BUILD
                  </a>
                ) : (
                  <button className="w-fit border border-outline-variant text-outline-variant px-8 py-3 font-mono text-xs font-bold uppercase cursor-not-allowed">
                    BUILD TEMPERING
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Works in Progress Slider */}
      {wipProjects.length > 0 && (
        <section className="px-margin-mobile md:px-margin-desktop py-20 overflow-hidden bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="font-mono text-tertiary text-[10px] mb-2 uppercase tracking-widest">
                On the Anvil
              </div>
              <h2 className="font-sans text-2xl md:text-3xl text-white uppercase font-extrabold tracking-tight">
                CURRENT TEMPERING
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollSlider('left')}
                className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors interactive"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
              </button>
              <button
                onClick={() => scrollSlider('right')}
                className="w-12 h-12 border border-tertiary flex items-center justify-center hover:bg-tertiary/10 transition-colors interactive"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5 text-tertiary" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {wipProjects.map((project) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-[290px] sm:w-[360px] md:w-[420px] industrial-card relative overflow-hidden group snap-start"
              >
                <div className="relative h-[250px] overflow-hidden bg-surface-container-lowest">
                  {project.images && project.images.length > 0 ? (
                    <img
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 select-none pointer-events-none"
                      src={project.images[0]}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-container-low font-mono text-xs text-outline-variant">
                      NO_VISUAL_RECORD
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <div className="font-mono text-tertiary text-[9px] mb-2 uppercase tracking-widest">
                      {project.status.toUpperCase()} / {project.technologies.slice(0, 1).join(', ').toUpperCase()}
                    </div>
                    <h4 className="font-sans text-xl text-white uppercase font-bold tracking-tight">
                      {project.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}