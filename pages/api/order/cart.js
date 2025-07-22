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
      price:item.price,
      strips:item.strips,
      _id: item.productId
    })));
  }

  if (req.method === 'POST') {
    const { _id, quantity,strips,price, ...product } = req.body;
    if (!_id || !quantity||!strips || !price) {
      return res.status(400).json({ message: 'Missing product data' });
    }
  
    const total = price*strips;
  
    const existing = await Cart.findOne({ mobile, productId: _id });
    if (existing) {
      existing.quantity = quantity;
      existing.total = total;
      existing.price = price;
      await existing.save();
    } else {
      await Cart.create({
        mobile,
        productId: _id,
        quantity,
        price,
        strips,
        total,
        product
      });
    }
  
    return res.status(201).json({ message: 'Item added to cart' });
  }

  if (req.method === 'DELETE') {
    const { productId, productIds } = req.body;
  
    if (Array.isArray(productIds) && productIds.length > 0) {
      // ✅ Delete multiple selected items only
      await Cart.deleteMany({
        mobile,
        productId: { $in: productIds },
      });
      return res.status(200).json({ message: 'Selected items removed' });
    }
  
    if (productId) {
      // ✅ Delete one item
      await Cart.deleteOne({ mobile, productId });
      return res.status(200).json({ message: 'Item removed' });
    }
  
    // ✅ Clear all (only used when needed)
    await Cart.deleteMany({ mobile });
    return res.status(200).json({ message: 'Cart cleared' });
  }
  if (req.method === 'PUT') {
    const { _id, mobile: bodyMobile, strips, quantity, total, price } = req.body;
    const mobileToUse = bodyMobile || mobile;

    if (!_id || !strips || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await Cart.findOne({ mobile: mobileToUse, productId: _id });

    if (!existing) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    existing.strips = strips;
    existing.quantity = quantity;
    existing.total = total;
    existing.price = price;

    await existing.save();
    return res.status(200).json({ message: 'Cart updated successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
