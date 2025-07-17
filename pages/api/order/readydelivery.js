import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";
// import { verifyAdminToken } from "@/utils/auth";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "PUT") {
    const { orderId, dispatchDate } = req.body;

    if (!orderId || !dispatchDate) {
      return res.status(400).json({ message: "Missing orderId or dispatchDate" });
    }

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set: {
              submitstatus: "mark_delivery",
              dispatchDate
            }
          },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({
        message: "Order marked as delivered",
        status_code: 200,
        updatedOrder
      });
    } catch (err) {
      console.error("Error marking order as delivered:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET method — fetch all mark_delivery orders
  else if (req.method === "GET") {
    try {
      const deliveredOrders = await Order.find({ submitstatus: "mark_delivery" }).sort({ createdAt: -1 });
      return res.status(200).json(deliveredOrders);
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
