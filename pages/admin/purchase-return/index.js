// pages/admin/purchase-return/index.js
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "@/components/Header";

const initialTablet = {
  name: "",
  company: "",
  salt: "",
  category: "",
  mg: "",
  batch: "",
  expiry: "",
  packing: "",
  strips: 0,
  quantity: 0,
  mrp: "",
  price: "",
  rate: "",
  total: 0,
  gst: 0,
  sgst: 0,
  cgst: 0,
  discount: 0,
  free: 0,
  hsm: "",
};

const initialForm = {
  oldbillNo: "",
  salesperson: "",
  paymenttype: "",
  ordertype: "pending",
  invoiceDate: "",

  clientName: "",
  mobile: "",
  branch: "",
  branchName: "",
  address1: "",
  address2: "",
  pinCode: "",
  state: "",

  gst: 0,
  cgst: 0,
  sgst: 0,
  discount: 0,

  grandtotal: 0,
};

const PurchaseReturnPage = (props) => {
  const [form, setForm] = useState(initialForm);
  const [originalBills, setOriginalBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [tablets, setTablets] = useState([]);
  const [isLoggedCheck, setIsLoggedCheck] = useState("");
  const [returnBills, setReturnBills] = useState([]);
const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (props.isLoggedStatus) setIsLoggedCheck(props.isLoggedStatus);
  }, []);

  const fetchReturnBills = async () => {
    try {
      const res = await axios.get("/api/purchase-return");
      setReturnBills(res.data.bills || []);
    } catch (err) {
      console.error("Failed to load return bills", err);
    }
  };

  useEffect(() => {
    axios.get("/api/new-purchase").then((res) => {
      setOriginalBills(res.data.bills || []);
    });
  }, []);

  const handleSelectOriginal = (e) => {
    const billId = e.target.value;
    const bill = originalBills.find((b) => b._id === billId);
    if (bill) {
      setSelectedBill(bill);
      setForm({ ...initialForm, ...bill });
      setTablets(bill.tablets);
    }
  };

  const handleTabletChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...tablets];
    const numericFields = [
        "strips", "price", "quantity", "rate", "mrp", "gst", "cgst", "sgst", "discount", "free"
      ];
      
      updated[index][name] = numericFields.includes(name) ? Number(value) : value;

    if (name === "strips" || name === "price") {
      const strips = name === "strips" ? Number(value) : Number(updated[index].strips);
      const price = name === "price" ? Number(value) : Number(updated[index].price);
      updated[index].total = strips * price;
    }

    if (name === "packing" || name === "strips" || name === "free") {
      const pack = name === "packing" ? Number(value.split("*")[1]) : Number(updated[index].packing.split("*")[1]);
      const strips = name === "strips" ? Number(value) : Number(updated[index].strips);
      const free = name === "free" ? Number(value) : Number(updated[index].free);
      updated[index].quantity = pack * (strips + free);
    }

    if (name === "gst") {
      const gstValue = Number(value);
      updated[index].cgst = gstValue / 2;
      updated[index].sgst = gstValue / 2;
      updated[index].gst = gstValue;
    }

    setTablets(updated);
  };

  const calculateGrandTotal = () => {
    return tablets.reduce((sum, tab) => sum + Number(tab.total || 0), 0);
  };

  const handleSubmit = async () => {
    const returnTablets = tablets.filter((t) => t.strips > 0 || t.quantity > 0);
    if (returnTablets.length === 0) {
      toast.error("Please enter quantity to return.");
      return;
    }
    const payload = {
      ...form,
      tablets: returnTablets,
      originalPurchaseId: selectedBill._id,
      returnBillNo: Date.now(),
      grandtotal: calculateGrandTotal(),
    };

    try {
      const res = await axios.post("/api/purchase-return", payload);
      if (res.data.success) {
        toast.success("Return submitted!");
        setSelectedBill(null);
        setForm(initialForm);
        setTablets([]);
      } else toast.error("Failed to return.");
    } catch (err) {
      console.error(err);
      toast.error("Error while submitting return.");
    }
  };

  const handleDeleteReturn = async (id) => {
    if (!window.confirm("Are you sure you want to delete this return bill?")) return;
  
    try {
      const res = await axios.delete(`/api/purchase-return/${id}`);
      if (res.data.success) {
        toast.success("Return bill deleted.");
        fetchReturnBills(); // refresh list
      } else {
        toast.error("Failed to delete return bill.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting return bill.");
    }
  };

  return (
    <>
      <Header isLoggedStatus={isLoggedCheck} />
      <div className="max-w-[1400px] mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Purchase Return</h1>
          <button
  onClick={() => {
    setShowModal(true);
    fetchReturnBills();
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
>
  Show Return Bills
</button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="col-span-2">
            <label className="mb-1 font-semibold">Select Original Bill</label>
            <select onChange={handleSelectOriginal} className="border p-2 w-full">
              <option value="">-- Select Bill --</option>
              {originalBills.map((b) => (
                <option key={b._id} value={b._id}>
                  #{b.billNo} - {b.clientName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tablet Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-[1200px] border text-sm">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(initialTablet).map((field) => (
                  <th key={field} className="border p-2">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tablets.map((tab, index) => (
                <tr key={index}>
                  {Object.keys(initialTablet).map((field) => (
                    <td key={field} className="border p-1">
                      <input
                        className="w-full border p-1"
                        type={typeof initialTablet[field] === "number" ? "number" : "text"}
                        name={field}
                        value={tab[field]}
                        onChange={(e) => handleTabletChange(e, index)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Grand Total: ₹{calculateGrandTotal()}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Submit Return
          </button>
        </div>
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-4 max-w-6xl w-full rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Purchase Return List</h2>
        <button onClick={() => setShowModal(false)}>❌</button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Bill No</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Grand Total</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {returnBills.map((bill) => (
            <tr key={bill._id}>
              <td className="border p-2">#{bill.returnBillNo}</td>
              <td className="border p-2">{bill.clientName}</td>
              <td className="border p-2">{bill.invoiceDate}</td>
              <td className="border p-2">₹{bill.grandtotal}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    setSelectedBill(bill);
                    setForm({ ...initialForm, ...bill });
                    setTablets(bill.tablets || []);
                    setShowModal(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() =>
                    window.open(`/admin/purchase-return/${bill._id}`, "_blank")
                  }
                >
                  View
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteReturn(bill._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

    </>
  );
};

export async function getServerSideProps(context) {
  const { loggedIn, loginType } = context.req.cookies;
  if (!loggedIn && !context.query.loggedIn) {
    return { props: {}, redirect: { destination: "/admin" } };
  }
  if (loggedIn && loginType !== "admin" && loginType !== "stockiest") {
    return { props: {}, redirect: { destination: "/admin" } };
  }
  return { props: { isLoggedStatus: loggedIn } };
}

export default PurchaseReturnPage;