
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
import { useRouter } from 'next/router';


const OrderPage=() =>{
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [mobile, setMobile] = useState('');

  const [personalDetails, setPersonalDetails] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [losdingState,setLoadingState] = useState(false)
  const [orderRefresh,setOrderRefresh] = useState(false)
  const [successOpen,setSuccessOpen] = useState(false)
  const [tempCart, setTempCart] = useState([]);
  const [submittedProducts, setSubmittedProducts] = useState([]);
  const router=useRouter()
  
  useEffect(() => {
    const shouldContinue = localStorage.getItem('continueFromCart');
    if (shouldContinue === 'true') {
      // localStorage.removeItem('continueFromCart');
      saveStep1(); // Auto trigger move to step 2
    }
  }, [cart]);

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

      axios.get('/api/order/admin')
      .then(res => console.log(res.data)
      )
      .catch(err => {
        console.error("Tablet fetch failed:", err);
        setProducts([]);
      });
  }, []);


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
    
    if (alreadyExists) {
      toast.error("Item already exists in cart");
      return;
    }
    const TotalLogic= (selectedProduct?.price/(Number(selectedProduct?.packaging?.split("*")[1]))*Number(quantity).toFixed(2))
    
    const item = {
      ...selectedProduct,
      quantity: Number(quantity),

      total: Number(TotalLogic) ,
      mobile
    };
  
    try {
      await axios.post('/api/order/cart', item);
      setCart(prev => [...prev, item]);
      setLoadingState(true)
      setSelectedProduct(null);
      setQuantity('');
      setSelectedProduct("")
      toast.success("Item added in successfully")
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

  // const saveStep1 = async () => {
  //   if (cart.length === 0 || !mobile) return;
  //   try {
  //     const res = await axios.post('/api/order', { products: cart, registeredMobile: mobile, });
  //     setOrderId(res.data._id);
  //     // Cookies.set("Order_id",res.data._id)
  //     toast.success('Products saved');
  //     setStep(2);
  //   } catch (err) {
  //     toast.error('Error saving products');
  //   }
  // };


  // const saveStep2 = async (details) => {
  //   const registeredMobile = Cookies.get('mobile'); // 🟢 get it from cookie
  
  //   await axios.patch('/api/order/draft', {
  //     orderId,
  //     registeredMobile, // 🟢 top-level
  //     data: {
  //       personalDetails: {
  //         ...details,
  //         registeredMobile  // 🟢 inside personalDetails
  //       }
  //     }
  //   });
  
  //   setStep(3);
  // };
//   const saveStep1 = async () => {
//     // const rawItems = localStorage.getItem('selectedCartItems');
//     // const itemsToSave = rawItems ? JSON.parse(rawItems) : cart;

//     const rawItems = localStorage.getItem('selectedCartItems');
//     const itemsToSave = rawItems ? JSON.parse(rawItems) : tempCart;
  
//     if (itemsToSave.length === 0 || !mobile) return;
  
//     try {
//       const res = await axios.post('/api/order', {
//         products: itemsToSave,
//         registeredMobile: mobile,
//       });
//       setOrderId(res.data._id);
//       toast.success('Products saved');
//       setStep(2);
  
//       // Cleanup after use
//       localStorage.removeItem('selectedCartItems');
//       localStorage.removeItem('continueFromCart');
//     } catch (err) {
//       toast.error('Error saving products');
//     }
//   };
//   const saveStep2 = async (details) => {
//     const registeredMobile = Cookies.get('mobile'); // get from cookie
  
//     await axios.patch('/api/order/draft', {
//       orderId,
//       registeredMobile,
//       data: {
//         personalDetails: {
//           ...details,
//           registeredMobile
//         }
//       }
//     });
  
//     setPersonalDetails({
//       ...details,
//       registeredMobile
//     });
// // ✅ this line ensures form gets prefilled when going back
//     setStep(3); // move to payment step
//   };
  
//   const saveStep3 = async (payment) => {
//     try {
//       const grandTotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);
//       const gst = grandTotal * 0.12;
//       const cgst = gst / 2;
//       const sgst = gst / 2;
//       const finalAmount = grandTotal + gst;
//       const submitstatus="Pending"
//       const registeredMobile = Cookies.get('mobile'); 

//       const orderRes = await axios.get(`/api/order/${orderId}`);
//       const order = orderRes.data;

//       await axios.patch('/api/order/draft', {
//         registeredMobile,
//         orderId,
//         data: {
//           products: order.products,               
//           personalDetails: order.personalDetails, 
//           paymentDetails: payment,
//           grandTotal,
//           cgst,
//           sgst,
//           finalAmount,
//           submitstatus,
//         }
//       });
  
//       await axios.delete('/api/order/cart', { data: { mobile } });
      
//       toast.success('Order placed successfully');
//       setCart([]);
//       setSuccessOpen(true)
//       setStep(1);
//       setOrderRefresh(true)
//       setLoadingState(true)
//     } catch (err) {
//       console.error(err);
//       toast.error('Payment failed');
//     }
//   };
// const saveStep1 = async () => {
//   const rawItems = localStorage.getItem('selectedCartItems');
//   const itemsToSave = rawItems ? JSON.parse(rawItems) : tempCart;

//   if (itemsToSave.length === 0 || !mobile) return;

//   try {
//     const res = await axios.post('/api/order', {
//       products: itemsToSave,
//       registeredMobile: mobile,
//     });
//     setOrderId(res.data._id);
//     toast.success('Products saved');
//     setStep(2);

//     // 🟢 Track which flow was used
//     const isCartFlow = localStorage.getItem('isCartFlow') === 'true';
//     localStorage.setItem('usedCartFlow', isCartFlow ? 'true' : 'false');

//     // Cleanup
//     localStorage.removeItem('selectedCartItems');
//     localStorage.removeItem('continueFromCart');
//     localStorage.removeItem('isCartFlow');
//   } catch (err) {
//     toast.error('Error saving products');
//   }
// };
// const saveStep1 = async () => {
//   const rawItems = localStorage.getItem('selectedCartItems');
//   const itemsToSave = rawItems ? JSON.parse(rawItems) : tempCart;
// console.log(itemsToSave,"itemsToSave");

//   if (itemsToSave.length === 0 || !mobile) return;

//   try {
//     const res = await axios.post('/api/order', {
//       products: itemsToSave,
//       registeredMobile: mobile,
//     });

//     setOrderId(res.data._id);
//     setSubmittedProducts(res.data.products); // 🟢 Save submitted products

//     toast.success('Products saved');
//     setStep(2);

//     // 🟢 Track which flow was used
//     const isCartFlow = localStorage.getItem('isCartFlow') === 'true';
//     localStorage.setItem('usedCartFlow', isCartFlow ? 'true' : 'false');

//     // Cleanup
//     localStorage.removeItem('selectedCartItems');
//     localStorage.removeItem('continueFromCart');
//     localStorage.removeItem('isCartFlow');
//   } catch (err) {
//     toast.error('Error saving products');
//   }
// };
const saveStep1 = async () => {
  const rawItems = localStorage.getItem('selectedCartItems');
  const itemsToSave = rawItems ? JSON.parse(rawItems) : tempCart;
  console.log(itemsToSave, "itemsToSave");

  if (itemsToSave.length === 0 || !mobile) return;

  // Adding productId to each item in the itemsToSave array
  const updatedItems = itemsToSave.map(item => ({
    ...item,
    productId: item._id  // Adding productId key with the _id value
  }));

  try {
    const res = await axios.post('/api/order', {
      products: updatedItems,
      registeredMobile: mobile,
    });

    setOrderId(res.data._id);
    setSubmittedProducts(res.data.products); // 🟢 Save submitted products

    toast.success('Products saved');
    setStep(2);

    // 🟢 Track which flow was used
    const isCartFlow = localStorage.getItem('isCartFlow') === 'true';
    localStorage.setItem('usedCartFlow', isCartFlow ? 'true' : 'false');

    // Cleanup
    localStorage.removeItem('selectedCartItems');
    localStorage.removeItem('continueFromCart');
    localStorage.removeItem('isCartFlow');
  } catch (err) {
    toast.error('Error saving products');
  }
};

console.log(submittedProducts,"uuuuuuuuuuuuuu");

const saveStep2 = async (details) => {
  const registeredMobile = Cookies.get('mobile');

  await axios.patch('/api/order/draft', {
    orderId,
    registeredMobile,
    data: {
      personalDetails: {
        ...details,
        registeredMobile,
      },
    },
  });

  setPersonalDetails({
    ...details,
    registeredMobile,
  });

  setStep(3);
};

// const saveStep3 = async (payment) => {
//   try {
//     const registeredMobile = Cookies.get('mobile');
//     const usedCartFlow = localStorage.getItem('usedCartFlow') === 'true';

//     // Get order data
//     const orderRes = await axios.get(`/api/order/${orderId}`);
//     const order = orderRes.data;

//     // Use correct source for total calculation
//     const sourceData = usedCartFlow ? cart : order.products;

//     const grandTotal = sourceData.reduce((sum, item) => sum + (item.total || 0), 0);
//     const gst = grandTotal * 0.12;
//     const cgst = gst / 2;
//     const sgst = gst / 2;
//     const finalAmount = grandTotal + gst;
//     const submitstatus = 'Pending';

//     await axios.patch('/api/order/draft', {
//       registeredMobile,
//       orderId,
//       data: {
//         products: order.products,
//         personalDetails: order.personalDetails,
//         paymentDetails: payment,
//         grandTotal,
//         cgst,
//         sgst,
//         finalAmount,
//         submitstatus,
//       },
//     });

//     // 🟢 Delete cart only if cart modal was used
//     if (usedCartFlow) {
//       await axios.delete('/api/order/cart', { data: { mobile } });
//     }

//     toast.success('Order placed successfully');
//     setCart([]);
//     setSuccessOpen(true);
//     setStep(1);
//     setOrderRefresh(true);
//     setLoadingState(true);

//     // Cleanup
//     localStorage.removeItem('usedCartFlow');
//   } catch (err) {
//     console.error(err);
//     toast.error('Payment failed');
//   }
// };

// const saveStep3 = async (payment) => {
//   try {
//     const itemsToSubmit = submittedProducts.length > 0 ? submittedProducts : cart;

//     const grandTotal = itemsToSubmit.reduce((sum, item) => sum + (item.total || 0), 0);
//     const gst = grandTotal * 0.12;
//     const cgst = gst / 2;
//     const sgst = gst / 2;
//     const finalAmount = grandTotal + gst;
//     const submitstatus = "Pending";
//     const registeredMobile = Cookies.get('mobile');

//     const orderRes = await axios.get(`/api/order/${orderId}`);
//     const order = orderRes.data;

//     await axios.patch('/api/order/draft', {
//       registeredMobile,
//       orderId,
//       data: {
//         products: itemsToSubmit,
//         personalDetails: order.personalDetails,
//         paymentDetails: payment,
//         grandTotal,
//         cgst,
//         sgst,
//         finalAmount,
//         submitstatus,
//       }
//     });

//     // ✅ Delete only the submitted items (if used cart modal)
//     const usedCartFlow = localStorage.getItem('usedCartFlow') === 'true';
//     if (usedCartFlow) {
//       for (const item of itemsToSubmit) {
//         await axios.delete('/api/order/cart', {
//           data: { mobile: registeredMobile, productId: item._id }, // ✅ FIXED HERE
//         });
//       }
//     }

//     toast.success('Order placed successfully');
//     setCart([]);
//     setSubmittedProducts([]);
//     localStorage.removeItem('usedCartFlow');
//     setSuccessOpen(true);
//     setStep(1);
//     setOrderRefresh(true);
//     setLoadingState(true);
//   } catch (err) {
//     console.error(err);
//     toast.error('Payment failed');
//   }
// };

const saveStep3 = async (payment) => {
  try {
    const itemsToSubmit = submittedProducts.length > 0 ? submittedProducts : cart;

    const grandTotal = itemsToSubmit.reduce((sum, item) => sum + (item.total || 0), 0);
    const gst = grandTotal * 0.12;
    const cgst = gst / 2;
    const sgst = gst / 2;
    const finalAmount = grandTotal + gst;
    const submitstatus = "Pending";
    const registeredMobile = Cookies.get('mobile');

    const orderRes = await axios.get(`/api/order/${orderId}`);
    const order = orderRes.data;

    await axios.patch('/api/order/draft', {
      registeredMobile,
      orderId,
      data: {
        products: itemsToSubmit,
        personalDetails: order.personalDetails,
        paymentDetails: payment,
        grandTotal,
        cgst,
        sgst,
        finalAmount,
        submitstatus,
      }
    });

    // ✅ Delete only the submitted items if used cart modal
    const usedCartFlow = localStorage.getItem('usedCartFlow') === 'true';
    if (usedCartFlow) {
      console.log(itemsToSubmit,"aaaaaaaaaaaa");
      const productIdsToDelete = itemsToSubmit.map(item => item.productId);
      console.log(productIdsToDelete,"bbbbbbbbbbbbb");
      await axios.delete('/api/order/cart', {
        data: {
          mobile: registeredMobile,
          productIds: productIdsToDelete,
        },
      });
    }

    toast.success('Order placed successfully');
    setCart([]);
    setSubmittedProducts([]);
    localStorage.removeItem('usedCartFlow');
    setSuccessOpen(true);
    setStep(1);
    setOrderRefresh(true);
    setLoadingState(true);
    router.push("/")
  } catch (err) {
    console.error(err);
    toast.error('Payment failed');
  }
};



  return (
    <>
    <Header losdingState={losdingState} orderRefresh={orderRefresh}  />
    <div className="p-4 max-w-2xl mx-auto">
     <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">Online Order</h1>


</div>

<div className="flex mb-6">
  {[
    { label: 'Product Details', step: 1 },
    { label: 'Personal Details', step: 2 },
    { label: 'Payment Details', step: 3 },
  ].map((tab, index) => (
    <button
      key={tab.step}
      onClick={() => {step >= tab.step && setStep(tab.step);localStorage.clear()}}
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
  value={quantity && selectedProduct?.price ?( ( selectedProduct.price/Number(selectedProduct.packaging.split("*")[1])) *quantity).toFixed(2) : ''}
  disabled
  className="w-full border p-2 rounded bg-gray-200"
  placeholder="Total"
/>

              <button onClick={addToCart} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Add to Cart</button>

              <button
  type="button"
  onClick={() => {
    if (!selectedProduct || !quantity) {
      toast.error("Select a product and quantity");
      return;
    }

    const TotalLogic = (selectedProduct?.price / Number(selectedProduct?.packaging?.split("*")[1])) * Number(quantity);

    const item = {
      ...selectedProduct,
      quantity: Number(quantity),
      total: Number(TotalLogic),
    };

    const alreadyExists = tempCart.some((x) => x._id === item._id);
    if (alreadyExists) {
      toast.error("Item already added to temporary list");
      return;
    }

    setTempCart(prev => [...prev, item]);
    setSelectedProduct(null);
    setQuantity('');
    toast.success("Item added to temporary list");
  }}
  className="mt-2 ml-2 bg-yellow-500 text-white px-4 py-2 rounded"
>
  Add More
</button>
            </div>
         

       
<div className='flex justify-end'>
          <button onClick={saveStep1} disabled={tempCart.length === 0} className="cursor-pointer mt-4 bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400">
            Save & Continue
          </button>
          </div>
          {tempCart.length > 0 && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">Added Items (Not Saved)</h2>
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Company</th>
          <th className="border p-2">Batch</th>
          <th className="border p-2">Qty</th>
          <th className="border p-2">Rate</th>
          <th className="border p-2">Total</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {tempCart.map((item, index) => (
          <tr key={index}>
            <td className="border p-2">{item.name}</td>
            <td className="border p-2">{item.company}</td>
            <td className="border p-2">{item.batch}</td>
            <td className="border p-2 text-center">{item.quantity}</td>
            <td className="border p-2 text-right">₹{item.price}</td>
            <td className="border p-2 text-right">₹{item.total.toFixed(2)}</td>
            <td className="border p-2 text-center">
              <button
                onClick={() => {
                  const updated = [...tempCart];
                  updated.splice(index, 1);
                  setTempCart(updated);
                }}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        </div>
      )}

      {step === 2 && <PersonalDetailsForm onSave={saveStep2} initialData={personalDetails} registeredMobile={mobile} />}
      {step === 3 && <PaymentForm onSave={saveStep3} />}
      <SuccessModal confirmDeleteId={successOpen} setConfirmDeleteId={setSuccessOpen} confirmDelete={""}  title={"Your Order has been Successfully Completed"}/>
      
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