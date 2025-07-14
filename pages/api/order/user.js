import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();

  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ message: 'Mobile number required' });

  const orders = await Order.find({ 'personalDetails.mobile': mobile });
  res.status(200).json(orders);
}
