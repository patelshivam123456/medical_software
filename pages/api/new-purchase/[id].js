import { connectToDB } from "@/lib/mongodb";
import NewPurchase from "@/models/NewPurchase";
import Tablet from "@/models/Tablet";

export default async function handler(req, res) {
    await connectToDB();
  
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ success: false, message: "Purchase ID is required" });
    }
  
    if (req.method === "GET") {
      try {
        const data = await NewPurchase.findById(id);
        if (!data) {
          return res.status(404).json({ success: false, message: "Purchase not found" });
        }
        return res.status(200).json({ success: true, message: "Purchase fetched successfully", data });
      } catch (err) {
        console.error("❌ Error fetching purchase:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch purchase" });
      }
    }
  
    if (req.method === "PUT") {
      try {
        const updated = await NewPurchase.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
          return res.status(404).json({ success: false, message: "Purchase not found" });
        }
        const failedTablets = [];
          
              // for (const item of updated.tablets) {
              //         const updated = await Tablet.updateOne(
              //           { batch: item.batch },
              //           { $inc: { strips: +(item.strips+item.free),
              //             quantity:item.quantity,
              //            } }
              //         );
              
              //         if (updated.modifiedCount === 0) {
              //           console.warn(`⚠️ Stock update skipped for: ${item.name} (${item.packing})`);
              //         }
              //       }
              for (const item of updated.tablets) {
                const tablet = await Tablet.findOne({ batch: item.batch });
              
                if (!tablet) {
                  console.warn(`⚠️ Tablet not found for batch: ${item.batch}`);
                  continue;
                }
              
                const newStrips = item.strips + item.free;
                const stripDiff = newStrips - tablet.strips;
                const qtyDiff = item.quantity - tablet.quantity;
              
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
        return res.status(200).json({ success: true, message: "Purchase updated successfully", data: updated });
      } catch (err) {
        console.error("❌ Error updating purchase:", err);
        return res.status(500).json({ success: false, message: "Failed to update purchase" });
      }
    }
  
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
