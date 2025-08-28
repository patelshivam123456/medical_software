import mongoose from "mongoose";

const ItemListSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    company: String,
    mrp: Number,
    rate: Number,
    salt: String,
    image: String, // store path like /uploads/xxx.jpg
  },
  { timestamps: true }
);

export default mongoose.models.ItemList || mongoose.model("ItemList", ItemListSchema);
