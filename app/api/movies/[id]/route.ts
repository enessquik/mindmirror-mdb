import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Movie from '@/models/Movie';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Increment views
    movie.views += 1;
    await movie.save();

    return NextResponse.json({ success: true, movie });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch movie' },
      { status: 500 }
    );
  }
}
