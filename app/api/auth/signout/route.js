// app/api/auth/signout/route.js
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  removeAuthCookie();
  return Response.json({ success: true, message: 'Logged out successfully' });
}

// import { NextResponse } from 'next/server';
// import { removeAuthCookie } from '@/lib/auth';

// export async function POST() {
//   const response = NextResponse.json(
//     { success: true, data: 'Logged out successfully' },
//     { status: 200 }
//   );
  
//   removeAuthCookie();
//   return response;
// }