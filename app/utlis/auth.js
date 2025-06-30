// // utils/auth.js
// import jwt from 'jsonwebtoken';
// import User from '../models/User';
// import { dbConnect } from '../lib/dbConnect';
// import { cookies } from 'next/headers';

// export const getSession = async (request) => {
//   try {
//     // Get token from request cookies
//     const token = request.cookies.get('token')?.value;
    
//     if (!token) return null;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');
    
//     if (!user) return null;
    
//     return { user };
//   } catch (err) {
//     return null;
//   }
// };

// export const verifyToken = async (token) => {
//   await dbConnect();
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const user = await User.findById(decoded.id);
//   if (!user) throw new Error('User not found');
//   return user;
// };