import { NextResponse } from 'next/server';
import alumniData from '@/data/alumni.json';

export async function GET() {
  try {
    return NextResponse.json(alumniData);
  } catch (error) {
    console.error('Error loading alumni data:', error);
    return NextResponse.json(
      { error: 'Failed to load alumni data' },
      { status: 500 }
    );
  }
}