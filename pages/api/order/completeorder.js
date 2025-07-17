// /pages/api/order/approve.js

import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";
// import { verifyAdminToken } from "@/utils/auth";

export default async function handler(req, res) {
  await connectToDB();

  // Approve order (PUT method)
  if (req.method === "PUT") {
    // Uncomment and use this if you want admin token verification
    // const token = req.headers.authorization || "";
    // const isAdmin = await verifyAdminToken(token);
    // if (!isAdmin) {
    //   return res.status(403).json({ message: "Unauthorized: Admins only" });
    // }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Missing orderId" });
    }

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { submitstatus: "Complete" , statusUpdatedAt: new Date() },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: "Order Complete", status_code: 200 });
    } catch (err) {
      console.error("Error approving order:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get only approved orders (GET method)
  else if (req.method === "GET") {
    try {
        const completedOrders = await Order.find(
            { submitstatus: "Complete" },
          ).sort({ createdAt: -1 });
      return res.status(200).json(completedOrders);
    } catch (error) {
      console.error("Error fetching approved orders:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Unsupported method
  else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
