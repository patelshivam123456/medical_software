import { connectToDB } from "@/lib/mongodb";
import NewPurchase from "@/models/NewPurchase";
import Tablet from "@/models/Tablet";

export default async function handler(req, res) {
  try {
    await connectToDB();
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }

//   if (req.method === "POST") {
//     try {
//       const {
//         oldbillNo, salesperson, paymenttype, ordertype, orderid, invoiceDate,
//         tablets, discount = 0, gst = 0, cgst = 0, sgst = 0,
//         title, clientName, mobile, branch, branchName,
//         address1, address2, pinCode, state, grandtotal
//       } = req.body;

//       // ✅ 1. Validate tablets array
//       if (!Array.isArray(tablets) || tablets.length === 0) {
//         return res.status(400).json({ success: false, message: "At least one tablet is required" });
//       }

//       // ✅ 2. Generate Next Bill No
//       const latest = await NewPurchase.findOne().sort({ billNo: -1 });
//       const nextBillNo = latest ? latest.billNo + 1 : 1;

//       // ✅ 3. Check if Bill Already Exists
//       const existingBill = await NewPurchase.findOne({ billNo: nextBillNo });
//       if (existingBill) {
//         return res.status(409).json({ success: false, message: `Bill with number ${nextBillNo} already exists` });
//       }

//       // ✅ 5. Create Bill
//       const bill = new NewPurchase({
//         billNo: nextBillNo,
//         oldbillNo,
//         salesperson,
//         paymenttype,
//         ordertype,
//         orderid,
//         invoiceDate,
//         tablets,
//         discount,
//         gst,
//         cgst,
//         sgst,
//         title,
//         clientName,
//         mobile,
//         branch,
//         branchName,
//         address1,
//         address2,
//         pinCode,
//         state,
//         grandtotal
//       });

//       try {
//         await bill.save();
//       } catch (saveError) {
//         console.error("❌ Failed to save bill:", saveError);
//         return res.status(500).json({ success: false, message: "Failed to save bill" });
//       }

//       // ✅ 6. Save new Tablet entries instead of updating stock
//       for (const item of tablets) {
//         const newTablet = new Tablet({
//           name: item.name?.trim().toLowerCase(),
//           packaging: item.packing?.trim().toLowerCase() || "strip", // fallback value
//           quantity: -(item.lessquantity + item.free || 0), // stock-out
//           purchase: item.purchase || item.rate || 0,
//           price: item.price || item.mrp || item.rate || 0,
//           batch: item.batch || '',
//           expiry: item.expiry || '',
//           mrp:item.mrp||'',
//           company:item.company||"",
//           salt:item.salt||"",
//           category:item.category||"",
//           quantity:item.quantity+item?.free||"",
//           mg:item.mg||""
//         });
      
//         try {
//           await newTablet.save();
//           console.log(`✅ Tablet saved: ${item.name}`);
//         } catch (err) {
//           console.error(`❌ Error saving tablet: ${item.name}`, err.message);
//         }
//       }

//       return res.status(201).json({ success: true, message: "Bill created", bill });

//     } catch (err) {
//       console.error("❌ Unexpected error during POST /api/bills:", err);
//       return res.status(500).json({ success: false, message: "Unexpected server error" });
//     }
//   }

if (req.method === "POST") {
    try {
      const {
        oldbillNo, salesperson, paymenttype, ordertype, orderid, invoiceDate,
        tablets, discount = 0, gst = 0, cgst = 0, sgst = 0,
        title, clientName, mobile, branch, branchName,
        address1, address2, pinCode, state, grandtotal,email,accountDetails,accountNumber,accountIfscCode,gstIn,amountPaid,paymentDate
      } = req.body;
  
      // ✅ 1. Validate tablets array
      if (!Array.isArray(tablets) || tablets.length === 0) {
        return res.status(400).json({ success: false, message: "At least one tablet is required" });
      }
  
      // ✅ 2. Generate Next Bill No
      const latest = await NewPurchase.findOne().sort({ billNo: -1 });
      const nextBillNo = latest ? latest.billNo + 1 : 1;
  
      // ✅ 3. Check if Bill Already Exists
      const existingBill = await NewPurchase.findOne({ billNo: nextBillNo });
      if (existingBill) {
        return res.status(409).json({ success: false, message: `Bill with number ${nextBillNo} already exists` });
      }
  
      // ✅ 4. Create and Save Bill
      const bill = new NewPurchase({
        billNo: nextBillNo,
        oldbillNo,
        salesperson,
        paymenttype,
        ordertype,
        orderid,
        invoiceDate,
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
        grandtotal,
        email,accountDetails,accountNumber,accountIfscCode,gstIn,amountPaid,paymentDate
      });
  
      try {
        await bill.save();
      } catch (saveError) {
        console.error("❌ Failed to save bill:", saveError);
        return res.status(500).json({ success: false, message: "Failed to save bill" });
      }
  
      // ✅ 5. Save Each Tablet Entry
      const failedTablets = [];
  
      for (const item of tablets) {
        const newTablet = new Tablet({
          name: item.name?.trim().toLowerCase(),
          packaging: item.packing?.trim().toLowerCase() || "strip",
          quantity: item.quantity,  // ✅ Fixed this line
          purchase: item.price || 0,
          price: item.rate  || 0,
          batch: item.batch || '',
          mg: item.mg||'',
          expiry: item.expiry || '',
          mrp: item.mrp || '',
          company: item.company || "",
          salt: item.salt || "",
          category: item.category || "",
          mg: item.mg || "",
          strips:(item.strips||0)+(item.free||0),
        });
  
        try {
          await newTablet.save();
          console.log(`✅ Tablet saved: ${item.name}`);
        } catch (err) {
          console.error(`❌ Error saving tablet: ${item.name}`, err);
          failedTablets.push({ name: item.name, error: err.message });
        }
      }
  
      return res.status(201).json({
        success: true,
        message: "Bill created",
        bill,
        failedTablets: failedTablets.length ? failedTablets : undefined
      });
  
    } catch (err) {
      console.error("❌ Unexpected error during POST /api/bills:", err);
      return res.status(500).json({ success: false, message: "Unexpected server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const bills = await NewPurchase.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, bills });
    } catch (err) {
      console.error("❌ Failed to fetch bills:", err);
      return res.status(500).json({ success: false, message: "Failed to retrieve bills" });
    }
  }
  if (req.method === "DELETE") {
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ success: false, message: "Missing purchase ID" });
    }
  
    try {
      const deleted = await NewPurchase.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Purchase not found" });
      }
  
      return res.status(200).json({ success: true, message: "Purchase deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting purchase:", err);
      return res.status(500).json({ success: false, message: "Failed to delete purchase" });
    }
  }

  // ✅ 7. Handle Unsupported Methods
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
