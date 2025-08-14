import { NextResponse } from 'next/server';
import announcementsData from '@/data/announcements.json';

export async function GET() {
  try {
    return NextResponse.json(announcementsData);
  } catch (error) {
    console.error('Error loading announcements data:', error);
    return NextResponse.json(
      { error: 'Failed to load announcements data' },
      { status: 500 }
    );
  }
}