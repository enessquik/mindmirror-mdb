import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Movie from '@/models/Movie';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 500);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);

    let query: any = {};

    if (category && category !== 'trending') {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let movies;
    if (category === 'trending') {
      movies = await Movie.find(query)
        .sort({ views: -1, rating: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      movies = await Movie.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    const total = await Movie.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      data: movies,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}
