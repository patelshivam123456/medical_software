import { connectToDB } from "@/lib/mongodb";
import PurchaseReturn from "@/models/PurchaseReturn";
import NewPurchase from "@/models/NewPurchase";
import Tablet from "@/models/Tablet";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    try {
      const {
        originalPurchaseId,
        tablets,
        clientName,
        grandtotal,
        salesperson,paymenttype,ordertype,orderid,invoiceDate,discount,gst,cgst,sgst,mobile,branch,branchName,
        address1,address2,pinCode,state,amountPaid,paymentDate,returnDate
      } = req.body;

      // Generate new returnBillNo
      const last = await PurchaseReturn.findOne().sort({ returnBillNo: -1 });
      const returnBillNo = last ? last.returnBillNo + 1 : 1;

      const returnEntry = new PurchaseReturn({
        returnBillNo,
        originalPurchaseId,
        tablets,
        clientName,
        grandtotal,
        salesperson,paymenttype,ordertype,orderid,invoiceDate,discount,gst,cgst,sgst,mobile,branch,branchName,
        address1,address2,pinCode,state,amountPaid,paymentDate,returnDate       
      });

      await returnEntry.save();

     

    for (const item of tablets) {
        const currentTablet = await Tablet.findOne({ batch: item.batch });
      
        if (!currentTablet) continue;
      
        const returnStrips = item.strips + item.free;
        const returnQty = item.quantity;
      
        // Avoid going negative
        const updatedStrips = Math.max(currentTablet.strips - returnStrips, 0);
        const updatedQty = Math.max(currentTablet.quantity - returnQty, 0);
      
        await Tablet.updateOne(
          { batch: item.batch },
          {
            $set: {
              strips: updatedStrips,
              quantity: updatedQty,
            },
          }
        );
      }
      

      const original = await NewPurchase.findById(originalPurchaseId);

      if (original) {
        const updatedTablets = original.tablets.map((orig) => {
          const returned = tablets.find((t) => t.batch === orig.batch);
          if (!returned) return orig;

          return {
            ...orig,
            quantity: orig.quantity - returned.quantity,
            strips: orig.strips - returned.strips,
            total: orig.total - returned.total,
            free:orig.free-returned.free,
          };
        });

        const newGrandTotal = updatedTablets.reduce((acc, t) => acc + (t.total || 0), 0);

        original.tablets = updatedTablets;
        original.grandtotal = newGrandTotal;
        await original.save();
      }

      return res.status(200).json({ success: true, message: "Return created successfully", returnEntry });
    } catch (err) {
      console.error("❌ Return API error:", err);
      return res.status(500).json({ success: false, message: "Failed to create return entry" });
    }
  }

  if (req.method === "GET") {
    try {
      const returns = await PurchaseReturn.find()
        .sort({ createdAt: -1 })
        .populate("originalPurchaseId"); // Populate full NewPurchase document

      return res.status(200).json({
        success: true,
        bills: returns.map((entry) => ({
          _id: entry._id,
          returnBillNo: entry.returnBillNo,
          clientName: entry.clientName,
          invoiceDate: entry.invoiceDate,
          paymenttype: entry.paymenttype,
          ordertype: entry.ordertype,
          grandtotal: entry.grandtotal,
          tablets: entry.tablets,
          originalPurchase: entry.originalPurchaseId, // full bill
          createdAt: entry.createdAt,
        })),
      });
    } catch (err) {
      console.error("❌ Error in GET PurchaseReturn:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch return entries" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
