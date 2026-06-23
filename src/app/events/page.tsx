import { Suspense } from 'react';
import { EventsSection, AnnouncementsSection } from '@/components/sections';
import { SectionTransition, GridSkeleton } from '@/components/ui';

export default function EventsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SectionTransition effect="slide-right" delay={0.1} intensity="normal">
        <EventsSection />
      </SectionTransition>
      
      <SectionTransition effect="glitch" delay={0.2} intensity="subtle">
        <AnnouncementsSection />
      </SectionTransition>
    </main>
  );
}
