import { verifyPassword, createSession } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/app/models/User";
import { dbConnect } from "@/app/lib/dbConnect"; // MongoDB connection helper
import jwt from "jsonwebtoken";

export async function POST(request) {
  await dbConnect();
  try {
    const { email, password } = await request.json();
    console.log("from api", email, password);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    console.log("from api", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

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

    // return NextResponse.json({
    //   success: true,
    //   user: {
    //     user_id: user._id, // Convert ObjectId to string
    //     name: user.name,
    //     email: user.email,
    //     // user_account_no: user.user_account_no,
    //   },
    // })
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

// export async function POST(request) {
//   await dbConnect();
//   try {
//     const { email, password } = await request.json();
//     console.log("from api", email, password);

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     try {
//       const user = await User.findOne({ email });
// //     console.log( user);
//       console.log(user);

//       if (!user) {
//         return NextResponse.json(
//           { error: 'Invalid credentials' },
//           { status: 401 }
//         );
//       }

//       // Verify password
//       const isValid = await verifyPassword(password, user.password);
//       if (!isValid) {
//         return NextResponse.json(
//           { error: 'Invalid credentials' },
//           { status: 401 }
//         );
//       }

//        // Create token
//     // const token = jwt.sign(
//     //   { userId, email },
//     //   process.env.JWT_SECRET,
//     //   { expiresIn: '7d' }
//     // );

//     // Create tokent
//     const token = jwt.sign(
//       { userId: user._id.toString(), email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     )

//     console.log(cookies);
//     console.log(token);
//     // Set cookie
//     cookies().set('authToken', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60 * 24 * 7,
//       path: '/',
//       sameSite: 'lax',
//     });

//     //   const token = jwt.sign(
//     //   { userId: user._id },
//     //   process.env.JWT_SECRET,
//     //   { expiresIn: '7d' }
//     // );

//       // Create session - using user._id (MongoDB's ObjectId)
//       // await createSession(user._id);

//       return NextResponse.json({
//         success: true,
//         user: {
//           user_id: user._id, // Convert ObjectId to string
//           name: user.name,
//           email: user.email,
//           // user_account_no: user.user_account_no,
//         },
//         token
//       });
//     } catch (error) {
//       console.error('Login error:', error);
//       return NextResponse.json(
//         { error: 'Login failed' },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Login failed' },
//       { status: 500 }
//     );
//   }
// }
