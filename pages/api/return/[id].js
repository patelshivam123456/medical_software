import { connectToDB } from "@/lib/mongodb";
import Return from "@/models/Return";
import Tablet from "@/models/Tablet";
// import Bill from "@/models/Bill";

export default async function handler(req, res) {
  await connectToDB();
  const { id } = req.query;

  // 🔍 GET Bill
  if (req.method === 'GET') {
    try {
      const bill = await Return.findOne({ newbillNo: Number(id) });
      if (!bill) {
        return res.status(404).json({ success: false, message: 'Bill not found' });
      }
      return res.status(200).json({ success: true, bill });
    } catch (err) {
      console.error("GET Error:", err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // 🗑 DELETE Bill
  if (req.method === 'DELETE') {
    try {
      const deleted = await Return.deleteOne({ newbillNo: Number(id) });
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Bill not found to delete' });
      }
      return res.status(200).json({ success: true, message: 'Bill deleted successfully' });
    } catch (err) {
      console.error("DELETE Error:", err);
      return res.status(500).json({ success: false, message: 'Failed to delete bill' });
    }
  }

  // ✏️ PUT Update Bill
//   if (req.method === 'PUT') {
//     try {
//       const updated = await Return.findOneAndUpdate(
//         { newbillNo: Number(id) },
//         { $set: req.body },
//         { new: true }
//       );

//       if (!updated) {
//         return res.status(404).json({ success: false, message: 'Bill not found to update' });
//       }

//       return res.status(200).json({ success: true, message: 'Bill updated successfully', bill: updated });
//     } catch (err) {
//       console.error("PUT Error:", err);
//       return res.status(500).json({ success: false, message: 'Failed to update bill' });
//     }
//   }
if (req.method === 'PUT') {
    try {
      const id = req.query.id;
  
      // 1. Fetch the old return bill
      const oldBill = await Return.findOne({ newbillNo: Number(id) });
  
      if (!oldBill) {
        return res.status(404).json({ success: false, message: 'Bill not found to update' });
      }
  
      // 2. Revert OLD returnquantity from stock (decrease stock)
      for (const oldItem of oldBill.tablets) {
        const revertQty = Number(oldItem.returnquantity);
        if (!Number.isFinite(revertQty)) continue;
  
        await Tablet.updateOne(
          { batch: oldItem.batch },
          { $inc: { quantity: -revertQty } } // ✅ rollback old quantity
        );
      }
  
      // 3. Apply NEW returnquantity to stock (increase stock)
      for (const newItem of req.body.tablets) {
        const applyStr=Number(newItem.strips)
        const applyFree= Number(newItem.free)
        const applyQty = Number(newItem.returnquantity);
        if (!Number.isFinite(applyQty)) continue;
  
        await Tablet.updateOne(
          { batch: newItem.batch },
          { $inc: {strips:(applyStr+applyFree), quantity: applyQty } } // ✅ apply new quantity
        );
      }
  
      // 4. Update the return bill document
      const updated = await Return.findOneAndUpdate(
        { newbillNo: Number(id) },
        { $set: req.body },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: 'Bill updated successfully',
        bill: updated,
      });
  
    } catch (err) {
      console.error("PUT Error:", err);
      return res.status(500).json({ success: false, message: 'Failed to update bill' });
    }
  }
  
  // ⛔ Unsupported Method
  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
