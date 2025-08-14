import { NextResponse } from 'next/server';
import achievementsData from '@/data/achievements.json';

export async function GET() {
  try {
    return NextResponse.json(achievementsData);
  } catch (error) {
    console.error('Error loading achievements data:', error);
    return NextResponse.json(
      { error: 'Failed to load achievements data' },
      { status: 500 }
    );
  }
}