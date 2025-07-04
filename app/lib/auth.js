import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "./dbConnect";
import User from "@/app/models/User";
import Session from "../models/Session";

// session time
const SESSION_EXPIRY_HOURS = 24;

// Verify password
export async function verifyPassword(password, hash) {
  if (!hash) throw new Error("No password hash provided");
  return await bcrypt.compare(password, hash);
}

// create session when user login or register
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

// user get with session
export async function getSession() {
  try {
    await dbConnect()
    
    // Get session token from cookies
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

// user logout syatem with session
export async function deleteSession() {
  try {
    await dbConnect()
    
    // const sessionToken = cookies().get('session_token')?.value;
    const sessionId = (await cookies()).get('session_token').value;
    
    if (sessionId) {
      // Remove session from database
      await Session.deleteOne({ sessionId: sessionId })
      
      // Clear cookie
      cookies().delete('session_token')
    }
    
    return true
  } catch (error) {
    console.error("Failed to delete session:", error)
    return false
  }
}
