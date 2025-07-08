// pages/api/client/index.js
import { connectToDB } from "@/lib/mongodb";
import Client from "@/models/Client";

export default async function handler(req, res) {
  await connectToDB();
  if (req.method === "POST") {
    try {
      const client = await Client.create(req.body);
      return res.status(201).json(client);
    } catch (err) {
      return res.status(500).json({ error: "Failed to create client" });
    }
  } else if (req.method === "GET") {
    const clients = await Client.find().sort({ _id: -1 });
    return res.status(200).json(clients);
  } else {
    return res.status(405).end();
  }
}
