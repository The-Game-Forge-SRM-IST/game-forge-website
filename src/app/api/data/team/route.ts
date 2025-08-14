import { NextResponse } from 'next/server';
import teamData from '@/data/team.json';

export async function GET() {
  try {
    return NextResponse.json(teamData);
  } catch (error) {
    console.error('Error loading team data:', error);
    return NextResponse.json(
      { error: 'Failed to load team data' },
      { status: 500 }
    );
  }
}