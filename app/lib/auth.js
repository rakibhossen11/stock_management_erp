import { cookies } from 'next/headers';

// lib/auth.js
import bcrypt from 'bcryptjs';

// Get the current session
export const getSession = async () => {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const { verifyToken } = await import('@/lib/jwt');
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Set authentication cookie
export const setAuthCookie = (token) => {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
};

// Remove authentication cookie
export const removeAuthCookie = () => {
  cookies().delete('token');
};

const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}