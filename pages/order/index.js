// File: pages/order/index.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import CartModal from '@/components/order/CartModal';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { ClipboardDocumentListIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Header from '@/components/User/Header';
import PersonalDetailsForm from '@/components/order/PersonalDetailsForm';
import PaymentForm from '@/components/order/PaymentForm';
import MyOrdersModal from '@/components/order/MyOrdersModal';
import SuccessModal from '@/components/Modal/SuccessModal';
// import PersonalDetailsForm and PaymentForm as needed

const OrderPage=() =>{
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [mobile, setMobile] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [personalDetails, setPersonalDetails] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [losdingState,setLoadingState] = useState(false)
  const [orderRefresh,setOrderRefresh] = useState(false)
  const [successOpen,setSuccessOpen] = useState(false)
  

  // Step 1: Set mobile & fetch products
  useEffect(() => {
    // if(Cookies.get("OrderId")){
    //   setOrderId(Cookies.get("OrderId"))
    // }

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

      axios.get('/api/order/admin')
      .then(res => console.log(res.data)
      )
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
  
    const rate = selectedProduct?.price || 0;
    const alreadyExists = cart.some(item => item._id === selectedProduct._id);
    console.log(cart,selectedProduct);
    
    if (alreadyExists) {
      toast.error("Item already exists in cart");
      return;
    }
    const item = {
      ...selectedProduct,
      quantity: Number(quantity),
      total: Number(rate)/Number(quantity) ,
      mobile
    };
  
    try {
      await axios.post('/api/order/cart', item);
      setCart(prev => [...prev, item]);
      setSelectedProduct(null);
      setQuantity('');
      setSelectedProduct("")
      toast.success("Item added in successfully")
      setLoadingState(true)
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
      const res = await axios.post('/api/order', { products: cart, registeredMobile: mobile, });
      setOrderId(res.data._id);
      // Cookies.set("Order_id",res.data._id)
      toast.success('Products saved');
      setStep(2);
    } catch (err) {
      toast.error('Error saving products');
    }
  };

  // const saveStep2 = async (details) => {
  //   try {
  //     await axios.patch('/api/order', {
  //       orderId,
  //       registeredMobile: Cookies.get('mobile'),
  //       data: {
  //         personalDetails: details,
  //       },
  //     });
  //     setPersonalDetails(details); // save in state
  //     toast.success('Details saved');
  //     setStep(3);
  //   } catch (err) {
  //     toast.error('Error saving personal details');
  //   }
  // };
  const saveStep2 = async (details) => {
    const registeredMobile = Cookies.get('mobile'); // 🟢 get it from cookie
  
    await axios.patch('/api/order/draft', {
      orderId,
      registeredMobile, // 🟢 top-level
      data: {
        personalDetails: {
          ...details,
          registeredMobile  // 🟢 inside personalDetails
        }
      }
    });
  
    setStep(3);
  };
  
  const saveStep3 = async (payment) => {
    try {
      const grandTotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);
      const gst = grandTotal * 0.12;
      const cgst = gst / 2;
      const sgst = gst / 2;
      const finalAmount = grandTotal + gst;
      const submitstatus="Pending"
      const registeredMobile = Cookies.get('mobile'); 
      // Fetch order data before update
      const orderRes = await axios.get(`/api/order/${orderId}`);
      const order = orderRes.data;
  
      // ✅ Send all together in PATCH
      await axios.patch('/api/order/draft', {
        registeredMobile,
        orderId,
        data: {
          products: order.products,               // use stored products
          personalDetails: order.personalDetails, // use stored personal info
          paymentDetails: payment,
          grandTotal,
          cgst,
          sgst,
          finalAmount,
          submitstatus,
        }
      });
  
      await axios.delete('/api/order/cart', { data: { mobile } });
      
      toast.success('Order placed successfully');
      setCart([]);
      setSuccessOpen(true)
      setStep(1);
      setOrderRefresh(true)
      setLoadingState(true)
    } catch (err) {
      console.error(err);
      toast.error('Payment failed');
    }
  };
  

  return (
    <>
    <Header losdingState={losdingState} orderRefresh={orderRefresh} moveOnStep={()=>{saveStep1(),setShowCartModal(false)}} showCartModal={showCartModal} setShowCartModal={setShowCartModal}/>
    <div className="p-4 max-w-2xl mx-auto">
     <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">Online Order</h1>

  {/* Cart Icon with Count */}
  {/* <div className='flex items-center gap-4'>
  <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
    <ShoppingBagIcon className='w-12 h-12' />
    {cart.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
        {cart.length}
      </span>
    )}
  </div>
  <div className=" cursor-pointer" onClick={() => setShowOrdersModal(true)}>
  <ClipboardDocumentListIcon className='w-12 h-12' />
</div>
  </div> */}
</div>

<div className="flex mb-6">
  {[
    { label: 'Product Details', step: 1 },
    { label: 'Personal Details', step: 2 },
    { label: 'Payment Details', step: 3 },
  ].map((tab, index) => (
    <button
      key={tab.step}
      onClick={() => step >= tab.step && setStep(tab.step)}
      disabled={step < tab.step}
      className={`px-6 py-2 text-sm font-medium border 
        ${index === 0 ? 'rounded-l-lg' : ''}
        ${index === 2 ? 'rounded-r-lg' : ''}
        ${step === tab.step ? 'bg-green-600 text-white hover:text-green-500 border-green-600 cursor-pointer' : 'bg-green-200 text-gray-700 border-green-200 '}
        ${step < tab.step ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50 transition '}
      `}
    >
      {tab.label}
    </button>
  ))}
</div>

      {step === 1 && (
        <div className='bg-white shadow-2xl p-4'>
          <select
            className="border w-full p-2 mb-2"
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                // ⛔ Reset everything when "Select Product" is chosen
                setSelectedProduct(null);
                setQuantity('');
                return;
              }
          
              const product = products.find(p => p._id === value);
              setSelectedProduct(product);
              setQuantity('');
            }}
            value={selectedProduct?._id || ''}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

      
            <div className="bg-gray-100 p-4 rounded mb-2 grid gap-2">
              <input type="text" value={selectedProduct?.company||""} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Company" />
              <input type="text" value={selectedProduct?.salt||""} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Salt" />
              <input type="text" value={selectedProduct?.category||""} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Category" />
              <input type="text" value={selectedProduct?.batch||""} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Batch" />
              <input type="text" value={selectedProduct?.expiry||""} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Expiry" />
              <input type="text" value={selectedProduct?.packaging||""} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="pack" />
              <input type="text" value={selectedProduct?.price||""} disabled className="w-full border p-2 rounded bg-gray-200" placeholder="Price" />
              <input type="number" className="mt-2 w-full border p-2 rounded" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <input
  type="text"
  value={quantity && selectedProduct?.price ? (selectedProduct.price / quantity).toFixed(2) : ''}
  disabled
  className="w-full border p-2 rounded bg-gray-200"
  placeholder="Total"
/>

              <button onClick={addToCart} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Add to Cart</button>
            </div>
         

          {/* <CartModal cart={cart} removeFromCart={removeFromCart} /> */}
<div className='flex justify-end'>
          <button onClick={saveStep1} disabled={cart.length === 0} className="cursor-pointer mt-4 bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400">
            Save & Continue
          </button>
          </div>
        </div>
      )}

      {step === 2 && <PersonalDetailsForm onSave={saveStep2} initialData={personalDetails} registeredMobile={mobile} />}
      {step === 3 && <PaymentForm onSave={saveStep3} />}
      <SuccessModal confirmDeleteId={successOpen} setConfirmDeleteId={setSuccessOpen} confirmDelete={""}  title={"Your Order has been Successfully Completed"}/>
      {/* {showCartModal && (
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
 {showOrdersModal && (
  <MyOrdersModal mobile={mobile} onClose={() => setShowOrdersModal(false)} />
)} */}
    </div>
    </>
  );
}
export async function getServerSideProps(context) {
  if (!context.req.cookies.userLoggedIn&&!context.query.userLoggedIn) {
    return {
      props: {},
      redirect: { destination: '/user/login' },
    }
  } 
  return { props: {} }
}
export default OrderPage