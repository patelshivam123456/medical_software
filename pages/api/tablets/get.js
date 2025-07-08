// pages/api/tablets/get.js


import { connectToDB } from '@/lib/mongodb';
import Tablet from '@/models/Tablet';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectToDB();
    const tablets = await Tablet.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tablets: tablets || [],
    });
  } catch (err) {
    console.error('GET /api/tablets/get error:', err);
    return res.status(200).json({ success: true, tablets: [] }); // ✅ Don't throw error if DB is empty
  }
}
