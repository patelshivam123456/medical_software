import mongoose from 'mongoose';

const SaltSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  option: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Salt || mongoose.model('Salt', SaltSchema);
