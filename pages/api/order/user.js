import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();

  const { mobile } = req.query;
  if (!mobile) return res.status(400).json({ message: "Mobile number is required" });

  try {
    const orders = await Order.find({ "personalDetails.mobile": mobile }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch user orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
