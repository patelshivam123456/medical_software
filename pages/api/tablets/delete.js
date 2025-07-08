import { connectToDB } from '@/lib/mongodb';
import Tablet from '@/models/Tablet';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).end('Method Not Allowed');
  }

  await connectToDB();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID required' });
  }

  const deleted = await Tablet.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Tablet not found' });
  }

  res.status(200).json({ success: true, message: 'Deleted successfully' });
}
