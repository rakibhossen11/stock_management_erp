// models/Session.js
import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Session || mongoose.model('Session', SessionSchema)