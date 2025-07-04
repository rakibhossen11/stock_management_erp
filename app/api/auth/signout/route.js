import { deleteSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';


// user signout route
export async function POST() {
  await deleteSession();
  return NextResponse.json({ success: true, message: 'Logged out successfully'});
}
