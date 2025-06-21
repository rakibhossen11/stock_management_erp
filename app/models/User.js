// models/User.js
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'system_users'  // Custom collection name
});

// Initialize connection and model
let User;
try {
  await dbConnect();
  User = mongoose.models.User || mongoose.model('User', userSchema);
} catch (err) {
  console.error('Failed to initialize User model:', err);
}

export default User;