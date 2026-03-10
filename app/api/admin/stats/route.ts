import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Movie from '@/models/Movie';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalViews = await Movie.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const topMovies = await Movie.find()
      .sort({ views: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalViews: totalViews[0]?.total || 0,
      },
      recentUsers,
      topMovies,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
