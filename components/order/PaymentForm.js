'use client';
import { useState } from 'react';
const PaymentForm=({ onSave })=> {
  const [type, setType] = useState('cod');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'online' && !transactionId) {
      setError('Transaction ID is required for online payment');
      return;
    }
    onSave({ type, transactionId });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
      <h2 className="text-xl font-semibold mb-2">Payment Details</h2>

      <div>
        <label className="block mb-2">Select Payment Type</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setError('');
          }}
          className="w-full p-2 border rounded"
        >
          <option value="cod">Cash on Delivery (COD)</option>
          <option value="online">Online Payment (UPI / QR)</option>
        </select>
      </div>

      {type === 'online' && (
        <div className="space-y-2">
          <img src="/qr-code.png" alt="QR Code" className="w-40 h-40" />
          <input
            type="text"
            placeholder="Enter Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
<div className='flex justify-end'>
      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer">
        Place Order
      </button>
      </div>
    </form>
  );
}
export default PaymentForm