import { connectToDB } from "@/lib/mongodb";
import Return from "@/models/Return";
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
      const {
        billNo,
        salesperson,
        paymenttype,
        ordertype,
        orderid,
        dispatchDate,
        returnperson,
        tablets,
        discount = 0,
        gst = 0,
        cgst = 0,
        sgst = 0,
        title,
        clientName,
        mobile,
        branch,
        branchName,
        address1,
        address2,
        pinCode,
        state,
      } = req.body;

      // ✅ 1. Validate Required Fields
      if (!Array.isArray(tablets) || tablets.length === 0) {
        return res.status(400).json({ success: false, message: "At least one tablet is required" });
      }

      // ✅ 2. Auto-generate unique newbillNo
      const latest = await Return.findOne().sort({ newbillNo: -1 });
      const nextBillNo = latest ? latest.newbillNo + 1 : 1;

      // ✅ 3. Check if newbillNo already exists (shouldn't happen, but safe)
      const existingBill = await Return.findOne({ newbillNo: nextBillNo });
      if (existingBill) {
        return res.status(409).json({
          success: false,
          message: `Return bill number ${nextBillNo} already exists. Please try again.`,
        });
      }

      // ✅ 4. Validate and check tablet stock
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

        const returnQty = Number(item.returnquantity);
        const soldQty = Number(tablet.lessquantity);

        if (!Number.isFinite(returnQty) || returnQty < 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid return quantity for ${item.name} (${item.packing})`,
          });
        }

        if (returnQty > soldQty) {
          return res.status(400).json({
            success: false,
            message: `Return quantity for ${item.name} (${item.packing}) exceeds sold quantity (${soldQty})`,
          });
        }
      }

      // ✅ 5. Save Return Bill
      const bill = new Return({
        billNo,
        newbillNo: nextBillNo,
        salesperson,
        paymenttype,
        ordertype,
        orderid,
        dispatchDate,
        returnperson,
        tablets,
        discount,
        gst,
        cgst,
        sgst,
        title,
        clientName,
        mobile,
        branch,
        branchName,
        address1,
        address2,
        pinCode,
        state,
      });

      try {
        await bill.save();
      } catch (saveError) {
        console.error("❌ Failed to save bill:", saveError);
        return res.status(500).json({ success: false, message: "Failed to save bill" });
      }

      // ✅ 6. Update stock (increase quantity)
      for (const item of tablets) {
        const qty = Number(item.returnquantity);

        if (!Number.isFinite(qty)) {
          console.warn(
            `⚠️ Skipping stock update for ${item.name} (${item.packing}) due to invalid returnquantity: ${item.returnquantity}`
          );
          continue;
        }

        const updated = await Tablet.updateOne(
          { name: item.name, packaging: item.packing },
          { $inc: { quantity: qty } }
        );

        if (updated.modifiedCount === 0) {
          console.warn(`⚠️ Stock update skipped for: ${item.name} (${item.packing})`);
        }
      }

      return res.status(201).json({
        success: true,
        message: "Return bill created successfully",
        newbillNo: nextBillNo,
        bill,
      });
    } catch (err) {
      console.error("❌ Unexpected error during POST /api/return:", err);
      return res.status(500).json({ success: false, message: "Unexpected server error" });
    }
  }

  // ✅ GET all return bills
  if (req.method === "GET") {
    try {
      const bills = await Return.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, bills });
    } catch (err) {
      console.error("❌ Failed to fetch return bills:", err);
      return res.status(500).json({ success: false, message: "Failed to retrieve return bills" });
    }
  }

  // ✅ Unsupported method
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
