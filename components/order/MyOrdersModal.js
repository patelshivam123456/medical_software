import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyOrdersModal({ mobile, onClose, orderRefresh }) {
  const [orders, setOrders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (mobile) {
      axios
        .get(`/api/order?mobile=${mobile}`)
        .then((res) => {
          const allOrders = res.data || [];
          const completedOrders = allOrders.filter(
            (order) => typeof order.grandTotal === 'number' && order.grandTotal > 0
          );
          setOrders(completedOrders);
        })
        .catch((err) => console.error("Error loading orders", err));
    }
  }, [mobile, orderRefresh]);

  const calculateTotal = (products = []) => {
    const subtotal = products.reduce((sum, p) => sum + (p.quantity * (p.rate || 0)), 0);
    const gst = subtotal * 0.12;
    return { subtotal, cgst: gst / 2, sgst: gst / 2, total: subtotal + gst };
  };

  const order = orders[activeIndex];
  const totals = order ? {
    subtotal: order.grandTotal || calculateTotal(order.products).subtotal,
    cgst: order.cgst || calculateTotal(order.products).cgst,
    sgst: order.sgst || calculateTotal(order.products).sgst,
    total: order.finalAmount || calculateTotal(order.products).total,
    submitstatus: order.submitstatus || ""
  } : {};

  const dileveryStatus = (status) => {
    switch (status) {
      case "Pending": return "Awaiting Approval";
      case "Approved": return "Order Approved";
      case "mark_delivery": return "Ready for Dispatch";
      case "Complete": return "Delivered Successfully";
      default: return "Processing";
    }
  };

  const paymentType = (id) => id === "online" ? "Online" : "Cash on delivery";

  const calculateDeliveryDays = (created, dispatched) => {
    if (!created || !dispatched) return '-';
    const diffTime = new Date(dispatched) - new Date(created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : 'Same day';
  };

  const downloadInvoice = () => {
    const content = document.getElementById("order-invoice")?.innerHTML;
    const win = window.open("", "_blank");
    if (win && content) {
      win.document.write(`
        <html>
          <head>
            <title>Order Invoice</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
              th, td { border: 1px solid #ccc; padding: 6px; text-align: left; font-size: 14px; }
              h2 { margin-bottom: 10px; }
              .section-title { font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-10 overflow-auto">
      <div className="bg-white w-full max-w-4xl p-6 rounded shadow relative">
        <button className="absolute top-2 right-3 text-lg" onClick={onClose}>✖</button>
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>

        {/* Order Tabs */}
        <div className="flex mb-4 space-x-2 overflow-x-auto">
          {orders.map((o, i) => (
            <button
              key={o._id}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-1 rounded whitespace-nowrap ${i === activeIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Order {orders.length - i}
            </button>
          ))}
        </div>

        {order ? (
          <>
            <div className="mb-4 text-right">
              <button
                onClick={downloadInvoice}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Download Invoice
              </button>
            </div>

            <div id="order-invoice">
              <h3 className="text-xl font-bold mb-2">Order #{orders.length - activeIndex}</h3>

              <div className="flex justify-between">
                <div className="w-[50%]">
                  <p className="font-semibold">Customer Details</p>
                  <p><strong>Name:</strong> {order.personalDetails?.name || '-'}</p>
                  <p><strong>Mobile:</strong> {order.personalDetails?.mobile || '-'}</p>
                  <p><strong>Address:</strong> {order.personalDetails?.address1 || ''}, {order.personalDetails?.address2 || ''}, {order.personalDetails?.state || ''} - {order.personalDetails?.pincode || ''}</p>
                </div>

                <div className="text-right">
                  <div className="italic text-red-600 font-semibold">Non-Returnable Item</div>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "2-digit" })}</p>
                  {order?.dispatchDate && <p><strong>Dispatch Date:</strong> {new Date(order?.dispatchDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "2-digit" })}</p>}
                  <p><strong>Order ID:</strong> {order?._id || '-'}</p>
                </div>
              </div>

              <div className="overflow-auto mt-4 rounded-lg shadow-md">
  <table className="min-w-full table-auto border border-gray-300">
    <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
      <tr>
        <th className="px-4 py-2 border">Name</th>
        <th className="px-4 py-2 border">Company</th>
        <th className="px-4 py-2 border">Salt</th>
        <th className="px-4 py-2 border">Batch</th>
        <th className="px-4 py-2 border">Expiry</th>
        <th className="px-4 py-2 border">Qty</th>
        <th className="px-4 py-2 border">Rate</th>
        <th className="px-4 py-2 border">Total</th>
      </tr>
    </thead>
    <tbody className="text-center">
      {order.products?.map((p, idx) => (
        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
          <td className="px-4 py-2 border">{p.name}</td>
          <td className="px-4 py-2 border">{p.company}</td>
          <td className="px-4 py-2 border">{p.salt}</td>
          <td className="px-4 py-2 border">{p.batch}</td>
          <td className="px-4 py-2 border">{p.expiry}</td>
          <td className="px-4 py-2 border">{p.quantity}</td>
          <td className="px-4 py-2 border">₹{p.price}</td>
          <td className="px-4 py-2 border">₹{p.total}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

              <div className="flex justify-between mt-4">
                <div>
                  <p>Payment Mode: <span className="font-semibold">{paymentType(order?.paymentDetails?.type)}</span></p>
                  {order?.paymentDetails?.type === "online" && (
                    <p>Transaction ID: <span className="font-semibold">{order?.paymentDetails?.transactionId}</span></p>
                  )}
                  <p>Delivery Status: <span className="font-semibold">
                    {totals.submitstatus === "Complete" && order?.dispatchDate
                      ? `Delivered, ${new Date(order.dispatchDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
                      : dileveryStatus(totals?.submitstatus)}
                  </span></p>
                  {order?.createdAt && order?.dispatchDate && order?.submitstatus === "mark_delivery" && (
                    <p><strong>Delivered In:</strong> {calculateDeliveryDays(order?.createdAt, order?.dispatchDate)}</p>
                  )}
                  {totals.submitstatus === "Complete" && (
  <div className="p-4 bg-green-100 border w-[60%] border-green-400 text-green-700 rounded mt-4">
    Thank you for shopping! Your order has been delivered successfully. We look forward to serving you again.
  </div>
)}
                </div>
                <div className="text-right" style={{width:"40%"}}>
                  <p>Subtotal: ₹{totals.subtotal?.toFixed(2)}</p>
                  <p>CGST (6%): ₹{totals.cgst?.toFixed(2)}</p>
                  <p>SGST (6%): ₹{totals.sgst?.toFixed(2)}</p>
                  <p className="font-bold">Grand Total: ₹{Math.ceil(totals.total)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-700">
              <p className="font-semibold">Help:</p>
              For any product-related inquiries, contact <strong className="text-blue-600">+91-8707868591</strong>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No completed orders found.</p>
        )}
      </div>
    </div>
  );
}
