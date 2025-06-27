import mongoose from 'mongoose';


// Create a separate counter schema for auto-increment
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  taxRate: {
    type: Number,
    // required: true,
    min: 0,
    max: 1,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const saleSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    // required: true,
    unique: true,
    // index: true, // Improves query performance
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    // required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  items: [itemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    min: 0,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  terms: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'paid', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'debit', 'bank', 'check'],
    default: 'cash',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Sequential invoice number generator
saleSchema.pre('save', async function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
    return next();
  }

  try {
    // Get or create counter
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'invoiceNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Format as INV-00001, INV-00002, etc.
    this.invoiceNumber = `INV-${counter.seq.toString().padStart(5, '0')}`;
    next();
  } catch (error) {
    console.error('Error generating invoice number:', error);
    
    // Fallback to timestamp if counter fails
    this.invoiceNumber = `INV-${Date.now()}`;
    next();
  }
});

// Update `updatedAt` on document updates
saleSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);

export default Sale;