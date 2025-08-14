"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Header from "@/components/Header";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ProductList = (props) => {
  const [sort, setSort] = useState("name:asc");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    salt: "",
    mrp: "",
    rate: "",
    discount: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [checkStatus, setCheckStatus] = useState("");

  const { data, mutate } = useSWR(
    `/api/products?sort=${sort}&q=${search}`,
    fetcher
  );

  const items = data?.items || [];

  useEffect(() => {
    if (props.isCheckStatus) {
      setCheckStatus(props.isCheckStatus);
    }
  }, []);

  function resetForm() {
    setForm({
      name: "",
      company: "",
      salt: "",
      mrp: "",
      rate: "",
      discount: "",
    });
    setEditingId(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoadingBtn("submit");
    try {
      const payload = {
        name: form.name.trim(),
        company: form.company.trim(),
        salt: form.salt.trim(),
        mrp: Number(form.mrp),
        rate: Number(form.rate),
        discount: form.discount === "" ? 0 : Number(form.discount),
      };
      if (!payload.name || isNaN(payload.mrp) || isNaN(payload.rate)) {
        alert("Please fill required fields (name, company, salt, mrp, rate).");
        return;
      }
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }
      await mutate();
      resetForm();
      setShowModal(false);
    } finally {
      setLoadingBtn("");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setLoadingBtn("delete");
    try {
      await axios.delete(`/api/products/${deleteId}`);
      await mutate();
    } finally {
      setLoadingBtn("");
      setDeleteId(null);
    }
  }

  function onEdit(p) {
    setForm({
      name: p.name,
      company: p.company,
      salt: p.salt,
      mrp: p.mrp,
      rate: p.rate,
      discount: p.discount,
    });
    setEditingId(p._id);
    setShowModal(true);
  }

  function downloadPDF(data) {
    setLoadingBtn("download");
    const doc = new jsPDF();
    const columns = ["Product Name", "MRP", "Rate"];
    const rows = (data || []).map((p) => [
      p.name,
      p.mrp,
      p.rate
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("products.pdf");
    setLoadingBtn("");
  }

  return (
    <>
      <Header isLoggedStatus={checkStatus} />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Product List</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
  <input
    type="text"
    placeholder="Search..."
    className="border px-3 py-2 rounded w-full sm:w-auto"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
      disabled={loadingBtn === "submit"}
    >
      + Add Product
    </button>
    <button
      onClick={() => downloadPDF(items)}
      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
      disabled={loadingBtn === "download"}
    >
      {loadingBtn === "download" ? "Downloading..." : "Download PDF"}
    </button>
    <button
      onClick={() => {
        setLoadingBtn("refresh");
        mutate().finally(() => setLoadingBtn(""));
      }}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
      disabled={loadingBtn === "refresh"}
    >
      {loadingBtn === "refresh" ? "Refreshing..." : "Refresh"}
    </button>
  </div>
</div>

        {/* Table */}
        <div className="overflow-x-auto">
  <table className="w-full border text-sm">
    <thead>
      <tr className="bg-gray-200">
        {["name", "company", "salt", "mrp", "rate", "discount"].map((col) => (
          <th
            key={col}
            className="border px-2 py-1 cursor-pointer whitespace-nowrap"
            onClick={() =>
              setSort(`${col}:${sort.endsWith("asc") ? "desc" : "asc"}`)
            }
          >
            {col.toUpperCase()}
          </th>
        ))}
        <th className="border px-2 py-1">Actions</th>
      </tr>
    </thead>
    <tbody>
      {items.map((p) => (
        <tr key={p._id}>
          <td className="border px-2 py-1">{p.name}</td>
          <td className="border px-2 py-1">{p.company}</td>
          <td className="border px-2 py-1">{p.salt}</td>
          <td className="border px-2 py-1">{p.mrp}</td>
          <td className="border px-2 py-1">{p.rate}</td>
          <td className="border px-2 py-1">{p.discount}</td>
          <td className="border px-2 py-1 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onEdit(p)}
              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
              disabled={loadingBtn === "edit"}
            >
              {loadingBtn === "edit" ? "Editing..." : "Edit"}
            </button>
            <button
              onClick={() => setDeleteId(p._id)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
              disabled={loadingBtn === "delete"}
            >
              {loadingBtn === "delete" && deleteId === p._id
                ? "Deleting..."
                : "Delete"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* Add / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <form onSubmit={onSubmit} className="flex flex-col gap-2">
                {["name", "company", "salt", "mrp", "rate", "discount"].map(
                  (f) => (
                    <input
                      key={f}
                      type={["mrp", "rate", "discount"].includes(f) ? "number" : "text"}
                      placeholder={f}
                      className="border px-3 py-2 rounded"
                      value={form[f]}
                      onChange={(e) =>
                        setForm({ ...form, [f]: e.target.value })
                      }
                    />
                  )
                )}
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                    className="px-4 py-2 border rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingBtn === "submit"}
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                  >
                    {loadingBtn === "submit"
                      ? editingId
                        ? "Updating..."
                        : "Adding..."
                      : editingId
                      ? "Update"
                      : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p className="mb-4">Are you sure you want to delete this product?</p>
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
                  {loadingBtn === "delete" ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
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

export default ProductList;
