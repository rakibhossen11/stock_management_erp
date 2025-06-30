// middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/login', '/register', '/'];
  
  // If trying to access protected route without token
  if (!publicRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token for protected routes
  if (!publicRoutes.includes(pathname)) {
    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // If logged in but trying to access auth pages
  if (publicRoutes.includes(pathname) && token) {
    try {
      await verifyToken(token);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};