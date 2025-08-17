import Kharcha from "@/models/Kharcha";
import { connectToDB } from "@/lib/mongodb";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const { status, person, details } = req.query;
      const query = {};

      if (status && ["Pending", "Done"].includes(status)) query.status = status;
      if (person) query.personName = { $regex: person, $options: "i" };
      if (details) query.details = { $regex: details, $options: "i" };

      const items = await Kharcha.find(query)
        .sort({ date: -1, createdAt: -1 })
        .lean();

      return res.status(200).json({ success: true, data: items });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;

      // ✅ Validate required fields
      if (!body.details || !body.personName) {
        return res
          .status(400)
          .json({ success: false, message: "details and personName are required" });
      }

      const amount = Number(body.amount) || 0;
      const paidAmount = Number(body.paidAmount) || 0;
      const remainingAmount = Math.max(amount - paidAmount, 0);

      const doc = await Kharcha.create({
        date: body.date ? new Date(body.date) : new Date(),
        details: String(body.details).trim(),
        personName: String(body.personName).trim(),
        amount,
        paidAmount,
        remainingAmount,
        status: body.status === "Done" ? "Done" : "Pending",
      });

      return res.status(201).json({ success: true, data: doc });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
