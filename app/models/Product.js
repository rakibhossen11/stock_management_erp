import mongoose from 'mongoose';

// Create a counter model for product codes
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productCode: { type: String, unique: true, uppercase: true }, // Changed from 'code' to 'productCode'
  description: String,
  category: { type: String, required: true },
  provider: String,
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }, // Changed from 'inStock' to 'stock'
  reorderLevel: Number,
  unit: String,
  barcode: String,
  images: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: Boolean, default: true }, // Changed from 'isActive' to 'status'
  profit: Number,
  taxAmount: Number,
  totalPrice: Number
}, { timestamps: true });

// Auto-generate product code before saving
productSchema.pre('save', async function(next) {
  if (!this.isNew || this.productCode) return next(); // Changed to check 'productCode' instead of 'code'
  
  try {
    // Get the next sequence number
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'productCode' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    // Generate the product code (PRO_0001, PRO_0002, etc.)
    this.productCode = `PRO_${counter.seq.toString().padStart(4, '0')}`; // Changed to set 'productCode'
    
    // Calculate derived fields
    this.profit = parseFloat((this.sellingPrice - this.purchasePrice).toFixed(2));
    this.taxAmount = parseFloat(((this.sellingPrice * this.taxRate) / 100).toFixed(2));
    this.totalPrice = parseFloat((this.sellingPrice + this.taxAmount).toFixed(2));
    
    next();
  } catch (err) {
    console.error('Error generating product code:', err);
    next(err);
  }
});

// Add index for better performance
productSchema.index({ productCode: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

export default mongoose.models.Product || mongoose.model('Product', productSchema);