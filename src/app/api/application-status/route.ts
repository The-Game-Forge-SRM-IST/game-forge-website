import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'src/config/application.ts');
    const fileContent = fs.readFileSync(configPath, 'utf8');
    const match = fileContent.match(/APPLICATION_OPEN\s*:\s*(true|false)/);
    if (match) {
      const isOpen = match[1] === 'true';
      return NextResponse.json(
        { isOpen },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }
  } catch (e) {
    console.error('Failed to read dynamic application config:', e);
  }
  // Default fallback
  return NextResponse.json(
    { isOpen: false },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}
