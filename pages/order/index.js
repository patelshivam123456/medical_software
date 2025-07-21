import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Header from '@/components/User/Header';
import PersonalDetailsForm from '@/components/order/PersonalDetailsForm';
import PaymentForm from '@/components/order/PaymentForm';
import SuccessModal from '@/components/Modal/SuccessModal';
import { useRouter } from 'next/router';

const OrderPage = () => {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [mobile, setMobile] = useState('');
  const [personalDetails, setPersonalDetails] = useState(null);
  const [orderRefresh, setOrderRefresh] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedProducts, setSubmittedProducts] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const mob = Cookies.get('mobile');
    if (mob) {
      setMobile(mob);
    } else {
      toast.error('Please login to view cart');
    }
  }, []);

  useEffect(() => {
    if (mobile) {
      axios
        .get(`/api/order/cart?mobile=${mobile}`)
        .then((res) => setCart(res.data))
        .catch((err) => {
          console.error('Cart fetch failed:', err);
          setCart([]);
        });
    }
  }, [mobile]);

  const handleCheckboxChange = (item) => {
    setSelectedCartItems((prev) => {
      const exists = prev.some((x) => x._id === item._id);
      if (exists) {
        return prev.filter((x) => x._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = async (index) => {
    const product = cart[index];
    try {
      await axios.delete('/api/order/cart', {
        data: { productId: product._id, mobile },
      });
      setCart((prev) => prev.filter((_, i) => i !== index));
      setSelectedCartItems((prev) => prev.filter((item) => item._id !== product._id));
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const saveStep1 = async () => {
    if (selectedCartItems.length === 0 || !mobile) {
      toast.error("Please select at least one item.");
      return;
    }

    const updatedItems = selectedCartItems.map((item) => ({
      ...item,
      productId: item._id,
    }));

    try {
      const res = await axios.post('/api/order', {
        products: updatedItems,
        registeredMobile: mobile,
      });

      setOrderId(res.data._id);
      setSubmittedProducts(res.data.products);
      toast.success('Products saved');
      setStep(2);
    } catch (err) {
      toast.error('Error saving products');
    }
  };

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

  const saveStep3 = async (payment) => {
    try {
      const itemsToSubmit = submittedProducts.length > 0 ? submittedProducts : cart;

      const grandTotal = itemsToSubmit.reduce((sum, item) => sum + (item.total || 0), 0);
      const gst = grandTotal * 0.12;
      const cgst = gst / 2;
      const sgst = gst / 2;
      const finalAmount = grandTotal + gst;
      const submitstatus = 'Pending';
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
        },
      });

      const productIdsToDelete = itemsToSubmit.map((item) => item.productId);
      await axios.delete('/api/order/cart', {
        data: {
          mobile: registeredMobile,
          productIds: productIdsToDelete,
        },
      });

      toast.success('Order placed successfully');
      setCart([]);
      setSelectedCartItems([]);
      setSubmittedProducts([]);
      setSuccessOpen(true);
      setStep(1);
      setOrderRefresh(true);
      setLoadingState(true);
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Payment failed');
    }
  };

  return (
    <>
      <Header losdingState={loadingState} orderRefresh={orderRefresh} />
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Online Order</h1>

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
              ${
                step === tab.step
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-green-200 text-gray-700 border-green-200'
              }
              ${step < tab.step ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'}
            `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Step 1: Cart Display */}
        {step === 1 && (
          <div className="bg-white shadow-md p-4 rounded">
            {cart.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              <>
                <table className="w-full text-sm border mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-center">Select</th>
                      <th className="border p-2">Product</th>
                      <th className="border p-2">Company</th>
                      <th className="border p-2">Batch</th>
                      <th className="border p-2">Qty</th>
                      <th className="border p-2">Rate</th>
                      <th className="border p-2">Total</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCartItems.some((x) => x._id === item._id)}
                            onChange={() => handleCheckboxChange(item)}
                          />
                        </td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.company}</td>
                        <td className="border p-2">{item.batch}</td>
                        <td className="border p-2 text-center">{item.quantity}</td>
                        <td className="border p-2 text-right">₹{item.rate}</td>
                        <td className="border p-2 text-right">₹{item.total?.toFixed(2)}</td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="text-right space-y-1">
                  <p>Subtotal: ₹{selectedCartItems.reduce((s, i) => s + i.total, 0).toFixed(2)}</p>
                  <p>CGST (6%): ₹{(selectedCartItems.reduce((s, i) => s + i.total, 0) * 0.06).toFixed(2)}</p>
                  <p>SGST (6%): ₹{(selectedCartItems.reduce((s, i) => s + i.total, 0) * 0.06).toFixed(2)}</p>
                  <p className="font-semibold text-lg">
                    Total: ₹
                    {(selectedCartItems.reduce((s, i) => s + i.total, 0) * 1.12).toFixed(2)}
                  </p>
                </div>

                {/* Save & Continue */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={saveStep1}
                    disabled={selectedCartItems.length === 0}
                    className="bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
                  >
                    Save & Continue
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <PersonalDetailsForm
            onSave={saveStep2}
            initialData={personalDetails}
            registeredMobile={mobile}
          />
        )}

        {/* Step 3: Payment */}
        {step === 3 && <PaymentForm onSave={saveStep3} />}
        <SuccessModal
          confirmDeleteId={successOpen}
          setConfirmDeleteId={setSuccessOpen}
          confirmDelete=""
          title="Your Order has been Successfully Completed"
        />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!context.req.cookies.userLoggedIn && !context.query.userLoggedIn) {
    return {
      props: {},
      redirect: { destination: '/user/login' },
    };
  }
  return { props: {} };
}

export default OrderPage;
