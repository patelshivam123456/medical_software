import { connectToDB } from '@/lib/mongodb';
import Tablet from '@/models/Tablet';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).end('Method Not Allowed');
  }

  await connectToDB();

  const { id, name,packaging,category,company,salt,quantity,purchase, price,mrp,mg,batch,expiry } = req.body;

  if (!id || !name||!packaging||!category||!company||!salt || quantity == null ||purchase==null|| price == null||mrp==null||!mg||!batch||!expiry) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  const updated = await Tablet.findByIdAndUpdate(
    id,
    { name: name.trim(),packaging,category,company,salt, quantity, purchase,price,mrp,mg,batch,expiry },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Tablet not found' });
  }

  res.status(200).json({ success: true, tablet: updated });
}
