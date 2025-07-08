
import { connectToDB } from '@/lib/mongodb';
import Company from '@/models/Company';

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const companies = await Company.find({}).sort({ name: 1 });

    const formatted = companies.map(c => ({
      id: c._id,
      value: c.name,
      option: c.name
    }));

    return res.status(200).json({ success: true, company: formatted });
  } catch (err) {
    console.error('List Company Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
