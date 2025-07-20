import { connectToDB } from "@/lib/mongodb";
import NewPharamName from "@/models/NewPharamName";


export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { clientName } = req.body;

    if ( !clientName) {
      return res.status(400).json({ error: "Pharam Name is required" });
    }

    try {
      // Check for duplicate
      const existingClient = await NewPharamName.findOne({  clientName });

      if (existingClient) {
        return res.status(409).json({ error: "Pharam already exists" });
      }

      // Create new client
      const client = await NewPharamName.create(req.body);
      return res.status(201).json(client);
    } catch (err) {
      console.error("Error creating client:", err);
      return res.status(500).json({ error: "Failed to create client" });
    }
  } 
  else if (req.method === "GET") {
    try {
      const clients = await NewPharamName.find().sort({ _id: -1 });
      return res.status(200).json(clients);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch clients" });
    }
  } 
  else {
    return res.status(405).end(); 
  }
}