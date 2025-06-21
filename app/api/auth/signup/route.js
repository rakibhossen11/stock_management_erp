// app/api/users/create/route.js
import { getCollection } from '@/app/lib/dbConnect';
import { hashPassword } from '@/app/lib/auth';

export async function POST(request) {
  try {
    const usersCollection = await getCollection('users'); // Using custom collection
    
    const { username, email, password } = await request.json();
    
    // Check if user exists
    const existingUser = await usersCollection.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return Response.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const hashedPassword = await hashPassword(password);
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    });
    
    return Response.json({
      success: true,
      userId: result.insertedId,
      message: 'User created successfully'
    });
    
  } catch (error) {
    console.error('User creation error:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}