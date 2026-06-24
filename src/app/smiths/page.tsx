import { Suspense } from 'react';
import { TeamSection } from '@/components/sections';
import { SectionTransition, GridSkeleton } from '@/components/ui';

export const metadata = {
  title: 'The Smiths | THE GAME FORGE',
  description: 'Meet the team behind The Game Forge — developers, designers, and leaders at SRM IST KTR.',
};

export default function SmithsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<GridSkeleton count={6} className="container mx-auto px-4 py-16" />}>
        <SectionTransition effect="gaming" delay={0.1} intensity="normal">
          <TeamSection />
        </SectionTransition>
      </Suspense>
    </main>
  );
}
