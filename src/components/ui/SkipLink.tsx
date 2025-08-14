'use client';

import { useAccessibility } from '@/hooks/useAccessibility';

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ targetId, children, className = '' }: SkipLinkProps) {
  const { focusManagement } = useAccessibility();

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      focusManagement.announceLiveRegion(`Skipped to ${children}`, 'assertive');
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleSkip}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999]
        focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg
        focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        font-medium text-sm transition-all duration-200
        ${className}
      `}
    >
      {children}
    </a>
  );
}

export default SkipLink;