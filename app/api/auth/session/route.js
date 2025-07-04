import { getSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  // console.log('session route;',session);
  return NextResponse.json({session});
}