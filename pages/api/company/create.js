
import { connectToDB } from '@/lib/mongodb';
import Company from '@/models/Company';

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    // Optional: prevent duplicates
    const existing = await Company.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Company already exists' });
    }

    const company = new Company({ name: name.trim(), value: name.trim(), option: name.trim() });
    await company.save();

    return res.status(201).json({ success: true, company });
  } catch (err) {
    console.error('Create Company Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
