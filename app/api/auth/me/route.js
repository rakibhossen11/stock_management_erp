// app/api/auth/me/route.js
import { dbConnect } from '@/app/lib/dbConnect'; // Assuming you have a MongoDB connection helper
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get token from cookies (using Next.js 13+ cookies() API)
    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;
    
    if (!token) {
      console.error('No session token found in cookies');
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    // Validate user_id exists in token
    if (!decoded.user_id) {
      console.error('Token missing user_id:', decoded);
      return NextResponse.json(
        { success: false, message: 'Invalid token format' },
        { status: 401 }
      );
    }

    const { db } = await dbConnect();
    try {
      // Get user data with error handling
      console.log('Querying user with ID:', decoded.user_id);
      
      const user = await db.collection('users').findOne(
        { _id: decoded.user_id },
        {
          projection: {
            _id: 1,
            name: 1,
            email: 1,
            user_account_no: 1,
            created_at: 1,
            updated_at: 1
          }
        }
      );
      
      console.log('Query results:', user);

      if (!user) {
        console.error('No user found with ID:', decoded.user_id);
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      // Convert _id (ObjectId) to string for client-side
      const userData = {
        ...user,
        user_id: user._id.toString()
      };
      delete userData._id;

      console.log('Retrieved user data:', userData);

      return NextResponse.json({ 
        success: true, 
        data: userData 
      });
    } catch (queryError) {
      console.error('Database query failed:', queryError);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in /api/auth/me:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}