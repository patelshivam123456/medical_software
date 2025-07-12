import { connectToDB } from '@/lib/mongodb';
import Tablet from '@/models/Tablet';

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === 'POST') {
    try {
      let { name, quantity, price } = req.body;

      if (!name || quantity == null || price == null) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      name = name.trim();
      quantity = Number(quantity);
      purchase=Number(purchase);
      price = Number(price);

      if (isNaN(quantity) || isNaN(price)||isNaN(purchase)) {
        return res.status(400).json({ success: false, message: 'Quantity and Price must be numbers' });
      }

      const existing = await Tablet.findOne({ name });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Tablet already exists' });
      }

      const tablet = new Tablet({ name, quantity, purchase,price });
      await tablet.save();

      return res.status(201).json({ success: true, tablet });

    } catch (err) {
      console.error('❌ POST /api/tablets error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  else if (req.method === 'GET') {
    try {
      const tablets = await Tablet.find().sort({ createdAt: -1 });
      return res.status(200).json(tablets);
    } catch (err) {
      console.error('❌ GET /api/tablets error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch tablets' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
