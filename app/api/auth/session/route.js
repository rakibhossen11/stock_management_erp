import { getSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';


// user session route
export async function GET() {
  const session = await getSession();
  return NextResponse.json({session});
}