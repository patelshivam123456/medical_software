import { Schema, model, models } from "mongoose";

const KharchaSchema = new Schema(
  {
    date: { type: Date, required: true },
    details: { type: String, required: true, trim: true },
    personName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, required: true, min: 0 },
    remainingAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["Pending", "Done"], required: true },
  },
  { timestamps: true }
);

export default models.Kharcha || model("Kharcha", KharchaSchema);