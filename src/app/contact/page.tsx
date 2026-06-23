import { Suspense } from 'react';
import { ContactSection } from '@/components/sections';
import { SectionTransition } from '@/components/ui';

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SectionTransition effect="gaming" delay={0.1} intensity="normal">
        <ContactSection />
      </SectionTransition>
    </main>
  );
}
