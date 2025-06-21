import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

// import { getSession } from '@/app/lib/auth';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   const session = await getSession();
//   return NextResponse.json({ session });
// }