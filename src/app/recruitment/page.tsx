import { Suspense } from 'react';
import fs from 'fs';
import path from 'path';
import { ApplicationSection } from '@/components/sections';
import { SectionTransition } from '@/components/ui';

export const dynamic = 'force-dynamic';

function getApplicationStatus(): boolean {
  try {
    const configPath = path.join(process.cwd(), 'src/config/application.ts');
    const fileContent = fs.readFileSync(configPath, 'utf8');
    const match = fileContent.match(/APPLICATION_OPEN\s*:\s*(true|false)/);
    if (match) {
      return match[1] === 'true';
    }
  } catch (e) {
    console.error('Failed to read dynamic application config on recruitment page:', e);
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
