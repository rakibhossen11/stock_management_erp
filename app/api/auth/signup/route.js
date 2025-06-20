import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  await dbConnect();

  try {
    const { name, email, password } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    const response = NextResponse.json(
      { success: true, data: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );
    
    setAuthCookie(token);
    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}