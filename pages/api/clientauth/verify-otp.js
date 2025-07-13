import { connectToDB } from "@/lib/mongodb";
import ClientOtp from "@/models/ClientOtp";
import ClientUser from "@/models/ClientUser";


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { mobile, otp, newPassword } = req.body;
  await connectToDB();

  const match = await ClientOtp.findOne({ mobile, otp });
  if (!match) return res.status(400).json({ message: "Invalid OTP" });

  const user = await ClientUser.findOne({ mobile });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();
  await ClientOtp.deleteMany({ mobile });

  res.json({ message: "Password reset successful" });
}