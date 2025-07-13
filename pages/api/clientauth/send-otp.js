
import { connectToDB } from "@/lib/mongodb";
import { twilioClient } from "@/lib/twilio";
import ClientOtp from "@/models/ClientOtp";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { mobile } = req.body;
  await connectToDB();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await ClientOtp.create({ mobile, otp });
  await twilioClient.messages.create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${mobile}`,
  });

  res.json({ message: "OTP sent" });
}