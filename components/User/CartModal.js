import React from 'react';

const CartModal=({ cart, removeFromCart })=> {
  const grandTotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);
  const cgst = grandTotal * 0.06;
  const sgst = grandTotal * 0.06;
  const totalWithGST = grandTotal + cgst + sgst;

  return (
    <div className="border rounded p-4 bg-white">
      <h2 className="text-lg font-semibold mb-2">Cart Items</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <table className="w-full text-sm border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Product</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Batch</th>
                <th className="border p-2">Expiry</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Rate</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.company}</td>
                  <td className="border p-2">{item.batch}</td>
                  <td className="border p-2">{item.expiry}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-right">₹{item.rate}</td>
                  <td className="border p-2 text-right">₹{item.total}</td>
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

          <div className="text-right space-y-1">
            <p>Subtotal: ₹{grandTotal.toFixed(2)}</p>
            <p>CGST (6%): ₹{cgst.toFixed(2)}</p>
            <p>SGST (6%): ₹{sgst.toFixed(2)}</p>
            <p className="font-semibold text-lg">Total: ₹{totalWithGST.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
}
export default CartModal