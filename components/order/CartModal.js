// 'use client';
// import React from 'react';
// import { useRouter } from 'next/router';

// const CartModal = ({ cart, removeFromCart }) => {
//   const router = useRouter();

//   const grandTotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);
//   const cgst = grandTotal * 0.06;
//   const sgst = grandTotal * 0.06;
//   const totalWithGST = grandTotal + cgst + sgst;

//   const handleContinue = () => {
//     if (cart.length === 0) return;
//     localStorage.setItem('continueFromCart', 'true');
//     router.push('/order');
//   };

//   return (
//     <div className="border rounded p-4 bg-white">
//       <h2 className="text-lg font-semibold mb-2">Cart Items</h2>
//       {cart.length === 0 ? (
//         <p>No items in cart</p>
//       ) : (
//         <>
//           <div className="overflow-auto">
//             <table className="w-full text-sm border mb-4">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2">Product</th>
//                   <th className="border p-2">Company</th>
//                   <th className="border p-2">Batch</th>
//                   <th className="border p-2">Expiry</th>
//                   <th className="border p-2">Qty</th>
//                   <th className="border p-2">Rate</th>
//                   <th className="border p-2">Total</th>
//                   <th className="border p-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.map((item, idx) => (
//                   <tr key={idx}>
//                     <td className="border p-2">{item.name}</td>
//                     <td className="border p-2">{item.company}</td>
//                     <td className="border p-2">{item.batch}</td>
//                     <td className="border p-2">{item.expiry}</td>
//                     <td className="border p-2 text-center">{item.quantity}</td>
//                     <td className="border p-2 text-right">₹{item.price}</td>
//                     <td className="border p-2 text-right">₹{item?.total?.toFixed(2)}</td>
//                     <td className="border p-2 text-center">
//                       <button
//                         onClick={() => removeFromCart(idx)}
//                         className="text-red-600 hover:underline"
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="text-right space-y-1">
//             <p>Subtotal: ₹{grandTotal.toFixed(2)}</p>
//             <p>CGST (6%): ₹{cgst.toFixed(2)}</p>
//             <p>SGST (6%): ₹{sgst.toFixed(2)}</p>
//             <p className="font-semibold text-lg">Total: ₹{Math.ceil(totalWithGST)}</p>
//           </div>
//         </>
//       )}

//       <div className="flex justify-end">
//         <button
//           onClick={handleContinue}
//           disabled={cart.length === 0}
//           className="cursor-pointer mt-4 bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartModal;


'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CartModal = ({ cart, removeFromCart }) => {
  const router = useRouter();
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  useEffect(() => {
    // Select all by default
    setSelectedIndexes(cart.map((_, idx) => idx));
  }, [cart]);

  const toggleSelection = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const selectedItems = cart.filter((_, idx) => selectedIndexes.includes(idx));
  const grandTotal = selectedItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const cgst = grandTotal * 0.06;
  const sgst = grandTotal * 0.06;
  const totalWithGST = grandTotal + cgst + sgst;

  const handleContinue = () => {
    if (selectedItems.length === 0) return;
  
    console.log("Continuing with selected cart items");
  
    // 🟢 Mark this flow as Cart Modal based
    localStorage.setItem('continueFromCart', 'true');
    localStorage.setItem('isCartFlow', 'true');
  
    // 🟢 Save selected cart items for step1 API
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
  
    // Navigate to order page
    window.open("/order", "_self");
  };
  

  return (
    <div className="border rounded p-4 bg-white">
      <div className='flex justify-between items-center'>
      <h2 className="text-lg font-semibold mb-2">Cart Items</h2>
      {cart.length > 0&&<div className='text-lg italic text-red-600 font-semibold'>Non-Returnable Item</div>}
      </div>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="w-full text-sm border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">✓</th>
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Company</th>
                  <th className="border p-2">Batch</th>
                  <th className="border p-2">Mg</th>
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
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIndexes.includes(idx)}
                        onChange={() => toggleSelection(idx)}
                      />
                    </td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.company}</td>
                    <td className="border p-2">{item.batch}</td>
                    <td className="border p-2">{item.mg}</td>
                    <td className="border p-2">{item.expiry}</td>
                    <td className="border p-2 text-center">{item.quantity}</td>
                    <td className="border p-2 text-right">₹{item.price}</td>
                    <td className="border p-2 text-right">₹{item?.total?.toFixed(2)}</td>
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
          </div>

          <div className="text-right space-y-1">
            <p>Subtotal: ₹{grandTotal.toFixed(2)}</p>
            <p>CGST (6%): ₹{cgst.toFixed(2)}</p>
            <p>SGST (6%): ₹{sgst.toFixed(2)}</p>
            <p className="font-semibold text-lg">Total: ₹{Math.ceil(totalWithGST)}</p>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={selectedItems.length === 0}
          className="cursor-pointer mt-4 bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CartModal;

