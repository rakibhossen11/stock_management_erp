import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';
import { getAuthToken, verifyToken } from '@/app/lib/jwt';

export async function GET(request) {
  await dbConnect();

  try {
    const token = getAuthToken();
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Not authorized' },
      { status: 401 }
    );
  }
}