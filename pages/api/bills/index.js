import { connectToDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";
import Tablet from "@/models/Tablet";

export default async function handler(req, res) {
  try {
    await connectToDB();
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

  if (req.method === "POST") {
    try {
      const { salesperson,paymenttype,ordertype,orderid, dispatchDate,tablets, discount = 0,gst=0 ,cgst = 0, sgst = 0,title,clientName,mobile,branch,branchName,address1,address2,pinCode,state,strips } = req.body;

      // ✅ 1. Validate Request Body
      // if (!billNo || typeof billNo !== "string") {
      //   return res.status(400).json({ success: false, message: "Invalid or missing bill number" });
      // }

      if (!Array.isArray(tablets) || tablets.length === 0) {
        return res.status(400).json({ success: false, message: "At least one tablet is required" });
      }

       const latest = await Bill.findOne().sort({ billNo: -1 });
       const nextBillNo = latest ? latest.billNo + 1 : 1;

      // ✅ 2. Check if Bill Already Exists
      const existingBill = await Bill.findOne({ nextBillNo });
      if (existingBill) {
        return res.status(409).json({ success: false, message: `Bill with number ${nextBillNo} already exists` });
      }

      // ✅ 3. Validate Stock Availability
      for (const item of tablets) {
        if (!item.name || !item.packing || typeof item.quantity !== "number") {
          return res.status(400).json({ success: false, message: "Tablet data is incomplete" });
        }

        const tablet = await Tablet.findOne({ name: item.name, packaging: item.packing });
         
        if (!tablet) {
          return res.status(404).json({
            success: false,
            message: `Tablet not found: ${item.name} (${item.packing})`,
          });
        }

        if (tablet.quantity < (item.lessquantity+item.free)) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${item.name} (${item.packing}). Available: ${tablet.quantity}, Required: ${item.lessquantity}`,
          });
        }
      }

      // ✅ 4. Create Bill
      const bill = new Bill({ billNo:nextBillNo,salesperson,paymenttype,ordertype,orderid,dispatchDate,tablets, discount,gst, cgst, sgst,title,clientName,mobile,branch,branchName,address1,address2,pinCode,state,strips });

      try {
        await bill.save();
      } catch (saveError) {
        console.error("❌ Failed to save bill:", saveError);
        return res.status(500).json({ success: false, message: "Failed to save bill" });
      }

      // ✅ 5. Update Tablet Stock
      for (const item of tablets) {
        const updated = await Tablet.updateOne(
          { batch: item.batch },
          { $inc: { strips:-(item.strips+item.free),
            quantity: -item.lessquantity } }
        );

        if (updated.modifiedCount === 0) {
          console.warn(`⚠️ Stock update skipped for: ${item.name} (${item.packing})`);
        }
      }

      return res.status(201).json({ success: true, message: "Bill created", bill });

    } catch (err) {
      console.error("❌ Unexpected error during POST /api/bills:", err);
      return res.status(500).json({ success: false, message: "Unexpected server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const bills = await Bill.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, bills });
    } catch (err) {
      console.error("❌ Failed to fetch bills:", err);
      return res.status(500).json({ success: false, message: "Failed to retrieve bills" });
    }
  }

  // ✅ 6. Handle Unsupported Methods
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
