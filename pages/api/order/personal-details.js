// pages/api/personal-details.js
import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();

  const { mobile } = req.query;

  if (!mobile) {
    return res.status(400).json({ message: "Mobile number required" });
  }

  try {
    const order = await Order.findOne({ registeredMobile: mobile })
      .sort({ createdAt: -1 })
      .select("personalDetails");

    if (!order || !order.personalDetails) {
      return res.status(404).json({ message: "No saved details found" });
    }

    return res.status(200).json(order.personalDetails);
  } catch (err) {
    console.error("GET /api/personal-details error:", err);
    return res.status(500).json({ message: "Error fetching personal details", error: err.message });
  }
}
