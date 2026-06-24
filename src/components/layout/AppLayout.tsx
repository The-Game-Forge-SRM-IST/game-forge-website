'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // Determine active section based on the Next.js current pathname
  const activeSection = useMemo(() => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/projects')) return 'projects';
    if (pathname.startsWith('/smiths')) return 'smiths';
    if (pathname.startsWith('/events')) return 'events';
    if (pathname.startsWith('/recruitment')) return 'recruitment';
    if (pathname.startsWith('/contact')) return 'contact';
    return 'home';
  }, [pathname]);

  return (
    <div className="min-h-screen text-foreground relative dark">
      {/* Custom Gaming Cursor */}
      <CustomCursor />
      
      {/* Custom CSS Grid and Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-background">
        {/* Fine grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
        {/* Radial ambient glow centered on screen top/center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Ambient Rising Sparks */}
        <div className="sparks-container opacity-30">
          <div className="bg-spark" style={{ left: '8%', animationDelay: '0s', '--drift': '50px' } as any} />
          <div className="bg-spark" style={{ left: '22%', animationDelay: '3s', '--drift': '-30px' } as any} />
          <div className="bg-spark" style={{ left: '38%', animationDelay: '7s', '--drift': '60px' } as any} />
          <div className="bg-spark" style={{ left: '55%', animationDelay: '1.5s', '--drift': '-40px' } as any} />
          <div className="bg-spark" style={{ left: '72%', animationDelay: '9s', '--drift': '30px' } as any} />
          <div className="bg-spark" style={{ left: '88%', animationDelay: '4.5s', '--drift': '-60px' } as any} />
        </div>
      </div>

      {/* Navigation */}
      <Navigation activeSection={activeSection} />

      {/* Main Content */}
      <div className="pt-20 relative z-10 safe-area-inset-bottom">
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
