import { Suspense } from 'react';
import fs from 'fs';
import path from 'path';
import { ApplicationSection } from '@/components/sections';
import { SectionTransition } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Join The Forge | THE GAME FORGE',
  description: 'Apply to join The Game Forge — a game development club at SRM IST KTR. Submit your credentials and start your game dev journey.',
};

function getApplicationStatus(): boolean {
  try {
    const configPath = path.join(process.cwd(), 'src/config/application.json');
    const fileContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(fileContent);
    return config.APPLICATION_OPEN === true;
  } catch (e) {
    console.error('Failed to read application config on recruitment page:', e);
  }
  return false;
}

export default function RecruitmentPage() {
  const isOpen = getApplicationStatus();

  return (
    <main id="main-content" tabIndex={-1}>
      <SectionTransition effect="slide-up" delay={0.1} intensity="dramatic">
        <ApplicationSection isOpen={isOpen} />
      </SectionTransition>
    </main>
  );
}
