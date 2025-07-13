import { connectToDB } from "@/lib/mongodb";
import ClientUser from "@/models/ClientUser";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { name, mobile, password, petName } = req.body;
    const exists = await ClientUser.findOne({ mobile });
    if (exists) return res.status(409).json({ message: "User exists" });
    const user = await ClientUser.create({ name, mobile, password, petName });
    return res.status(201).json({ message: "Registered", userId: user._id });
  }

  if (req.method === "GET") {
    const users = await ClientUser.find().select("-password");
    return res.json(users);
  }

  res.status(405).end();
}