'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  ChevronDown,
  BookOpen,
  Trophy,
  Coffee,
  Gamepad2
} from 'lucide-react';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  index: number;
  isUpcoming: boolean;
}

export default function EventCard({ event, index, isUpcoming }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
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
      case 'workshop':
        return <BookOpen className="w-5 h-5" />;
      case 'competition':
        return <Trophy className="w-5 h-5" />;
      case 'meeting':
        return <Users className="w-5 h-5" />;
      case 'social':
        return <Coffee className="w-5 h-5" />;
      default:
        return <Gamepad2 className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300';
      case 'competition':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300';
      case 'meeting':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300';
      case 'social':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300';
    }
  };

  const getStatusColor = () => {
    if (isUpcoming) {
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    } else {
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventSoon = () => {
    if (!isUpcoming) return false;
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="group"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-br ${getTypeColor(event.type)} 
                   backdrop-blur-sm border rounded-xl overflow-hidden
                   hover:shadow-2xl hover:shadow-black/50 transition-all duration-300
                   cursor-pointer relative`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Status Badge */}
        {isEventSoon() && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-medium animate-pulse">
              Soon
            </span>
          </div>
        )}

        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(event.type)} border`}>
                {getTypeIcon(event.type)}
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
                  {isUpcoming ? 'Upcoming' : 'Past Event'}
                </span>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTypeColor(event.type)} border-0`}>
                    {event.type}
                  </span>
                </div>
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

          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
            {event.title}
          </h3>
          
          <p className="text-gray-300 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{formatTime(event.time)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {/* Registration Button */}
          {isUpcoming && event.registrationUrl && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <motion.a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                           bg-gradient-to-r ${getTypeColor(event.type)} border hover:shadow-lg`}
                onClick={(e) => e.stopPropagation()}
              >
                <span>Register Now</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
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
              {/* Event Images */}
              {event.images && event.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.images.slice(0, 2).map((image, imgIndex) => (
                    <div key={imgIndex} className="relative h-32 rounded-lg overflow-hidden bg-gray-800/50">
                      <Image
                        src={image}
                        alt={`${event.title} - Image ${imgIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ))}
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Event Type
                  </h4>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(event.type)}
                    <span className="text-gray-300 capitalize">
                      {event.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Location
                  </h4>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                  About This Event
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {event.description}
                  {isUpcoming && (
                    <span className="block mt-2 text-xs text-gray-400">
                      Don&apos;t miss this opportunity to enhance your game development skills and connect with fellow developers!
                    </span>
                  )}
                </p>
              </div>

              {/* Registration Info */}
              {isUpcoming && event.registrationUrl && (
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
                  <h4 className="text-sm font-semibold text-green-300 mb-2 uppercase tracking-wider">
                    Registration Required
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Secure your spot for this event by registering in advance. Limited seats available!
                  </p>
                  <motion.a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg font-medium hover:bg-green-500/30 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Register Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    </motion.div>
  );
}