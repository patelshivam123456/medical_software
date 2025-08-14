// pages/api/products/[id].js
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await connectToDB();
  const { method, query: { id } } = req;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }

  try {
    switch (method) {
      // GET /api/products/:id
      case 'GET': {
        const item = await Product.findById(id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, item });
      }

      // PUT /api/products/:id
      case 'PUT': {
        const { name, company, salt, mrp, rate, discount } = req.body || {};
        const updated = await Product.findByIdAndUpdate(
          id,
          { $set: { name, company, salt, mrp, rate, discount } },
          { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, item: updated });
      }

      // DELETE /api/products/:id
      case 'DELETE': {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, item: deleted });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (err) {
    console.error('API/products/[id] error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}