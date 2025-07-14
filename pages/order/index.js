// File: pages/order/index.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import CartModal from '@/components/order/CartModal';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
// import PersonalDetailsForm and PaymentForm as needed

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [mobile, setMobile] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);


  // Step 1: Set mobile & fetch products
  useEffect(() => {
    const mob = Cookies.get("mobile");
    if (mob) {
      setMobile(mob);
    } else {
      toast.error("Please login to view cart");
    }

    axios.get('/api/tablets/get')
      .then(res => setProducts(res.data.tablets))
      .catch(err => {
        console.error("Tablet fetch failed:", err);
        setProducts([]);
      });
  }, []);

  // Step 2: Fetch cart only after mobile is available
  useEffect(() => {
    if (mobile) {
      axios.get(`/api/order/cart?mobile=${mobile}`)
        .then(res => setCart(res.data))
        .catch(err => {
          console.error("Cart fetch failed:", err);
          setCart([]);
        });
    }
  }, [mobile]);

  const addToCart = async () => {
    if (!selectedProduct || !quantity || !mobile) return;
  
    const rate = selectedProduct.price || 0;
    const item = {
      ...selectedProduct,
      quantity: Number(quantity),
      rate,
      total: rate/Number(quantity) ,
      mobile
    };
  
    try {
      await axios.post('/api/order/cart', item);
      setCart(prev => [...prev, item]);
      setSelectedProduct(null);
      setQuantity('');
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };
  

  const removeFromCart = async (index) => {
    const product = cart[index];
    try {
      await axios.delete('/api/order/cart', {
        data: { productId: product._id, mobile }
      });
      setCart(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const saveStep1 = async () => {
    if (cart.length === 0 || !mobile) return;
    try {
      const res = await axios.post('/api/order', { products: cart, mobile });
      setOrderId(res.data._id);
      toast.success('Products saved');
      setStep(2);
    } catch (err) {
      toast.error('Error saving products');
    }
  };

  const saveStep2 = async (details) => {
    try {
      await axios.patch('/api/order', {
        orderId,
        data: { personalDetails: details }
      });
      toast.success('Details saved');
      setStep(3);
    } catch (err) {
      toast.error('Error saving personal details');
    }
  };

  const saveStep3 = async (payment) => {
    try {
      await axios.patch('/api/order', {
        orderId,
        data: { paymentDetails: payment }
      });
      await axios.delete('/api/order/cart', { data: { mobile } });
      toast.success('Order placed successfully');
      setCart([]);
      setStep(1);
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
     <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">Online Order</h1>

  {/* Cart Icon with Count */}
  <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
    <ShoppingBagIcon className='w-12 h-12' />
    {cart.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
        {cart.length}
      </span>
    )}
  </div>
</div>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setStep(1)} className={`px-4 py-2 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1. Product Details</button>
        <button onClick={() => step >= 2 && setStep(2)} className={`px-4 py-2 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} disabled={step < 2}>2. Personal Details</button>
        <button onClick={() => step >= 3 && setStep(3)} className={`px-4 py-2 rounded ${step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} disabled={step < 3}>3. Payment Details</button>
      </div>

      {step === 1 && (
        <>
          <select
            className="border w-full p-2 mb-2"
            onChange={(e) => {
              const product = products.find(p => p._id === e.target.value);
              setSelectedProduct(product);
            }}
            value={selectedProduct?._id || ''}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          {selectedProduct && (
            <div className="bg-gray-100 p-4 rounded mb-2 grid gap-2">
              <input type="text" value={selectedProduct.company} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Company" />
              <input type="text" value={selectedProduct.salt} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Salt" />
              <input type="text" value={selectedProduct.batch} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Batch" />
              <input type="text" value={selectedProduct.expiry} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Expiry" />
              <input type="number" className="mt-2 w-full border p-2 rounded" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <button onClick={addToCart} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Add to Cart</button>
            </div>
          )}

          {/* <CartModal cart={cart} removeFromCart={removeFromCart} /> */}

          <button onClick={saveStep1} disabled={cart.length === 0} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400">
            Save & Continue
          </button>
        </>
      )}

      {step === 2 && <PersonalDetailsForm onSave={saveStep2} />}
      {step === 3 && <PaymentForm onSave={saveStep3} />}
      {showCartModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white max-w-3xl w-full p-4 rounded shadow-lg relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={() => setShowCartModal(false)}
      >
        ✖
      </button>

      <CartModal cart={cart} removeFromCart={removeFromCart} />
    </div>
  </div>
)}

    </div>
  );
}
