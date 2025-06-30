import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  productCode: { type: String, unique: true },
  description: { type: String, default: "" },
  category: { type: String, required: true },
  provider: { type: String, default: "" },
  purchasePrice: { type: Number, required: true },
  price: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  reorderLevel: { type: Number, default: null },
  unit: { type: String, required: true },
  barcode: { type: String, default: "" },
  images: { type: [String], default: [] },
  creatorId: { type: String, required: true },
  status: { type: Boolean, default: true },
}, { timestamps: true });

export default models.Product || model('Product', ProductSchema);


// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     productCode: {
//       type: String,
//       require: true,
//     },
//     description: String,
//     category: { type: String, required: true },
//     provider: String,
//     purchasePrice: { type: Number, required: true },
//     price: { type: Number, required: true },
//     taxRate: { type: Number, default: 0 },
//     stock: { type: Number, default: 0 },
//     reorderLevel: Number,
//     unit: String,
//     barcode: String,
//     images: [String],
//     creatorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     status: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Product ||
//   mongoose.model("Product", productSchema);
