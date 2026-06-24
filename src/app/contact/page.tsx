import { Suspense } from 'react';
import { ContactSection } from '@/components/sections';
import { SectionTransition } from '@/components/ui';

export const metadata = {
  title: 'Contact Us | THE GAME FORGE',
  description: 'Get in touch with The Game Forge at SRM IST KTR. Report bugs, establish partnerships, or inquire about collaborations.',
};

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SectionTransition effect="gaming" delay={0.1} intensity="normal">
        <ContactSection />
      </SectionTransition>
    </main>
  );
}
