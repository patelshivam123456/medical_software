import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  productId: { type: String, required: true },
  product: { type: Object, required: true }, // includes name, companyName, batch, expiry, salt etc.
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  total: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
