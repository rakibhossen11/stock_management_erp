// app/api/auth/signup/route.js
import User from '@/app/models/User';
import { createToken, setAuthCookie } from '@/app/lib/auth';
import { dbConnect } from '@/app/lib/dbConnect';
import  jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  
  try {
    const { name, email, password } = await request.json();
    console.log(name,email,password);
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser)
    if (existingUser) {
      return Response.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await User.create({ name, email, password });
    console.log(user)
    
    // Generate token and set cookie
    // const token = createToken(user);
    // setAuthCookie(token);

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
    
  } catch (error) {
    return Response.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}