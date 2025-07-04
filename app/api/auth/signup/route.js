// app/api/auth/signup/route.js
import User from "@/app/models/User";
import { dbConnect } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import { createSession } from "@/app/lib/auth";

export async function POST(request) {
  // database connection
  await dbConnect();
  try {
    // get data from client
    const { name, email, password } = await request.json();
    console.log(name, email, password);

    // require fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return Response.json(
        { success: false, message: "Email already in use" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({ name, email, password });
    console.log(user);

    // Create session
    await createSession(user._id);

    return NextResponse.json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        userCode: user.userId, 
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
