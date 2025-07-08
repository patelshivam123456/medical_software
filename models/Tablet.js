import mongoose from 'mongoose';

const TabletSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, lowercase: true },
  packaging: { type: String, required: true, trim: true, lowercase: true },
  category: { type: String, trim: true },
  company: { type: String, trim: true },
  salt: { type: String, trim: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number },
  mg: { type: String, trim: true },
  batch: { type: String, trim: true },
  expiry: { type: String, trim: true },
}, {
  timestamps: true,
});

// Compound unique index to prevent duplicate name + packaging
TabletSchema.index({ name: 1, packaging: 1 }, { unique: true });

export default mongoose.models.Tablet || mongoose.model('Tablet', TabletSchema);
