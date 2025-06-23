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
// export async function getSession() {
//   const cookieStore = cookies(); // Get cookie store
//   // console.log(cookieStore);
//   const sessionToken = cookieStore.get('sessionToken')?.value;
  
//   if (!sessionToken) return null;

//   try {
//     const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
//     await dbConnect();
//     const user = await User.findById(decoded.userId).select('-password');
    
//     if (!user) return null;
    
//     return {
//       user,
//       expires: new Date(decoded.exp * 1000),
//     };
//   } catch (error) {
//     console.error('Session verification failed:', error);
//     return null;
//   }
// }

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