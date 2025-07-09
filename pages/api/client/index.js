import { connectToDB } from "@/lib/mongodb";
import Client from "@/models/Client";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { mobile } = req.body;

    if ( !mobile) {
      return res.status(400).json({ error: "Name and mobile are required" });
    }

    try {
      // Check for duplicate
      const existingClient = await Client.findOne({  mobile });

      if (existingClient) {
        return res.status(409).json({ error: "Mobile already exists" });
      }

      // Create new client
      const client = await Client.create(req.body);
      return res.status(201).json(client);
    } catch (err) {
      console.error("Error creating client:", err);
      return res.status(500).json({ error: "Failed to create client" });
    }
  } 
  else if (req.method === "GET") {
    try {
      const clients = await Client.find().sort({ _id: -1 });
      return res.status(200).json(clients);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch clients" });
    }
  } 
  else {
    return res.status(405).end(); // Method Not Allowed
  }
}