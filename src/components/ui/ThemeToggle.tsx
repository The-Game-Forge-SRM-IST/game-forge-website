'use client';

import { Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { value: 'system' as const, icon: Monitor, label: 'System' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
  ];

  return (
    <div className="flex items-center bg-background-secondary/50 backdrop-blur-sm rounded-full p-1.5 border border-border-color/20 gap-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`relative p-2.5 rounded-full transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
            theme === value
              ? 'text-green-400'
              : 'text-text-muted hover:text-foreground'
          }`}
          aria-label={`Switch to ${label} theme`}
          title={`Switch to ${label} theme`}
        >
          <Icon className="w-5 h-5" />
          {theme === value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-green-400/10 rounded-full border border-green-400/20"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}