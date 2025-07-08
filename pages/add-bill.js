'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

export default function AddBillPage() {
  const [billNo, setBillNo] = useState('');
  const [availableTablets, setAvailableTablets] = useState([]);
  const [tablets, setTablets] = useState([
    { name: '', quantity: 1, price: 0, discount: 0, finalPrice: 0 }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [billNumbers, setBillNumbers] = useState([]);

  useEffect(() => {
    axios.get('/api/tablets/get').then((res) => {
      setAvailableTablets(res.data.tablets);
    });
  }, []);

  const calculateFinalPrice = (price, quantity, discount) => {
    const gross = price * quantity;
    return gross - gross * (discount / 100);
  };

  const handleTabletChange = (index, field, value) => {
    const updated = [...tablets];
    if (field === 'name') {
      const tablet = availableTablets.find((t) => t.name === value);
      if (tablet) {
        updated[index].name = tablet.name;
        updated[index].price = tablet.price;
      } else {
        updated[index].name = value;
      }
    } else {
      updated[index][field] = field === 'name' ? value : Number(value);
    }

    const { price, quantity, discount } = updated[index];
    updated[index].finalPrice = calculateFinalPrice(price, quantity, discount);

    setTablets(updated);
  };

  const addMoreTablet = () => {
    setTablets([
      ...tablets,
      { name: '', quantity: 1, price: 0, discount: 0, finalPrice: 0 }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/bills', { billNo, tablets });
    setBillNo('');
    setTablets([{ name: '', quantity: 1, price: 0, discount: 0, finalPrice: 0 }]);
  };

  const openModal = async () => {
    const res = await axios.get('/api/bills');
    setBillNumbers(res.data.bills.map((b) => b.billNo));
    setModalOpen(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Bill</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Bill No:</label>
          <input
            type="number"
            required
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {tablets.map((tab, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <div className="mb-2">
              <label>Tablet Name:</label>
              <input
                list="tablet-options"
                value={tab.name}
                onChange={(e) =>
                  handleTabletChange(index, 'name', e.target.value)
                }
                className="border p-2 w-full"
              />
              <datalist id="tablet-options">
                {availableTablets.map((t, i) => (
                  <option key={i} value={t.name} />
                ))}
              </datalist>
            </div>
            <div className="mb-2">
              <label>Quantity:</label>
              <select
                onChange={(e) =>
                  handleTabletChange(index, 'quantity', e.target.value)
                }
                value={tab.quantity}
                className="border p-2 w-full"
              >
                {[1, 2, 3, 5, 10, 20].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label>Price:</label>
              <input
                type="number"
                value={tab.price}
                onChange={(e) =>
                  handleTabletChange(index, 'price', e.target.value)
                }
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Discount:</label>
              <select
                onChange={(e) =>
                  handleTabletChange(index, 'discount', e.target.value)
                }
                value={tab.discount}
                className="border p-2 w-full"
              >
                {[0, 5, 10, 15, 20].map((d) => (
                  <option key={d} value={d}>
                    {d}%
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Final Price:</label>
              <input
                type="text"
                value={tab.finalPrice.toFixed(2)}
                disabled
                className="border p-2 w-full bg-gray-100"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addMoreTablet}
          className="bg-green-600 text-white px-4 py-2 mr-4 rounded"
        >
          Add More
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Bill
        </button>
      </form>

      <button
        onClick={openModal}
        className="mt-6 bg-gray-700 text-white px-4 py-2 rounded"
      >
        Show All Bills
      </button>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-6 border max-w-sm mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Bill Numbers</h2>
        {billNumbers.map((num, idx) => (
          <button
            key={idx}
            className="block mb-2 text-blue-600 underline"
            onClick={() => {
              setModalOpen(false);
              window.location.href = `/bill/${num}`;
            }}
          >
            View Bill #{num}
          </button>
        ))}
      </Modal>
    </div>
  );
}
