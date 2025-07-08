
import { connectToDB } from '@/lib/mongodb';
import Salt from '@/models/Salt';

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const salts = await Salt.find({}).sort({ name: 1 });

    const formatted = salts.map(c => ({
      id: c._id,
      value: c.name,
      option: c.name
    }));

    return res.status(200).json({ success: true, salt: formatted });
  } catch (err) {
    console.error('List Salt Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
