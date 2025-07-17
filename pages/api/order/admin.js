// import { connectToDB } from "@/lib/mongodb";
// import Order from "@/models/Order";

// export default async function handler(req, res) {
//   await connectToDB();

//   try {
//     const pendingOrders = await Order.find({ submitstatus: 'Pending' }).sort({ createdAt: -1 });
//     res.status(200).json(pendingOrders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch pending orders", error });
//   }
// }


import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();

  try {
    const pendingOrders = await Order.find({ submitstatus: 'Pending' }).sort({ createdAt: -1 }).lean();

    const transformedOrders = pendingOrders.map(order => ({
      ...order,
      dispatchDate: order.dispatchDate ? order.dispatchDate : ""  // ⬅️ Convert null/undefined to empty string
    }));

    res.status(200).json(transformedOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending orders", error });
  }
}
