
import { connectToDB } from "@/lib/mongodb";
import ClientUser from "@/models/ClientUser";


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { mobile, petName } = req.body;

  await connectToDB();
  const user = await ClientUser.findOne({ mobile });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.petName !== petName) return res.status(401).json({ message: "Incorrect pet name" });

  res.json({ message: "Verified" });
}
