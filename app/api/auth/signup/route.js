// app/api/auth/signup/route.js
import User from '@/models/User';
import { createToken, setAuthCookie } from '@/lib/auth';
import dbConnect from '@/lib/db';

export async function POST(request) {
  await dbConnect();
  
  try {
    const { name, email, password } = await request.json();
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await User.create({ name, email, password });
    
    // Generate token and set cookie
    const token = createToken(user);
    setAuthCookie(token);
    
    return Response.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email }
    });
    
  } catch (error) {
    return Response.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}

// import User from '@/app/models/User';
// import { createToken, setAuthCookie } from '@/app/lib/auth';
// import dbConnect from '@/app/lib/dbConnect';

// export async function POST(request) {
//   try {
//     await dbConnect();
    
//     const { name, email, password } = await request.json();
    
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return Response.json(
//         { success: false, message: 'Email already in use' },
//         { status: 400 }
//       );
//     }
    
//     // Create user
//     const user = await User.create({ name, email, password });
    
//     // Generate token
//     const token = createToken(user);
    
//     // Create response
//     const response = Response.json({
//       success: true,
//       // user: { id: user._id, name: user.name, email: user.email }
//       user: user,
//       message: 'User created successfully'
//     });
    
//     // Set cookie on the response
//     setAuthCookie(response, token);
    
//     return response;
    
//   } catch (error) {
//     console.error('Registration error:', error);
//     return Response.json(
//       { success: false, message: 'Registration failed', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // app/api/auth/signup/route.js
// import User from '@/app/models/User';
// import { createToken, setAuthCookie } from '@/app/lib/auth';
// import dbConnect from '@/app/lib/dbConnect';

// export async function POST(request) {
//   await dbConnect();
  
//   try {
//     const { name, email, password } = await request.json();
    
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     console.log(existingUser);
//     if (existingUser) {
//       return Response.json(
//         { success: false, message: 'Email already in use' },
//         { status: 400 }
//       );
//     }
    
//     // Create user
//     const user = await User.create({ name, email, password });
    
//     // Generate token and set cookie
//     const token = createToken(user);
//     setAuthCookie(token);
    
//     return Response.json({
//       success: true,
//       user: { id: user._id, name: user.name, email: user.email }
//     });
    
//   } catch (error) {
//     return Response.json(
//       { success: false, message: 'Registration failed' },
//       { status: 500 }
//     );
//   }
// }

// // app/api/users/create/route.js
// import { getCollection } from '@/app/lib/dbConnect';
// import { hashPassword } from '@/app/lib/auth';

// export async function POST(request) {
//   try {
//     const usersCollection = await getCollection('users'); // Using custom collection
    
//     const { username, email, password } = await request.json();
    
//     // Check if user exists
//     const existingUser = await usersCollection.findOne({ 
//       $or: [{ username }, { email }] 
//     });
    
//     if (existingUser) {
//       return Response.json(
//         { success: false, message: 'User already exists' },
//         { status: 400 }
//       );
//     }
    
//     // Create new user
//     const hashedPassword = await hashPassword(password);
//     const result = await usersCollection.insertOne({
//       username,
//       email,
//       password: hashedPassword,
//       role: 'user',
//       createdAt: new Date()
//     });
    
//     return Response.json({
//       success: true,
//       userId: result.insertedId,
//       message: 'User created successfully'
//     });
    
//   } catch (error) {
//     console.error('User creation error:', error);
//     return Response.json(
//       { success: false, message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }