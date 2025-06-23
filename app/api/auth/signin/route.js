import { verifyPassword, createSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import { dbConnect } from '@/app/lib/dbConnect'; // MongoDB connection helper
import  jwt from 'jsonwebtoken';

export async function POST(request) {
  await dbConnect();
  try {
    const { email, password } = await request.json();
    console.log("from api", email, password);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      const user = await User.findOne({ email });
//     console.log( user);
      console.log(user);

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

      // Create session - using user._id (MongoDB's ObjectId)
      // await createSession(user._id);

      return NextResponse.json({
        success: true,
        user: {
          user_id: user._id, // Convert ObjectId to string
          name: user.name,
          email: user.email,
          // user_account_no: user.user_account_no,
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
