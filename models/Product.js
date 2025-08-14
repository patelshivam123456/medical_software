// models/Product.js
import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: false, trim: true },
    salt: { type: String, required: false, trim: true },
    mrp: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile in dev
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);