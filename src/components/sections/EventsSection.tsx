'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, ChevronRight } from 'lucide-react';
import { Event } from '@/types';
import { EventCard } from '@/components/ui';
import eventsData from '@/data/events.json';

const eventTypes = ['All', 'Workshop', 'Competition', 'Meeting', 'Social'] as const;
type EventType = typeof eventTypes[number];

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState<EventType>('All');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and set events data
    const timer = setTimeout(() => {
      const sortedEvents = (eventsData as Event[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEvents(sortedEvents);
      setFilteredEvents(sortedEvents);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by type
    if (activeFilter !== 'All') {
      filtered = filtered.filter(event => 
        event.type === activeFilter.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  }, [activeFilter, events]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.3 }
    }
  };

  const getFilterColor = (type: EventType) => {
    switch (type) {
      case 'Workshop':
        return activeFilter === type 
          ? 'bg-blue-500/30 text-blue-300 border-blue-500/50' 
          : 'hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/30';
      case 'Competition':
        return activeFilter === type 
          ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50' 
          : 'hover:bg-yellow-500/20 hover:text-yellow-300 hover:border-yellow-500/30';
      case 'Meeting':
        return activeFilter === type 
          ? 'bg-green-500/30 text-green-300 border-green-500/50' 
          : 'hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/30';
      case 'Social':
        return activeFilter === type 
          ? 'bg-purple-500/30 text-purple-300 border-purple-500/50' 
          : 'hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/30';
      default:
        return activeFilter === type 
          ? 'bg-white/20 text-white border-white/50' 
          : 'hover:bg-white/10 hover:text-white hover:border-white/30';
    }
  };

  const getTypeCount = (type: EventType) => {
    if (type === 'All') return events.length;
    return events.filter(event => event.type === type.toLowerCase()).length;
  };

  const separateEventsByTime = (events: Event[]) => {
    const now = new Date();
    const upcoming = events.filter(event => new Date(event.date) >= now);
    const past = events.filter(event => new Date(event.date) < now);
    
    return {
      upcoming: upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      past: past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  };

  const getEventStats = () => {
    const { upcoming, past } = separateEventsByTime(events);
    const workshops = events.filter(e => e.type === 'workshop').length;
    const competitions = events.filter(e => e.type === 'competition').length;
    const meetings = events.filter(e => e.type === 'meeting').length;
    
    return { upcoming: upcoming.length, past: past.length, workshops, competitions, meetings };
  };

  if (isLoading) {
    return (
      <section id="events" className="min-h-screen py-20 px-4 bg-gray-900/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-8 bg-gray-700/50 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-12 bg-gray-700/50 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-700/50 rounded mx-auto animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-lg" />
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-700/50 rounded" />
                    <div className="w-16 h-4 bg-gray-700/50 rounded" />
                  </div>
                </div>
                <div className="w-full h-6 bg-gray-700/50 rounded mb-2" />
                <div className="w-3/4 h-4 bg-gray-700/50 rounded mb-4" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-700/50 rounded" />
                  <div className="w-2/3 h-4 bg-gray-700/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const stats = getEventStats();
  const { upcoming, past } = separateEventsByTime(filteredEvents);

  return (
    <section id="events" className="min-h-screen py-20 px-4 bg-gray-900/10 backdrop-blur-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          variants={headerVariants} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-blue-400 mr-3" />
            <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm">
              Events & Activities
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Upcoming{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Events
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join us for workshops, competitions, and community gatherings. Stay connected with the latest 
            happenings in our game development community and enhance your skills through hands-on experiences.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="text-center p-4 rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.upcoming}</div>
            <div className="text-gray-300 text-sm font-medium">Upcoming</div>
          </div>
          
          <div className="text-center p-4 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats.workshops}</div>
            <div className="text-gray-300 text-sm font-medium">Workshops</div>
          </div>
          
          <div className="text-center p-4 rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.competitions}</div>
            <div className="text-gray-300 text-sm font-medium">Competitions</div>
          </div>
          
          <div className="text-center p-4 rounded-xl border border-gray-500/30 bg-gradient-to-br from-gray-500/10 to-gray-600/10 backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-400 mb-1">{stats.past}</div>
            <div className="text-gray-300 text-sm font-medium">Past Events</div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div variants={filterVariants} className="flex flex-wrap justify-center gap-4 mb-12">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-6 py-3 rounded-full border transition-all duration-300 font-medium
                         flex items-center gap-2 ${getFilterColor(type)}
                         ${activeFilter === type ? 'scale-105' : 'scale-100'}
                         text-gray-300 border-gray-600/50`}
            >
              <Filter className="w-4 h-4" />
              {type}
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {getTypeCount(type)}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center mb-8"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <h3 className="text-2xl font-bold text-white">Upcoming Events</h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm font-medium">
                  {upcoming.length}
                </span>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  isUpcoming={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Events Toggle */}
        {past.length > 0 && (
          <div className="mb-8">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="flex items-center space-x-3 mx-auto px-6 py-3 bg-gray-800/50 border border-gray-600/50 rounded-full hover:bg-gray-700/50 transition-all duration-300 group"
            >
              <Clock className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-gray-300 group-hover:text-white font-medium transition-colors">
                {showPastEvents ? 'Hide' : 'Show'} Past Events ({past.length})
              </span>
              <motion.div
                animate={{ rotate: showPastEvents ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </motion.div>
            </motion.button>
          </div>
        )}

        {/* Past Events */}
        {showPastEvents && past.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center mb-8"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <h3 className="text-2xl font-bold text-white">Past Events</h3>
                <span className="px-3 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-full text-sm font-medium">
                  {past.length}
                </span>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  isUpcoming={false}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No events found
            </h3>
            <p className="text-gray-500">
              Try selecting a different filter to see more events.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Don&apos;t miss out on our events!
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Stay connected with The Game Forge community and be the first to know about upcoming workshops, 
              competitions, and networking opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Notified
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                onClick={() => {
                  const applySection = document.getElementById('apply');
                  applySection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Join Our Club
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}