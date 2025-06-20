import { cookies } from 'next/headers';

export const setAuthCookie = (token) => {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/'
  });
};

export const getAuthToken = () => {
  return cookies().get('token')?.value;
};

export const removeAuthCookie = () => {
  cookies().delete('token');
};