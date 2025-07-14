import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();

  // ✅ CREATE ORDER
 
  // ✅ UPDATE ORDER
  if (req.method === "PATCH") {
    const { orderId, data, registeredMobile } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    try {
      const updateData = { ...data };
      if (registeredMobile) {
        updateData.registeredMobile = registeredMobile;
      }

      await Order.findByIdAndUpdate(orderId, { $set: updateData });

      return res.status(200).json({ message: "Order updated" });
    } catch (err) {
      console.error("PATCH error:", err);
      return res.status(500).json({ message: "Update failed", error: err.message });
    }
  }


  // ❌ Unsupported method
  return res.status(405).json({ message: "Method not allowed" });
}
