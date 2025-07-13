
import { connectToDB } from "@/lib/mongodb";
import ClientUser from "@/models/ClientUser";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { mobile, petName, newPassword } = req.body;
    const user = await ClientUser.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.petName !== petName) return res.status(401).json({ message: "Security answer incorrect" });
    user.password = newPassword;
    await user.save();
    return res.json({ message: "Password reset successful" });
  }

  if (req.method === "GET") {
    const users = await ClientUser.find().select("mobile petName lastLogin");
    return res.json(users);
  }

  res.status(405).end();
}