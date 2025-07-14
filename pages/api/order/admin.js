import { connectToDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectToDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  res.status(200).json(orders);
}