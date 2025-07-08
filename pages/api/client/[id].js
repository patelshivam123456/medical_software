import { connectToDB } from "@/lib/mongodb";
import Client from "@/models/Client";

export default async function handler(req, res) {
  await connectToDB();
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await Client.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete client" });
    }
  }

  if (req.method === "PUT") {
    try {
      const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedClient) {
        return res.status(404).json({ error: "Client not found" });
      }

      return res.status(200).json(updatedClient);
    } catch (err) {
      return res.status(400).json({ error: "Failed to update client", details: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
