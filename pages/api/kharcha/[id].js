import Kharcha from "@/models/Kharcha";
import { connectToDB } from "@/lib/mongodb";

export default async function handler(req, res) {
  await connectToDB();

  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const item = await Kharcha.findById(id);
      if (!item) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      return res.status(200).json({ success: true, data: item });
    }

    if (req.method === "PUT") {
      const body = req.body;

      const amount = Number(body.amount);
      const paidAmount = Number(body.paidAmount);
      const remainingAmount = Math.max(
        (isNaN(amount) ? 0 : amount) - (isNaN(paidAmount) ? 0 : paidAmount),
        0
      );

      const update = {
        date: body.date ? new Date(body.date) : undefined,
        details: body.details,
        personName: body.personName,
        amount: isNaN(amount) ? undefined : amount,
        paidAmount: isNaN(paidAmount) ? undefined : paidAmount,
        remainingAmount,
        status: body.status === "Done" ? "Done" : "Pending",
      };

      Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

      const updated = await Kharcha.findByIdAndUpdate(id, update, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      return res.status(200).json({ success: true, data: updated });
    }

    if (req.method === "DELETE") {
      const deleted = await Kharcha.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      return res.status(200).json({ success: true, data: deleted });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}
