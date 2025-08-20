import { Suspense } from 'react';
import { HeroSection, TeamSection, ProjectsSection, AchievementsSection, GallerySection, EventsSection, AnnouncementsSection, ApplicationSection, ContactSection } from '@/components/sections';
import { PageTransition, SectionTransition, HeroSkeleton, GridSkeleton } from '@/components/ui';
import AppWithLoading from '@/components/ui/AppWithLoading';
import AccessibilityTester from '@/components/ui/AccessibilityTester';
import NoSSR from '@/components/ui/NoSSR';
import { Project, TeamMember, GalleryImage } from '@/types';
import projectsData from '@/data/projects.json';
import teamData from '@/data/team.json';
import galleryData from '@/data/gallery.json';
import { LoadingProvider } from '@/providers/LoadingProvider';

export default function Home() {
  return (
    <LoadingProvider>
      <AppWithLoading>
        <main id="main-content" tabIndex={-1}>
          <Suspense fallback={<HeroSkeleton />}>
            <PageTransition type="gaming" delay={0}>
              <HeroSection />
            </PageTransition>
          </Suspense>
        
        <Suspense fallback={<GridSkeleton count={6} className="container mx-auto px-4 py-16" />}>
          <SectionTransition effect="gaming" delay={0.1} intensity="normal">
            <TeamSection />
          </SectionTransition>
        </Suspense>
        
        <Suspense fallback={<GridSkeleton count={6} className="container mx-auto px-4 py-16" />}>
          <SectionTransition effect="slide-left" delay={0.2} intensity="normal">
            <ProjectsSection projects={projectsData as Project[]} teamMembers={teamData as TeamMember[]} />
          </SectionTransition>
        </Suspense>
        
        <Suspense fallback={<GridSkeleton count={4} className="container mx-auto px-4 py-16" />}>
          <SectionTransition effect="zoom" delay={0.3} intensity="dramatic">
            <AchievementsSection />
          </SectionTransition>
        </Suspense>
        
        <Suspense fallback={<GridSkeleton count={12} className="container mx-auto px-4 py-16" />}>
          <SectionTransition effect="gaming" delay={0.4} intensity="subtle">
            <GallerySection images={galleryData as GalleryImage[]} />
          </SectionTransition>
        </Suspense>
        
        <SectionTransition effect="slide-right" delay={0.5} intensity="normal">
          <EventsSection />
        </SectionTransition>
        
        <SectionTransition effect="glitch" delay={0.6} intensity="subtle">
          <AnnouncementsSection />
        </SectionTransition>
        
        {/* Alumni Section - Commented out for now, will be used in the future */}
        {/* <SectionTransition effect="gaming" delay={0.7} intensity="normal">
          <AlumniSection />
        </SectionTransition> */}
        
        <SectionTransition effect="slide-up" delay={0.8} intensity="dramatic">
          <ApplicationSection />
        </SectionTransition>
        
          <SectionTransition effect="gaming" delay={0.9} intensity="normal">
            <ContactSection />
          </SectionTransition>
        </main>
        
        <NoSSR>
          <AccessibilityTester />
        </NoSSR>
      </AppWithLoading>
    </LoadingProvider>
  );
}
