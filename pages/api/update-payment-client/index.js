// pages/api/update-payment-status.js
import { connectToDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connectToDB();
    const { billId, amountPaid } = req.body;

    if (!billId || amountPaid == null) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });

    const totalPaid = (bill.amountPaid || 0) + amountPaid;

    // ✅ Update amountPaid
    bill.amountPaid = totalPaid;

    // ✅ Only change status if full amount paid
    if (totalPaid >= bill.grandtotal) {
      bill.ordertype = "Cash";
      bill.paymentDate = new Date();
    }

    await bill.save();

    return res.json({ success: true, message: "Payment updated successfully" });
  } catch (err) {
    console.error("❌ Payment update error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}
