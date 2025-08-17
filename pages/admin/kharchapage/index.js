"use client";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Header from "@/components/Header";
import { TrashIcon } from "@heroicons/react/20/solid";

const fetcher = (url) => fetch(url).then((res) => res.json());

const KharchaPage = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    date: "",
    details: "",
    personName: "",
    amount: "",
    paidAmount: "",
    remainingAmount: 0,
    status: "Pending",
  });

  const [filters, setFilters] = useState({
    person: "",
    details: "",
    status: "All",
  });
  const [editingId, setEditingId] = useState(null);
  const [checkStatus, setCheckStatus] = useState("");
  const [loadingBtn, setLoadingBtn] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Added loader state
  const [deleteId, setDeleteId] = useState(null);

  // Build query with filters
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.status !== "All") params.set("status", filters.status);
    if (filters.person) params.set("person", filters.person);
    if (filters.details) params.set("details", filters.details);
    return `/api/kharcha${params.toString() ? `?${params.toString()}` : ""}`;
  }, [filters]);

  const { data, mutate, isLoading } = useSWR(query, fetcher);
  const items = data?.data || [];

  useEffect(() => {
    if (props.isCheckStatus) {
      setCheckStatus(props.isCheckStatus);
    }
  }, []);

  // Auto calculate remaining amount
  useEffect(() => {
    const amount = Number(form.amount) || 0;
    const paid = Number(form.paidAmount) || 0;
    const remaining = Math.max(amount - paid, 0);
    setForm((f) => ({ ...f, remainingAmount: remaining }));
  }, [form.amount, form.paidAmount]);

  // Add Kharcha
  async function handleSubmit(e) {
    setLoadingBtn("submit");
    setIsProcessing(true); // ✅ Start loader
    e.preventDefault();
    const payload = {
      ...form,
      amount: Number(form.amount) || 0,
      paidAmount: Number(form.paidAmount) || 0,
    };

    let res;
    if (editingId) {
      // update existing
      res = await fetch(`/api/kharcha/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // create new
      res = await fetch(`/api/kharcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const json = await res.json();
    if (json.success) {
      setShowModal(false);
      setEditingId(null); // reset
      setForm({
        date: "",
        details: "",
        personName: "",
        amount: "",
        paidAmount: "",
        remainingAmount: 0,
        status: "Pending",
      });
      mutate();
    } else {
      alert(json.message || "Failed to save");
    }
    setIsProcessing(false); // ✅ Stop loader
  }

  function handleEdit(item) {
    setForm({
      date: item.date ? new Date(item.date).toISOString().slice(0, 10) : "",
      details: item.details,
      personName: item.personName,
      amount: item.amount,
      paidAmount: item.paidAmount,
      remainingAmount: item.remainingAmount,
      status: item.status,
    });
    setEditingId(item._id);
    setShowModal(true);
  }

  // Delete Kharcha
  async function confirmDelete(id) {
    if (!deleteId) return;
    setIsProcessing(true); // ✅ Start loader
    const res = await fetch(`/api/kharcha/${deleteId}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) mutate();
    setIsProcessing(false);
    setDeleteId(null); // ✅ Stop loader
  }

  // Update Kharcha (status change etc.)
  async function handleUpdate(id, patch) {
    setIsProcessing(true); // ✅ Start loader
    const res = await fetch(`/api/kharcha/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const json = await res.json();
    if (json.success) mutate();
    setIsProcessing(false); // ✅ Stop loader
  }

  // Total Remaining
  const totalRemaining = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.remainingAmount) || 0), 0);
  }, [items]);
  const totalAmount = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  }, [items]);


  // Download PDF
  function downloadPDF() {
    const doc = new jsPDF({ orientation: "landscape" });
    const rows = items.map((it) => [
      new Date(it.date).toLocaleDateString(),
      it.details,
      it.personName,
      it.amount,
      it.paidAmount,
      it.remainingAmount,
      it.status,
    ]);

    autoTable(doc, {
      head: [["Date", "Details", "Person", "Amount", "Paid", "Remaining", "Status"]],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [33, 150, 243] },
      foot: [["", "", "", "", "Total Remaining", String(totalRemaining), ""]],
      footStyles: { halign: "right" },
      margin: { top: 16 },
      didDrawPage: (data) => {
        doc.setFontSize(14);
        doc.text("Kharcha Report", data.settings.margin.left, 12);
      },
    });

    doc.save(`kharcha_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <>
      <Header isLoggedStatus={checkStatus} />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Kharcha</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-2xl shadow bg-blue-600 text-white"
            >
              Add
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 rounded-2xl shadow bg-gray-800 text-white"
            >
             PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Filter by Person Name"
            value={filters.person}
            onChange={(e) => setFilters((f) => ({ ...f, person: e.target.value }))}
            className="border rounded-xl px-3 py-2"
          />
          <input
            type="text"
            placeholder="Filter by Details"
            value={filters.details}
            onChange={(e) => setFilters((f) => ({ ...f, details: e.target.value }))}
            className="border rounded-xl px-3 py-2"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="border rounded-xl px-3 py-2"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
          </select>
          <div className="flex items-center text-sm text-gray-600">
            {isLoading ? "Loading..." : `${items.length} rows`}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative">
          {isProcessing && ( // ✅ Loader Overlay
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <table className="min-w-full border divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left min-w-[250px]">Details</th>
                <th className="px-3 py-2 text-left">Person</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-right">Paid</th>
                <th className="px-3 py-2 text-right">Remaining</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2">
                    {new Date(it.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{it.details}</td>
                  <td className="px-3 py-2">{it.personName}</td>
                  <td className="px-3 py-2 text-right">{it.amount}</td>
                  <td className="px-3 py-2 text-right">{it.paidAmount}</td>
                  <td className="px-3 py-2 text-right font-medium">
                    {it.remainingAmount}
                  </td>
                  <td className="px-3 py-2 text-right" style={it.status==="Pending"?{color:"red"}:{color:"green",fontWeight:"bold"}}>
                    {it.status}
                  </td>
                  {/* <td className="px-3 py-2">
                    <select
                      value={it.status}
                      onChange={(e) => handleUpdate(it._id, { status: e.target.value })}
                      className="border rounded-md px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Done">Done</option>
                    </select>
                  </td> */}
                  <td className="px-3 py-2 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(it)}
                      className="px-3 py-1 rounded-lg cursor-pointer bg-yellow-500 text-white"
                    >
                      ✎
                    </button>
                    <button
                     
                      onClick={() => setDeleteId(it._id)}
                      className="px-3 py-1 rounded-lg cursor-pointer bg-red-600 text-white"
                    >
                      <TrashIcon className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="px-3 py-2" colSpan={3}>
                  {filters.status === "Pending" || filters.status === "Done" ? (
                    <span>Total Remaining ({filters.status}):</span>
                  ) : (
                    <span>Total Remaining (All):</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">{totalAmount}</td>
                <td className="px-3 py-2 text-right" colSpan={2}>{totalRemaining}</td>
                <td className="px-3 py-2" colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add Kharcha</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Person Name</label>
                  <input
                    type="text"
                    value={form.personName}
                    onChange={(e) =>
                      setForm({ ...form, personName: e.target.value })
                    }
                    className="w-full border rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Details</label>
                  <input
                    type="text"
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Amount</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Paid Amount</label>
                  <input
                    type="number"
                    value={form.paidAmount}
                    onChange={(e) =>
                      setForm({ ...form, paidAmount: e.target.value })
                    }
                    className="w-full border rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Remaining Amount</label>
                  <input
                    type="number"
                    value={form.remainingAmount}
                    readOnly
                    className="w-full border rounded-xl px-3 py-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isProcessing ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p className="mb-4">Are you sure you want to delete this Entry?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 border rounded cursor-pointer"
                  disabled={loadingBtn === "delete"}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                  disabled={loadingBtn === "delete"}
                >
                  {/* {loadingBtn === "delete" ? "Deleting..." : "Delete"} */}
                  {isProcessing ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
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

  if (loggedIn && loginType !== "admin") {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }

  const isCheckStatus = loggedIn;

  return {
    props: { isCheckStatus },
  };
}
export default KharchaPage;
