import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import PaymentConfirmationModal from "./PaymentConfirmationModal";
import { toast } from "react-toastify";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function PaymentsModal({ isOpen, onClose,handleEdit,handleDelete,setBillNoDelete }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [allBills, setAllBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("full");
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    if (isOpen) fetchBills();
  }, [isOpen]);

  const fetchBills = async () => {
    try {
      const res = await axios.get("/api/get-purchse");
      setAllBills(res.data.purchases);
      filterBills(res.data.purchases, search, activeTab);
    } catch (e) {
      console.error("Error fetching bills", e);
    }
  };

  const filterBills = (data, term, status) => {
    const filtered = data.filter(
      (bill) =>
        bill.ordertype === status &&
        (bill.clientName?.toLowerCase().includes(term.toLowerCase()) ||
         bill.oldbillNo?.toString().includes(term))
    );
    setFilteredBills(filtered);
  };

  useEffect(() => {
    filterBills(allBills, search, activeTab);
  }, [search, activeTab]);

  const grandTotal = filteredBills.reduce((sum, b) => sum + (b.grandtotal || 0), 0);
  const amountpaid = filteredBills.reduce((sum, b) => sum + (b.amountPaid || 0), 0);


  const openPaymentModal = (bill) => {
    onClose();
    setSelectedBill(bill);
    setPaymentType("full");
    setCustomAmount("");
    setPaymentModalOpen(true);
  };

  const confirmPayment = async () => {
    const amountPaid =
      paymentType === "full" ? selectedBill.grandtotal : Number(customAmount);

    if (paymentType === "partial" && (!amountPaid || amountPaid <= 0)) {
      toast.error("Enter valid partial amount");
      return;
    }

    try {
      const res = await axios.post("/api/update-payment-status", {
        billId: selectedBill._id,
        amountPaid,
      });

      if (res.data.success) {
        toast.success("Payment updated");
        setPaymentModalOpen(false);
        fetchBills();
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      toast.error("Failed to update payment");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="fixed z-30 inset-0">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-5xl w-full rounded shadow p-6 overflow-auto max-h-[80vh]">
            <Dialog.Title className="text-xl font-semibold mb-4">Payments</Dialog.Title>

            <div className="flex mb-4 space-x-4">
              <button
                className={`px-4 py-2 rounded ${activeTab === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded ${activeTab === "CASH" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTab("CASH")}
              >
                Done
              </button>
              <input
                className="border p-2 ml-auto rounded w-1/3"
                placeholder="Search by client name or bill no"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="mb-2 text-right font-bold text-lg">
  {activeTab === "pending" ? (
    <>
      Total Due Payment: ₹
      {(Number(grandTotal || 0) - Number(amountpaid|| 0)).toFixed(2)}
    </>
  ) : (
    <>
      Clear Payment: ₹{Number(grandTotal || 0).toFixed(2)}
    </>
  )}
</div>


            <div className="overflow-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Bill Invoice No</th>
                    <th className="border p-2">Client</th>
                    <th className="border p-2">Mobile</th>
                    <th className="border p-2">Total Amount</th>
                    <th className="border p-2">Amount paid</th>
                    <th className="border p-2">Due Amount</th>
                    <th className="border p-2">Payment Status</th>
                    <th className="border p-2">Payment Date</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill._id}>
                      <td className="border p-2">{bill.oldbillNo}</td>
                      <td className="border p-2">{bill.clientName}</td>
                      <td className="border p-2">{bill.mobile}</td>
                      <td className="border p-2">₹{bill.grandtotal}</td>
                     {bill.ordertype === "CASH"? <td className="border p-2">₹{bill.grandtotal}</td>:<td className="border p-2">₹{bill.amountPaid}</td>}
                     {bill.ordertype === "pending"? <td className="border p-2">₹{(bill?.grandtotal-bill?.amountPaid).toFixed(2)}</td>:
                     <td className="border p-2">Clear</td>}
                      <td className="border p-2 capitalize">{bill.ordertype}</td>
                      <td className="border p-2 capitalize">{!bill?.paymentDate&&bill.ordertype === "CASH"?
                      new Date().toISOString().slice(0, 10):bill.paymentDate?bill?.paymentDate?.split("T")[0]:"-"}</td>
                      <td>
                        {bill.ordertype === "pending" ? (
                            <div className="flex items-center gap-4 p-2">
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
                            onClick={() => openPaymentModal(bill)}
                          >
                            Clear
                          </button>
                          <button onClick={()=>{handleEdit(bill._id);onClose()}} className="cursor-pointer"><PencilSquareIcon className="w-4 h-4"/></button>
                          <button onClick={()=>{handleDelete();onClose();setBillNoDelete(bill._id)}} className="cursor-pointer"><TrashIcon className="w-4 h-4"/></button>
                          <a href={`/admin/purchase/${bill._id}`}><EyeIcon className="w-5 h-5"/></a>
                          </div>
                        ) : (
                            <div className="flex items-center gap-4 px-3">
                          <div className="text-green-600 text-sm italic">Payment Done</div>
                          <button onClick={()=>{handleEdit(bill._id);onClose()}} className="cursor-pointer"><PencilSquareIcon className="w-4 h-4"/></button>
                          
                          {/* <button onClick={()=>{handleDelete();onClose();setBillNoDelete(bill._id)}} className="cursor-pointer"><TrashIcon className="w-4 h-4"/></button> */}
                          <a href={`/admin/purchase/${bill._id}`}><EyeIcon className="w-5 h-5"/></a>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-4">
              <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <PaymentConfirmationModal
        confirmPayment={confirmPayment}
        paymentModalOpen={paymentModalOpen}
        setPaymentModalOpen={setPaymentModalOpen}
        setPaymentType={setPaymentType}
        paymentType={paymentType}
        customAmount={customAmount}
        setCustomAmount={setCustomAmount}
        selectedBill={selectedBill}
      />
    </>
  );
}