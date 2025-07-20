// pages/api/tablets/create.js

import { connectToDB } from '@/lib/mongodb';
import Tablet from '@/models/Tablet';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectToDB();

    let { name,packaging,category,company,salt,quantity,purchase, price,mrp,mg,batch,expiry,strips } = req.body;

    // Validate input
    if (!name || quantity == null || price == null) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    name = name.trim().toLowerCase();
    packaging = packaging.trim().toLowerCase();
    category= category,
    company=company,
    salt=salt,
    quantity = Number(quantity);
    purchase = Number(purchase);
    price = Number(price);
    mrp=Number(mrp);
    mg=mg;
    batch=batch;
    expiry=expiry;
    strips=Number(strips)

    if (isNaN(quantity) || isNaN(price)||isNaN(purchase)) {
      return res.status(400).json({ success: false, message: 'Quantity and Price must be numbers' });
    }

    // Check for existing tablet
    const existing = await Tablet.findOne({ name,packaging });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Tablet already exists' });
    }

    // Create and save tablet
    const tablet = new Tablet({ name,packaging,category,company,salt,quantity, purchase,price,mrp,mg,batch,expiry,strips});
    await tablet.save();

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('❌ POST /api/tablets/create error:', err);
    return res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
}
