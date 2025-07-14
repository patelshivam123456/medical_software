import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === 'POST') {
    try {
      const order = await Order.create(req.body);
      return res.status(201).json(order);
    } catch (err) {
      console.error("POST /api/order error:", err);
      return res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
  }

  if (req.method === 'PATCH') {
    const { orderId, data } = req.body;

    if (!orderId || !data) {
      return res.status(400).json({ message: 'Missing orderId or data' });
    }

    try {
      console.log("PATCH request payload:", { orderId, data });

      const updated = await Order.findByIdAndUpdate(
        orderId,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!updated) {
        console.warn("Order not found for ID:", orderId);
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(updated);
    } catch (err) {
      console.error("PATCH /api/order error:", err);
      return res.status(500).json({ message: 'Failed to update order', error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
