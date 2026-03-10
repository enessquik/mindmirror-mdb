import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Movie from '@/models/Movie';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const movies = await Movie.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, movies });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const data = await request.json();
    const movie = await Movie.create(data);

    return NextResponse.json({ success: true, movie }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create movie' },
      { status: 500 }
    );
  }
}
