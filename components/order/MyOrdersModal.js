import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyOrdersModal({ mobile, onClose,orderRefresh }) {
  const [orders, setOrders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (mobile) {
      axios
        .get(`/api/order?mobile=${mobile}`)
        .then((res) => {
          const allOrders = res.data || [];
          // ✅ Only include orders that have grandTotal
          const completedOrders = allOrders.filter(
            (order) => typeof order.grandTotal === 'number' && order.grandTotal > 0
          );
          setOrders(completedOrders);
        })
        .catch((err) => console.error("Error loading orders", err));
    }
  }, [mobile,orderRefresh]);

  const calculateTotal = (products = []) => {
    const subtotal = products.reduce((sum, p) => sum + (p.quantity * (p.rate || 0)), 0);
    const gst = subtotal * 0.12;
    const cgst = gst / 2;
    const sgst = gst / 2;
    return { subtotal, cgst, sgst, total: subtotal + gst };
  };

  const order = orders[activeIndex];
  const totals = order
    ? {
        subtotal: order.grandTotal || calculateTotal(order.products).subtotal,
        cgst: order.cgst || calculateTotal(order.products).cgst,
        sgst: order.sgst || calculateTotal(order.products).sgst,
        total: order.finalAmount || calculateTotal(order.products).total,
        submitstatus:order.submitstatus||""
      }
    : {};

    const dileveryStatus=(status)=>{
        
        if(status==="Pending") return "Pending for Approval"
        else return "Approved"
        
    }

    const paymentType=(id)=>{
        if(id==="online") return "Online"
        else return "Cash on delivery"
        
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-10 overflow-auto">
      <div className="bg-white w-full max-w-4xl p-6 rounded shadow relative">
        <button className="absolute top-2 right-3 text-lg" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>

        {/* Order Tabs */}
        <div className="flex mb-4 space-x-2 overflow-x-auto">
          {orders.map((o, i) => (
            <button
              key={o._id}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-1 rounded whitespace-nowrap ${
                i === activeIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Order {orders.length - i}
            </button>
          ))}
        </div>

        {/* Order Detail */}
        {order ? (
          <>
            <div className="mb-4">
              <h3 className="font-semibold">Customer Details</h3>
              <p><strong>Name:</strong> {order.personalDetails?.name || '-'}</p>
              <p><strong>Mobile:</strong> {order.personalDetails?.mobile || '-'}</p>
              <p><strong>Address:</strong> {order.personalDetails?.address1 || ''}, {order.personalDetails?.address2 || ''}, {order.personalDetails?.state || ''} - {order.personalDetails?.pincode || ''}</p>
            </div>

            <div className='overflow-auto'>
              <table className="w-full border text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Company</th>
                    <th className="border p-2">Batch</th>
                    <th className="border p-2">Expiry</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products?.map((p, idx) => (
                    <tr key={idx}>
                      <td className="border p-1">{p.name}</td>
                      <td className="border p-1">{p.company}</td>
                      <td className="border p-1">{p.batch}</td>
                      <td className="border p-1">{p.expiry}</td>
                      <td className="border p-1">{p.quantity}</td>
                      <td className="border p-1">₹{p?.price}</td>
                      <td className="border p-1">₹{(p.price / p.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
<div className='flex justify-between'>
    <div>
    <p>Payment mode: <span className='text-sm font-semibold'>{paymentType(order?.paymentDetails?.type)}</span></p>
             {order?.paymentDetails?.type==="online"&& <p>Transaction Id: <span className='text-sm font-semibold'>{order?.paymentDetails?.transactionId}</span></p>}
              <p>Delivery Status: <span className='text-sm font-semibold'>{dileveryStatus(totals?.submitstatus)}</span></p>
    </div>
            <div className="text-right space-y-1">
              <p>Subtotal: ₹{totals.subtotal?.toFixed(2)}</p>
              <p>CGST (6%): ₹{totals.cgst?.toFixed(2)}</p>
              <p>SGST (6%): ₹{totals.sgst?.toFixed(2)}</p>
              <p className="font-bold">Grand Total: ₹{Math.ceil(totals.total)}</p>
            </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No completed orders found.</p>
        )}
      </div>
    </div>
  );
}
