'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import ConfirmationModal from '@/components/Modal/ConfirmationModal';
import { toast } from 'react-toastify';

const OnlineOrder = (props) => {
  const [tab, setTab] = useState('pending'); // 'pending' | 'approved'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedCheck,setIsLoggedCheck] = useState('')
  const [open,setOpen] = useState(false)
  const [orderId,setOrderId]=useState("")

  useEffect(() => {
    // axios.get("/api/tablets/get").then((res) => {
    //   setAvailableTablets(res.data.tablets);
    // });
    if(props.isLoggedStatus){
      setIsLoggedCheck(props.isLoggedStatus)
    }
    // fetchTabDetails()
    // fetchClients();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = tab === 'pending' ? '/api/order/admin' :tab==="approved"? '/api/order/approve':'/api/order/cancelorder';
      const res = await axios.get(url);
      const filtered = Array.isArray(res.data) ? res.data : [];
      setOrders(filtered);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  const handleApprove = async () => {
    try {
      const res = await axios.put('/api/order/approve', { orderId });
      if (res.status === 200) {
        toast.success('Order Approved Successfully!');
        setOpen(false)
        fetchOrders(); // Refresh data
      } else {
        setOpen(false)
        toast.error('Something went wrong');
      }
    } catch (err) {
      console.error('Approve error:', err);
      toast.error('Failed to approve order');
    }
  };

  return (
    <>
    <Header isLoggedStatus={isLoggedCheck}/>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Online Orders</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded cursor-pointer ${tab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${tab === 'approved' ? 'bg-green-600 text-white' : 'bg-green-400 text-white'}`}
          onClick={() => setTab('approved')}
        >
          Approved
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${tab === 'cancelled' ? 'bg-red-600 text-white' : 'bg-red-300 text-white'}`}
          onClick={() => setTab('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No {tab} orders found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Registered Mobile</th>
                <th className="border px-3 py-2">Products</th>
                <th className="border px-3 py-2">Personal Details</th>
                <th className="border px-3 py-2">Payment Type</th>
                <th className="border px-3 py-2">Grand Total</th>
                <th className="border px-3 py-2">Submit Status</th>
                {tab === 'pending' && <th className="border px-3 py-2">Action</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border px-3 py-2">{order.registeredMobile}</td>

                  {/* Products */}
                  <td className="border px-3 py-2">
                    <table className="w-full border text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border px-1">Name</th>
                          <th className="border px-1">Company</th>
                          <th className="border px-1">Batch</th>
                          <th className="border px-1">Mg</th>
                          <th className="border px-1">Expiry</th>
                          <th className="border px-1">Qty</th>
                          <th className="border px-1">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products?.map((p, idx) => (
                          <tr key={idx}>
                            <td className="border px-1">{p.name}</td>
                            <td className="border px-1">{p.company}</td>
                            <td className="border px-1">{p.batch}</td>
                            <td className="border px-1">{p.mg}</td>
                            <td className="border px-1">{p.expiry}</td>
                            <td className="border px-1">{p.quantity}</td>
                            <td className="border px-1">₹{p.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>

                  {/* Personal Details */}
                  <td className="border px-3 py-2">
                    <p><strong>Name:</strong> {order.personalDetails?.name || '-'}</p>
                    <p><strong>Mobile:</strong> {order.personalDetails?.mobile || '-'}</p>
                    <p><strong>Address:</strong> {order.personalDetails?.address1 || ''}, {order.personalDetails?.address2 || ''}</p>
                    <p><strong>State:</strong> {order.personalDetails?.state || ''}</p>
                    <p><strong>Pincode:</strong> {order.personalDetails?.pincode || ''}</p>
                  </td>

                  {/* Payment */}
                  <td className="border px-3 py-2">
                    {order.paymentDetails?.type || '-'}
                    {order.paymentDetails?.transactionId && (
                      <p className="text-xs text-gray-500">Txn: {order.paymentDetails.transactionId}</p>
                    )}
                  </td>

                  {/* Total */}
                  <td className="border px-3 py-2 text-right font-semibold">
                    ₹{Math.ceil(order.finalAmount || 0)}
                  </td>

                  {/* Status */}
                  <td className={`border px-3 py-2 text-center ${order.submitstatus==="Cancel"?'text-red-500 font-semibold':"text-black"}`}>
                    {order.submitstatus || 'Pending'}
                  </td>

                  {/* Action */}
                  {tab === 'pending' && (
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => {setOpen(true),setOrderId(order._id)}}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Accept
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <div>
        <ConfirmationModal loading={loading} title={"Are you sure want to Approved this Order?"}
        confirmDeleteId={open} setConfirmDeleteId={setOpen} confirmDelete={handleApprove}/>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
    const { loggedIn, loginType } = context.req.cookies;
  
    if (!loggedIn && !context.query.loggedIn) {
      return {
        props: {},
        redirect: { destination: "/admin" },
      };
    }
  
    // Only allow admin or sales
    if (loggedIn && loginType !== "admin" && loginType !== "stockiest") {
      return {
        props: {},
        redirect: { destination: "/admin" },
      };
    }
    const isLoggedStatus= loggedIn
    const checkLoginType=loginType
  
    return {
      props: {isLoggedStatus,checkLoginType},
    };
  }

export default OnlineOrder;
