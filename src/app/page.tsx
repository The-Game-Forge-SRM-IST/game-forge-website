import { Suspense } from 'react';
import { HeroSection, AchievementsSection, GallerySection } from '@/components/sections';
import { PageTransition, SectionTransition, HeroSkeleton, GridSkeleton } from '@/components/ui';
import AccessibilityTester from '@/components/ui/AccessibilityTester';
import NoSSR from '@/components/ui/NoSSR';
import { GalleryImage } from '@/types';
import galleryData from '@/data/gallery.json';

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<HeroSkeleton />}>
        <PageTransition type="gaming" delay={0}>
          <HeroSection />
        </PageTransition>
      </Suspense>
      
      <Suspense fallback={<GridSkeleton count={4} className="container mx-auto px-4 py-16" />}>
        <SectionTransition effect="zoom" delay={0.1} intensity="dramatic">
          <AchievementsSection />
        </SectionTransition>
      </Suspense>
      
      <Suspense fallback={<GridSkeleton count={12} className="container mx-auto px-4 py-16" />}>
        <SectionTransition effect="gaming" delay={0.2} intensity="subtle">
          <GallerySection images={galleryData as GalleryImage[]} />
        </SectionTransition>
      </Suspense>
      
      <NoSSR>
        <AccessibilityTester />
      </NoSSR>
    </main>
  );
}
