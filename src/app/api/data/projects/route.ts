import { NextResponse } from 'next/server';
import projectsData from '@/data/projects.json';

export async function GET() {
  try {
    return NextResponse.json(projectsData);
  } catch (error) {
    console.error('Error loading projects data:', error);
    return NextResponse.json(
      { error: 'Failed to load projects data' },
      { status: 500 }
    );
  }
}