import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { dbConnect } from "./dbConnect";
import User from "@/app/models/User";
import Session from "../models/Session";

const SESSION_EXPIRY_HOURS = 24;

// Configuration
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-strong-secret-key',
  expiresIn: '1d' // 1 day
}

// Verify password
export async function verifyPassword(password, hash) {
  if (!hash) throw new Error("No password hash provided");
  return await bcrypt.compare(password, hash);
}

export async function createSession(userId) {
  await dbConnect()
  
  const sessionId = uuidv4()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS)

  // Store session in database
  await Session.create({
    sessionId,
    userId,
    expiresAt
  })

  // Set cookie
  cookies().set('session_token', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return sessionId
}

export async function getSession() {
  try {
    await dbConnect()
    
    // Get session token from cookies
    // const sessionToken = cookies().get('session_token')?.value;
    const sessionToken = (await cookies()).get('session_token')?.value;
    
    if (!sessionToken) {
      console.log('No session token found')
      return null
    }

    // Find session in database
    const session = await Session.findOne({ 
      sessionId: sessionToken,
      expiresAt: { $gt: new Date() } // Only not expired sessions
    }).populate('userId')

    if (!session) {
      console.log('Session not found or expired')
      return null
    }

    // Get user without password field
    const user = await User.findById(session.userId._id).select('-password')

    if (!user) {
      console.log('User not found for session')
      return null
    }

    return {
      user,
      expires: session.expiresAt,
      sessionId: session.sessionId
    }
  } catch (error) {
    console.error("Session verification failed:", error)
    return null
  }
}

export async function deleteSession() {
  try {
    await dbConnect()
    
    const sessionToken = cookies().get('session_token')?.value
    
    if (sessionToken) {
      // Remove session from database
      await Session.deleteOne({ sessionId: sessionToken })
      
      // Clear cookie
      cookies().delete('session_token')
    }
    
    return true
  } catch (error) {
    console.error("Failed to delete session:", error)
    return false
  }
}

// export async function createSession(userId) {
//   console.log(userId);
//   //  const sessionId = jwt.sign(
//   //   {
//   //     id: userId,
//   //   },
//   //   JWT_CONFIG.secret,
//   //   { expiresIn: JWT_CONFIG.   }
//   // )
//   // const sessionId = uuidv4();
//   const sessionId = userId;
//   const expiresAt = new Date();
//   expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);
//   // console.log(userId);
//   (await cookies()).set("session_token", sessionId, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     expires: expiresAt,
//     path: "/",
//   });
//   return sessionId;
// }

// Create session (stateless JWT)
// export async function createSession(userId) {
//   console.log(userId)
//   return jwt.sign(
//     { userId },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   );
//   // No database storage needed
// }

// Get current session
// export async function getSession() {
//   // console.log(cookies());
//   // const sessionToken = cookies().get('sessionToken')?.value;
//   const sessionToken = (await cookies()).get('session_token')?.value;
//   console.log(sessionToken);

//   if (!sessionToken) return null;

//   try {
//     await dbConnect();

//     // Verify user exists (but don't need to check session in DB)
//     const user = await User.findById(sessionToken.sessionId).select("-password");
//     console.log(user);

//     if (!user) return null;

//     return {
//       user,
//       expires: new Date(decoded.exp * 1000),
//     };
//   } catch (error) {
//     console.error("Session verification failed:", error);
//     return null;
//   }
// }

// Destroy session (just clear cookie)
// export async function destroySession() {
//   cookies().delete("sessionToken");
// }
