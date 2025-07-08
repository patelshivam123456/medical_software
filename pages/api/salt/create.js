
import { connectToDB } from '@/lib/mongodb';
import Salt from '@/models/Salt';

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Salt name is required' });
    }

    // Optional: prevent duplicates
    const existing = await Salt.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Salt already exists' });
    }

    const salt = new Salt({ name: name.trim(), value: name.trim(), option: name.trim() });
    await salt.save();

    return res.status(201).json({ success: true, salt });
  } catch (err) {
    console.error('Create Salt Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
