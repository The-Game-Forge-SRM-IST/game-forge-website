'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useState<Theme>('dark');
  const [resolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Always set dark theme
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add('dark');
    
    // Set dark theme CSS custom properties
    root.style.setProperty('--background', '#0a0a0a');
    root.style.setProperty('--foreground', '#ffffff');
    root.style.setProperty('--background-secondary', '#1a1a1a');
    root.style.setProperty('--background-tertiary', '#2a2a2a');
    root.style.setProperty('--border-color', '#374151');
    root.style.setProperty('--text-muted', '#9ca3af');
    root.style.setProperty('--text-secondary', '#d1d5db');
  }, [mounted]);

  const handleSetTheme = () => {
    // Theme is always dark, no-op
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}