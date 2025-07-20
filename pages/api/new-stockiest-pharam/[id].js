import { connectToDB } from "@/lib/mongodb";
import NewPharamName from "@/models/NewPharamName";


export default async function handler(req, res) {
  await connectToDB();
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await NewPharamName.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete Pharam Name" });
    }
  }

  if (req.method === "PUT") {
    try {
      const updatedNewPharamName = await NewPharamName.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedNewPharamName) {
        return res.status(404).json({ error: "Pharam Name not found" });
      }

      return res.status(200).json(updatedNewPharamName);
    } catch (err) {
      return res.status(400).json({ error: "Failed to update Pharam Name", details: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
