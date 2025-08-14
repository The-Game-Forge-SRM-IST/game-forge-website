'use client';

import { motion } from 'framer-motion';

interface PlaceholderSectionProps {
  id: string;
  title: string;
  description: string;
  bgColor?: string;
}

export default function PlaceholderSection({ 
  id, 
  title, 
  description, 
  bgColor = 'bg-gray-900/50' 
}: PlaceholderSectionProps) {
  return (
    <section id={id} className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
          <div className="mt-8">
            <span className="text-sm text-gray-500">
              Section content will be implemented in future tasks
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}