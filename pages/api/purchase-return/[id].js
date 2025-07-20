// // pages/api/purchase-return/[id].js
// import { connectToDB } from "@/lib/mongodb";
// import PurchaseReturn from "@/models/PurchaseReturn";

// export default async function handler(req, res) {
//   // Step 1: Connect to MongoDB
//   await connectToDB();

//   // Step 2: Get ID from URL
//   const { id } = req.query;

//   // Step 3: Handle GET Request
//   if (req.method === "GET") {
//     try {
//       // Use ID to find the return entry
//       const data = await PurchaseReturn.findById(id); // ✅ You can also use findOne({ returnBillNo: Number(id) })

//       // If not found
//       if (!data) {
//         return res.status(404).json({ success: false, message: "Return not found" });
//       }

//       // Step 4: Return the same response format as POST
//       return res.status(200).json({
//         success: true,
//         returnEntry: data
//       });
//     } catch (err) {
//       console.error("GET PurchaseReturn error:", err);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }
//   } else {
//     return res.status(405).json({ success: false, message: "Method not allowed" });
//   }
// }


import { connectToDB } from "@/lib/mongodb";
import PurchaseReturn from "@/models/PurchaseReturn";

export default async function handler(req, res) {
  await connectToDB();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const data = await PurchaseReturn.findById(id);

      if (!data) {
        return res.status(404).json({ success: false, message: "Return not found" });
      }

      return res.status(200).json({
        success: true,
        returnEntry: data,
      });
    } catch (err) {
      console.error("GET PurchaseReturn error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ✅ ADD THIS BLOCK TO SUPPORT DELETE REQUEST
  else if (req.method === "DELETE") {
    try {
      const deleted = await PurchaseReturn.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Return not found" });
      }

      return res.status(200).json({ success: true, message: "Return deleted" });
    } catch (err) {
      console.error("DELETE PurchaseReturn error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Method not allowed
  else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
