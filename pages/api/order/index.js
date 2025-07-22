import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();

  // ✅ CREATE ORDER
  if (req.method === 'POST') {
    try {
      const { registeredMobile, ...rest } = req.body;

      if (!registeredMobile) {
        return res.status(400).json({ message: "registeredMobile is required" });
      }

      const order = await Order.create({
        ...rest,
        registeredMobile,
      });

      return res.status(201).json(order);
    } catch (err) {
      console.error("POST /api/order error:", err);
      return res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
  }

  // ✅ UPDATE ORDER
//   if (req.method === "PATCH") {
//     const { orderId, data, registeredMobile } = req.body;

//     if (!orderId) {
//       return res.status(400).json({ message: "Order ID is required" });
//     }

//     try {
//       const updateData = { ...data };
//       if (registeredMobile) {
//         updateData.registeredMobile = registeredMobile;
//       }

//       await Order.findByIdAndUpdate(orderId, { $set: updateData });

//       return res.status(200).json({ message: "Order updated" });
//     } catch (err) {
//       console.error("PATCH error:", err);
//       return res.status(500).json({ message: "Update failed", error: err.message });
//     }
//   }

// if (req.method === "PATCH") {
//     const { orderId, data, registeredMobile } = req.body;
  
//     if (!orderId || !registeredMobile) {
//       return res.status(400).json({ message: "Order ID and registeredMobile required" });
//     }
  
//     try {
//       // Add registeredMobile in both places
//       const updateData = {
//         ...data,
//         registeredMobile,
//       };
  
//       if (data.personalDetails) {
//         updateData.personalDetails = {
//           ...data.personalDetails,
//           registeredMobile,
//         };
//       }
  
//       await Order.findByIdAndUpdate(orderId, { $set: updateData });
  
//       return res.status(200).json({ message: "Order updated" });
//     } catch (err) {
//       return res.status(500).json({ message: "Update failed", error: err.message });
//     }
//   }

  // ✅ GET ORDERS BY REGISTERED MOBILE
  if (req.method === "GET") {
    const { mobile } = req.query;
  
    if (!mobile) {
      return res.status(400).json({ message: "mobile (registeredMobile) is required in query params" });
    }
  
    try {
      const orders = await Order.find({
        registeredMobile: mobile,
        submitstatus: { $in: ["Pending", "Approved", "mark_delivery", "Complete","Cancel"] }
      }).sort({ createdAt: -1 });
  
      return res.status(200).json(orders);
    } catch (err) {
      console.error("GET error:", err);
      return res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
  }

  // ❌ Unsupported method
  return res.status(405).json({ message: "Method not allowed" });
}
