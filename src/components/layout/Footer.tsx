'use client';

import { motion } from 'framer-motion';
import { Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/105910279/',
      icon: Linkedin,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/the_game_forge/',
      icon: Instagram,
    },
  ];

  return (
    <footer className="bg-black/90 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Club Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-white">
                The Game <span className="text-green-400">Forge</span>
              </h3>
              <p className="text-gray-400 mt-2">
                A game development club at SRM IST KTR, fostering creativity and innovation
                in game development through collaboration and learning.
              </p>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>SRM IST KTR, Chennai</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>contact@gameforge.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="sr-only">{link.name}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-gray-400">
            © {currentYear} The Game Forge. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}