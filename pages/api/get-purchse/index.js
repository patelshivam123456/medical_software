import { connectToDB } from "@/lib/mongodb";
import NewPurchase from "@/models/NewPurchase";

export default async function handler(req, res) {
  try {
    await connectToDB();
    const purchases = await NewPurchase.find().sort({ createdAt: -1 });
    res.json({ success: true, purchases });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching purchases" });
  }
}