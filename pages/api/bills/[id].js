// import { connectToDB } from "@/lib/mongodb";
// import Bill from "@/models/Bill";


// export default async function handler(req, res) {
//   await connectToDB();

//   if (req.method === 'GET') {
//     try {
//       const { id } = req.query;
//       const bill = await Bill.findOne({ billNo: id });
//       if (!bill) {
//         return res.status(404).json({ success: false, message: 'Bill not found' });
//       }
//       res.status(200).json({ success: true, bill });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   } else {
//     res.status(405).json({ success: false, message: 'Method Not Allowed' });
//   }
// }

import { connectToDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";
import Tablet from "@/models/Tablet";

export default async function handler(req, res) {
  await connectToDB();
  const { id } = req.query;

  // 🔍 GET Bill
  if (req.method === 'GET') {
    try {
      const bill = await Bill.findOne({ billNo: Number(id) });
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
      const deleted = await Bill.deleteOne({ billNo: Number(id) });
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
  if (req.method === 'PUT') {
    try {
      const updated = await Bill.findOneAndUpdate(
        { billNo: Number(id) },
        { $set: req.body },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Bill not found to update' });
      }
for (const item of updated.tablets) {
                const tablet = await Tablet.findOne({ batch: item.batch });
              
                if (!tablet) {
                  console.warn(`⚠️ Tablet not found for batch: ${item.batch}`);
                  continue;
                }
              
                const newStrips = item.strips + item.free;
                const stripDiff = newStrips - tablet.strips;
                const qtyDiff = item.lessquantity - tablet.quantity;
              
                const result = await Tablet.updateOne(
                  { batch: item.batch },
                  {
                    $inc: {
                      strips: stripDiff,
                      quantity: qtyDiff,
                    },
                  }
                );
              
                if (result.modifiedCount === 0) {
                  console.warn(`⚠️ Stock update skipped for: ${item.name} (${item.packing})`);
                }
              }
      return res.status(200).json({ success: true, message: 'Bill updated successfully', bill: updated });
    } catch (err) {
      console.error("PUT Error:", err);
      return res.status(500).json({ success: false, message: 'Failed to update bill' });
    }
  }

  // ⛔ Unsupported Method
  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
