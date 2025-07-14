import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();

  const {
    query: { id },
    method,
  } = req;

  if (method === 'GET') {
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      return res.status(200).json(order);
    } catch (err) {
      console.error("GET order by ID error:", err);
      return res.status(500).json({ message: "Failed to fetch order", error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
