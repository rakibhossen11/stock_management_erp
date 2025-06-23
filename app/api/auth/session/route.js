import { getSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  return NextResponse.json({ session });
}

// import { getSession } from '@/app/lib/auth';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     const session = await getSession();
//     console.log(session);
    
//     // if (!session) {
//     //   return NextResponse.json(
//     //     { success: false, error: 'Not authenticated' },
//     //     { status: 401 }
//     //   );
//     // }

//     return NextResponse.json(
//       { success: true, data: session },
//       { status: 200 }
//     );
    
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }