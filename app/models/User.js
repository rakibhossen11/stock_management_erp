// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Create a separate counter schema for auto-increment
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, // Will store user_#00001 format
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' }, // Added more roles
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }, // Track last login
  isActive: { type: Boolean, default: true } // For soft deletion
});

// Middleware to auto-generate userId before saving
userSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    // Increment the counter
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    // Format the ID with leading zeros
    this.userId = `user_#${String(counter.seq).padStart(5, '0')}`;
    
    // Hash password if modified
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for public profile (excludes sensitive data)
userSchema.virtual('profile').get(function() {
  return {
    userId: this.userId,
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt
  };
});

export default mongoose.models.User || mongoose.model('User', userSchema);