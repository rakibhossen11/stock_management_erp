import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});


export default mongoose.models.Categories || mongoose.model('Categories', categorySchema);