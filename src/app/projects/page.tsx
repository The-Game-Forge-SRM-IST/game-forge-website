import { Suspense } from 'react';
import { ProjectsSection } from '@/components/sections';
import { SectionTransition, GridSkeleton } from '@/components/ui';
import { Project, TeamMember } from '@/types';
import projectsData from '@/data/projects.json';
import teamData from '@/data/team.json';

export default function ProjectsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<GridSkeleton count={6} className="container mx-auto px-4 py-16" />}>
        <SectionTransition effect="slide-left" delay={0.1} intensity="normal">
          <ProjectsSection projects={projectsData as Project[]} teamMembers={teamData as TeamMember[]} />
        </SectionTransition>
      </Suspense>
    </main>
  );
}
