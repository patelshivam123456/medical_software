import { connectToDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';

export default async function handler(req, res) {
  await connectToDB();

  const mobile = req.headers.mobile || req.query.mobile || req.body?.mobile;
  if (!mobile) return res.status(401).json({ message: 'Please login' });

  if (req.method === 'GET') {
    const cart = await Cart.find({ mobile });
    return res.status(200).json(cart.map(item => ({
      ...item.product,
      quantity: item.quantity,
      _id: item.productId
    })));
  }

  if (req.method === 'POST') {
    const { _id, quantity, rate, ...product } = req.body;
    if (!_id || !quantity || !rate) {
      return res.status(400).json({ message: 'Missing product data' });
    }
  
    const total = quantity * rate;
  
    const existing = await Cart.findOne({ mobile, productId: _id });
    if (existing) {
      existing.quantity = quantity;
      existing.total = total;
      existing.rate = rate;
      await existing.save();
    } else {
      await Cart.create({
        mobile,
        productId: _id,
        quantity,
        rate,
        total,
        product
      });
    }
  
    return res.status(201).json({ message: 'Item added to cart' });
  }

  if (req.method === 'DELETE') {
    const { productId } = req.body;
    if (productId) {
      await Cart.deleteOne({ mobile, productId });
      return res.status(200).json({ message: 'Item removed' });
    } else {
      await Cart.deleteMany({ mobile });
      return res.status(200).json({ message: 'Cart cleared' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
