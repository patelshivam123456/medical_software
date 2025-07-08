import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  option: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
