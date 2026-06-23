'use client';

import Link from 'next/link';
import { Terminal, Flame } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-t border-white/5 relative z-10 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
        <div className="flex flex-col gap-6 max-w-xs">
          <div className="flex items-center gap-3">
            <img
              alt="Logo"
              className="w-10 h-10 pixelated"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxZVETh4X_svRmDPTcf37f6591KVsra3YltQfjDIZnk6WwJN5OBr5S4psWyUOTZOFomUQzUQP6YlPaTlgA9t5DFSelaS_WZpN7OvrdNzc_HQKvhkFPXT9a6vKa8mJWezThEyq-9C4GFYddiiGXOXmuIUNZ85JvW_To-XdebYjdI5raZQm7SkN3Lbf0SGahVLV9el8ILOVSEm0676lNvJHhtR-bF4OS8HLzOCOoxP_EFH6sjOnlcyeX4dZnFYkJnJf4FXx4DYHs70Q"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="font-sans text-lg font-bold text-white uppercase tracking-tight">THE GAME FORGE</div>
          </div>
          <div className="text-[10px] text-outline-variant uppercase tracking-wider">
            © {currentYear} THE GAME FORGE. FOUNDRY_ACTIVE.
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 uppercase text-xs">
          <div className="flex flex-col gap-4">
            <span className="text-white/30 font-bold mb-1">Registry</span>
            <Link className="text-on-surface-variant hover:text-tertiary transition-colors" href="/projects">Archive</Link>
            <Link className="text-on-surface-variant hover:text-tertiary transition-colors" href="/smiths">Changelogs</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white/30 font-bold mb-1">Comms</span>
            <a className="text-on-surface-variant hover:text-tertiary transition-colors" href="https://instagram.com/the_game_forge" target="_blank" rel="noopener noreferrer">Instagram</a>
            <Link className="text-on-surface-variant hover:text-tertiary transition-colors" href="/events">Conclave</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white/30 font-bold mb-1">Liaison</span>
            <Link className="text-on-surface-variant hover:text-tertiary transition-colors" href="/recruitment">Join the Forge</Link>
            <Link className="text-on-surface-variant hover:text-tertiary transition-colors" href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex justify-between items-center pt-8 border-t border-white/5">
        <div className="flex gap-4">
          <a
            className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-tertiary hover:text-tertiary transition-colors"
            href="https://github.com/The-Game-Forge-SRM-IST"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Terminal className="w-5 h-5" />
          </a>
          <a
            className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-secondary-container hover:text-secondary-container transition-colors"
            href="https://www.linkedin.com/company/105910279/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Flame className="w-5 h-5" />
          </a>
        </div>
        <div className="text-xs text-white/20 uppercase tracking-widest">SYSTEMS_TEMP: 2400K</div>
      </div>
    </footer>
  );
}