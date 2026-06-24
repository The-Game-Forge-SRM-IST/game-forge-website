'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import eventsData from '@/data/events.json';
import { Event } from '@/types';

const EVENT_TYPES = ['All', 'Workshop', 'Competition', 'Meeting', 'Social'] as const;
type FilterType = typeof EVENT_TYPES[number];

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [now, setNow] = useState<Date | null>(null);

  // Set initial client-side state
  useEffect(() => {
    setEvents(eventsData as Event[]);
    setNow(new Date());

    // Only tick if there are upcoming events
    const hasUpcoming = (eventsData as Event[]).some(e => {
      const eventTime = e.time || '00:00';
      return new Date(`${e.date}T${eventTime}:00`).getTime() > Date.now();
    });

    if (!hasUpcoming) return;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(event => {
    if (activeFilter === 'All') return true;
    return event.type.toLowerCase() === activeFilter.toLowerCase();
  });

  // Calculate statistics
  const stokedJams = events.filter(e => e.type === 'competition').length;
  const totalHeats = events.filter(e => e.type === 'workshop').length;

  // Format date helper (e.g. 2025-03-01 -> 03/01)
  const formatEventDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[1]}/${parts[2]}`;
      }
      const d = new Date(dateStr);
      return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  // Countdown calculations
  const getCountdown = (event: Event) => {
    if (!now) return '00:00:00:00';
    try {
      const eventTime = event.time || '00:00';
      const eventDate = new Date(`${event.date}T${eventTime}:00`);
      const diff = eventDate.getTime() - now.getTime();
      if (diff <= 0) return '00:00:00:00';

      const days = Math.floor(diff / (24 * 3600 * 1000));
      const hours = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
      const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);

      return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } catch {
      return '00:00:00:00';
    }
  };

  // Checks if event is in the past
  const isPastEvent = (event: Event) => {
    if (!now) return false;
    try {
      const eventTime = event.time || '00:00';
      const eventDate = new Date(`${event.date}T${eventTime}:00`);
      return eventDate.getTime() < now.getTime();
    } catch {
      return false;
    }
  };

  // High performance DOM-based hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(172, 1, 44, 0.04) 0%, transparent 70%), #201f1f`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = '';
  };

  // Type configurations
  const getBadgeDetails = (type: Event['type']) => {
    switch (type) {
      case 'competition':
        return {
          label: 'CRITICAL_JAM',
          chipStyle: 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30',
          icon: 'warning',
          btnText: 'RESERVE',
          btnIcon: 'build',
          btnStyle: 'bg-secondary-container text-white border-transparent hover:brightness-110'
        };
      case 'workshop':
        return {
          label: 'TECH_HEAT',
          chipStyle: 'bg-tertiary-container/10 text-tertiary border-tertiary/20',
          icon: 'school',
          btnText: 'SECURE',
          btnIcon: 'login',
          btnStyle: 'border border-tertiary text-tertiary hover:bg-tertiary/10'
        };
      case 'meeting':
        return {
          label: 'ASSEMBLY',
          chipStyle: 'bg-primary/10 text-primary border-primary/20',
          icon: 'forum',
          btnText: 'CONNECT',
          btnIcon: 'cast',
          btnStyle: 'border border-outline text-on-surface hover:bg-outline/10'
        };
      case 'social':
        return {
          label: 'MACHINA_JAM',
          chipStyle: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
          icon: 'memory',
          btnText: 'CLEARANCE',
          btnIcon: 'key',
          btnStyle: 'bg-tertiary-container text-on-tertiary border-transparent hover:brightness-110'
        };
    }
  };

  return (
    <section id="events" className="relative pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Hero Header */}
      <div className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-4 uppercase tracking-tight">
              THE FORGE LOG
            </h1>
            <p className="font-mono text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Forging digital experiences through discipline and fire. Browse our scheduled workshops, technical heats, and major game jams.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col items-center p-4 forge-border bg-surface-container-low min-w-[110px]">
              <span className="font-mono text-xs font-bold text-tertiary tracking-widest uppercase">STOKED</span>
              <span className="font-sans text-3xl font-bold text-secondary my-1">
                {String(stokedJams).padStart(2, '0')}
              </span>
              <span className="font-mono text-[10px] text-outline tracking-wider uppercase">JAMS</span>
            </div>
            <div className="flex flex-col items-center p-4 forge-border bg-surface-container-low min-w-[110px]">
              <span className="font-mono text-xs font-bold text-outline-variant tracking-widest uppercase text-center">TOTAL</span>
              <span className="font-sans text-3xl font-bold text-secondary my-1">
                {String(totalHeats).padStart(2, '0')}
              </span>
              <span className="font-mono text-[10px] text-outline tracking-wider uppercase">HEATS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-16 border-b border-outline-variant pb-6">
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`font-mono text-xs font-bold px-4 py-2 border uppercase transition-all duration-200 active:scale-95 flex items-center gap-2 ${
              activeFilter === type
                ? 'bg-secondary border-secondary text-white'
                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-white'
            }`}
          >
            <span>{type}</span>
            <span className={`px-1.5 py-0.5 text-[9px] ${
              activeFilter === type ? 'bg-white/20 text-white' : 'bg-surface-container-high text-outline'
            }`}>
              {type === 'All' 
                ? events.length 
                : events.filter(e => e.type.toLowerCase() === type.toLowerCase()).length}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="relative mb-32">
        {/* Central Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 timeline-line -translate-x-1/2 opacity-30" />

        <div className="space-y-20 relative">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => {
              const details = getBadgeDetails(event.type);
              const past = isPastEvent(event);
              const countdownStr = getCountdown(event);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={event.id}
                  className={`relative flex flex-col md:flex-row items-start md:items-center justify-between ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Opposite Side Label / Details Column */}
                  <div className={`hidden md:block w-[45%] ${isEven ? 'text-right pr-12' : 'text-left pl-12'}`}>
                    {event.type === 'competition' && (
                      <div>
                        <div className="font-mono text-xs font-bold text-tertiary mb-1 uppercase tracking-widest">
                          {past ? 'STATUS' : 'IGNITION'}
                        </div>
                        <div className={`font-sans text-3xl font-bold tracking-tight ${past ? 'text-outline' : 'text-secondary text-glow-red'}`}>
                          {past ? 'FORGED' : countdownStr}
                        </div>
                      </div>
                    )}

                    {event.type === 'workshop' && (
                      <div>
                        <div className="font-mono text-xs font-bold text-tertiary mb-1 uppercase tracking-widest">
                          CAPACITY
                        </div>
                        <div className="flex items-center gap-2 justify-end font-sans text-3xl font-bold text-tertiary">
                          {!isEven && <span className="material-symbols-outlined text-tertiary">thermostat</span>}
                          <span>{80 + (parseInt(event.id) % 3) * 5}%</span>
                          {isEven && <span className="material-symbols-outlined text-tertiary">thermostat</span>}
                        </div>
                      </div>
                    )}

                    {event.type === 'meeting' && (
                      <div className={`flex items-center gap-3 ${isEven ? 'justify-end' : 'justify-start'}`}>
                        {isEven && (
                          <div className="text-right">
                            <div className="font-mono text-xs font-bold text-on-surface uppercase">CONCLAVE HOST</div>
                            <div className="font-mono text-xs text-outline tracking-wider">ELDER SMITH</div>
                          </div>
                        )}
                        <div className="w-12 h-12 bg-surface-container-high border border-outline-variant p-1">
                          <span className="material-symbols-outlined text-3xl text-outline w-full h-full flex items-center justify-center">
                            account_circle
                          </span>
                        </div>
                        {!isEven && (
                          <div className="text-left">
                            <div className="font-mono text-xs font-bold text-on-surface uppercase">CONCLAVE HOST</div>
                            <div className="font-mono text-xs text-outline tracking-wider">ELDER SMITH</div>
                          </div>
                        )}
                      </div>
                    )}

                    {event.type === 'social' && (
                      <div>
                        <div className="font-mono text-xs font-bold text-outline-variant mb-1 uppercase tracking-widest">
                          HEAT_LEVEL
                        </div>
                        <div className="font-sans text-3xl font-bold text-outline">
                          STABLE
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dot Marker */}
                  <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center rotate-45 ${
                    event.type === 'competition' 
                      ? 'w-8 h-8 bg-surface border-4 border-secondary-container'
                      : event.type === 'workshop'
                      ? 'w-6 h-6 bg-surface border-2 border-tertiary'
                      : 'w-6 h-6 bg-surface border-2 border-outline'
                  }`}>
                    {event.type === 'competition' && (
                      <div className={`w-2 h-2 bg-secondary ${past ? '' : 'animate-pulse'}`} />
                    )}
                  </div>

                  {/* Timeline Card Column */}
                  <div className="w-full md:w-[45%] pl-12 md:pl-0 mt-2 md:mt-0">
                    <div
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className="forge-border bg-surface-container p-6 relative overflow-hidden group transition-all duration-300"
                    >
                      {/* Rivets decoration */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <div className="rivet" />
                        <div className="rivet" />
                      </div>

                      <div className="relative z-10">
                        {/* Event Category Chip */}
                        <div className={`inline-flex items-center gap-2 font-mono text-[10px] font-bold px-2 py-1 border mb-4 uppercase tracking-wider ${details.chipStyle}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {details.icon}
                          </span>
                          {details.label}
                        </div>

                        {/* Title */}
                        <h3 className="font-sans text-xl md:text-2xl font-bold text-on-surface mb-3 uppercase tracking-tight leading-tight">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="font-mono text-xs md:text-sm text-on-surface-variant mb-6 leading-relaxed">
                          {event.description}
                        </p>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-outline font-mono text-[11px] mb-6 border-t border-outline-variant/30 pt-4">
                          <span className="flex items-center gap-1.5" title="Date">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {formatEventDate(event.date)}
                          </span>
                          <span className="flex items-center gap-1.5" title="Time">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1.5 max-w-xs truncate" title="Location">
                            <span className="material-symbols-outlined text-sm">factory</span>
                            {event.location.replace(', SRM IST KTR', '')}
                          </span>
                        </div>

                        {/* Mobile view countdown or status */}
                        <div className="md:hidden mb-6 border-t border-outline-variant/30 pt-4">
                          {event.type === 'competition' && (
                            <div>
                              <div className="font-mono text-[10px] font-bold text-tertiary mb-0.5 uppercase tracking-widest">
                                {past ? 'STATUS' : 'IGNITION'}
                              </div>
                              <div className="font-sans text-xl font-bold text-secondary">
                                {past ? 'FORGED' : countdownStr}
                              </div>
                            </div>
                          )}
                          {event.type === 'workshop' && (
                            <div>
                              <div className="font-mono text-[10px] font-bold text-tertiary mb-0.5 uppercase tracking-widest">
                                CAPACITY
                              </div>
                              <div className="font-sans text-xl font-bold text-tertiary">
                                {80 + (parseInt(event.id) % 3) * 5}%
                              </div>
                            </div>
                          )}
                          {event.type === 'meeting' && (
                            <div>
                              <div className="font-mono text-[10px] font-bold text-on-surface mb-0.5 uppercase tracking-widest">
                                CONCLAVE HOST
                              </div>
                              <div className="font-mono text-xs text-outline">
                                ELDER SMITH
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action button */}
                        {event.registrationUrl && !past ? (
                          <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-3 font-mono text-xs font-bold uppercase active:scale-95 transition-all flex justify-center items-center gap-2 ${details.btnStyle}`}
                          >
                            <span className="material-symbols-outlined text-sm">{details.btnIcon}</span>
                            {details.btnText}
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full py-3 font-mono text-xs font-bold uppercase border border-outline-variant text-outline/40 flex justify-center items-center gap-2 cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-sm">lock</span>
                            {past ? 'ARCHIVED' : 'LOCKED'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Featured Panel: Weekly Recurring Loops */}
      <section className="mt-32 border-t border-outline-variant pt-20">
        <h2 className="font-sans text-3xl font-bold text-on-surface mb-12 uppercase tracking-tight">
          CRAFTING_LOOPS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="forge-border bg-surface-container-low p-8 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-4xl text-tertiary mb-4">architecture</span>
            <h4 className="font-sans text-lg font-bold mb-2 text-on-surface uppercase">FORGE_FRIDAYS</h4>
            <p className="font-mono text-xs md:text-sm text-on-surface-variant mb-6 min-h-[40px]">
              Open floor coding and assets creation. All furnaces firing.
            </p>
            <span className="font-mono text-xs font-bold text-tertiary uppercase tracking-wider bg-tertiary/10 px-3 py-1">
              Every Friday // 20:00
            </span>
          </div>
          
          <div className="forge-border bg-surface-container-low p-8 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-4xl text-secondary mb-4">hardware</span>
            <h4 className="font-sans text-lg font-bold mb-2 text-on-surface uppercase">STRESS_TEST_MONDAYS</h4>
            <p className="font-mono text-xs md:text-sm text-on-surface-variant mb-6 min-h-[40px]">
              Mechanical playtesting. If it can break, it will break here.
            </p>
            <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1">
              Every Monday // 17:00
            </span>
          </div>

          <div className="forge-border bg-surface-container-low p-8 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-4">analytics</span>
            <h4 className="font-sans text-lg font-bold mb-2 text-on-surface uppercase">THEORY_TUESDAYS</h4>
            <p className="font-mono text-xs md:text-sm text-on-surface-variant mb-6 min-h-[40px]">
              The blueprint phase. Design philosophy and system architecture.
            </p>
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1">
              Every Tuesday // 19:00
            </span>
          </div>
        </div>
      </section>
    </section>
  );
}