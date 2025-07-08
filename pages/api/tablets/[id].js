
import { connectToDB } from '@/lib/mongodb';
import Tablet from '@/models/Tablet';


export default async function handler(req, res) {
  await connectToDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, quantity, price } = req.body;
    try {
      const updated = await Tablet.findByIdAndUpdate(id, { name, quantity, price }, { new: true });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await Tablet.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}