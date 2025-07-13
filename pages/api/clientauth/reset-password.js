// === /pages/api/auth/reset-password.js ===

import { connectToDB } from "@/lib/mongodb";
import ClientUser from "@/models/ClientUser";



export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { mobile, newPassword } = req.body;
  await connectToDB();

  const user = await ClientUser.findOne({ mobile });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password reset successful" });
}
