import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { dbConnect } from './dbConnect';
import User from '@/app/models/User';

// Verify password
export async function verifyPassword(password, hash) {
  if (!hash) throw new Error('No password hash provided');
  return await bcrypt.compare(password, hash);
}


// This would be client-side code (e.g., in a React component)
// export function createSession(userId) {
//   const sessionId = uuidv4();
//   const expiresAt = new Date();
//   expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

//   const sessionData = {
//     sessionId,
//     userId,
//     expiresAt: expiresAt.toISOString()
//   };

//   // Store in localStorage
//   localStorage.setItem('session', JSON.stringify(sessionData));

//   return sessionId;
// }

// This would be client-side code (e.g., in a React component or Next.js client component)
// export function getSession() {
//   // Check if localStorage is available (important for SSR)
//   // if (typeof window === 'undefined') return null;
  
//   const sessionData = localStorage.getItem('session');
//   console.log(sessionData);
//   if (!sessionData) return null;

//   try {
//     const { sessionId, userId, expiresAt } = JSON.parse(sessionData);
    
//     // Check if session is expired
//     if (new Date(expiresAt) < new Date()) {
//       localStorage.removeItem('session');
//       return null;
//     }
    
//     return { sessionId, userId };
//   } catch (err) {
//     console.error('Invalid session data', err);
//     return null;
//   }
// }

// Create session (stateless JWT)
export async function createSession(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  // No database storage needed
}

// Get current session

export async function getSession() {
  console.log(cookies())
  const sessionToken = cookies().get('sessionToken')?.value;
  
  if (!sessionToken) return null;

  try {
    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
    await dbConnect();
    
    // Verify user exists (but don't need to check session in DB)
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) return null;
    
    return {
      user,
      expires: new Date(decoded.exp * 1000),
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

// Destroy session (just clear cookie)
export async function destroySession() {
  cookies().delete('sessionToken');
}