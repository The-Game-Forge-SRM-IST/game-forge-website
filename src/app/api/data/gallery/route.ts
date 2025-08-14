import { NextResponse } from 'next/server';
import galleryData from '@/data/gallery.json';

export async function GET() {
  try {
    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Error loading gallery data:', error);
    return NextResponse.json(
      { error: 'Failed to load gallery data' },
      { status: 500 }
    );
  }
}