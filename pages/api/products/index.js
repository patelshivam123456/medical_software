// pages/api/products/index.js
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connectToDB();

  const { method } = req;
  try {
    switch (method) {
      // GET /api/products -> list with optional search filter
      case 'GET': {
        const { q } = req.query;

        const filter = q
          ? {
              $or: [
                { name: { $regex: q, $options: 'i' } },
                { company: { $regex: q, $options: 'i' } },
                { salt: { $regex: q, $options: 'i' } },
              ],
            }
          : {};

        const items = await Product.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, items, total: items.length });
      }

      // POST /api/products -> create
      case 'POST': {
        const { name, company, salt, mrp, rate, discount = 0 } = req.body || {};
        if (!name || mrp == null || rate == null) {
          return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const created = await Product.create({ name, company, salt, mrp, rate, discount });
        return res.status(201).json({ success: true, item: created });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (err) {
    console.error('API/products error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}
