import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const { movieId } = await request.json();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const index = user.watchlist.indexOf(movieId);
    if (index > -1) {
      user.watchlist.splice(index, 1);
    } else {
      user.watchlist.push(movieId);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      inWatchlist: index === -1,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update watchlist' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(decoded.userId).populate('watchlist');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      watchlist: user.watchlist,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}
