'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, Trophy, Briefcase } from 'lucide-react';
import { AlumniCard } from '@/components/ui';
import { AlumniMember } from '@/types';
import alumniData from '@/data/alumni.json';

const stats = [
  {
    icon: GraduationCap,
    label: 'Alumni',
    value: '25+',
    description: 'Graduated members'
  },
  {
    icon: Briefcase,
    label: 'Companies',
    value: '15+',
    description: 'Top gaming companies'
  },
  {
    icon: Trophy,
    label: 'Achievements',
    value: '50+',
    description: 'Industry recognitions'
  },
  {
    icon: Users,
    label: 'Network',
    value: '100%',
    description: 'Career placement rate'
  }
];

export function AlumniSection() {
  const alumni = alumniData as AlumniMember[];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="alumni" className="relative py-20 bg-gray-800/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div 
            variants={titleVariants} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-600/30">
              <GraduationCap className="text-blue-400" size={20} />
              <span className="text-blue-400 font-medium">Our Alumni Network</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Where Our{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Alumni Shine
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our graduates have gone on to make significant impacts in the gaming industry, 
              working at top companies and creating innovative experiences that reach millions of players worldwide.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={statsVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={statItemVariants}
                className="text-center p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-blue-600/50 transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mb-4">
                  <stat.icon className="text-blue-400" size={24} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-400 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Alumni Grid */}
          <div className="space-y-8">
            <motion.div
              variants={titleVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Meet Our Distinguished Alumni
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                From indie developers to industry leaders, our alumni continue to push the boundaries 
                of game development and inspire the next generation of creators.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alumni.map((alumniMember, index) => (
                <AlumniCard
                  key={alumniMember.id}
                  alumni={alumniMember}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            variants={titleVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-green-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Join Our Legacy?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Start your journey with The Game Forge and become part of a network that&apos;s shaping the future of gaming.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => {
                const applySection = document.getElementById('apply');
                applySection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Apply Now</span>
              <GraduationCap size={20} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}