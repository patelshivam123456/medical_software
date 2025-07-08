import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  BackwardIcon,
  ForwardIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import LoadingBtn from "@/components/Buttons/LoadingBtn";

const Index = () => {
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    mobile: "",
    branch: "",
    branchName: "",
    address1: "",
    address2: "",
    pinCode: "",
    state: "",
  });
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading,setIsLoading] =useState(false)
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await axios.get("/api/client");
    setClients(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (editId) {
      // Update existing client
      await axios.put(`/api/client/${editId}`, formData);
    } else {
      // Add new client
      await axios.post("/api/client", formData);
    }

    setFormData({
      title: "",
      clientName: "",
      mobile: "",
      branch: "",
      branchName: "",
      address1: "",
      address2: "",
      pinCode: "",
      state: "",
    });
    setIsLoading(false)
    setEditId(null);
    fetchClients();
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    await axios.delete(`/api/client/${deleteId}`);
    fetchClients();
    setModalOpen(false);
  };
  const handleEdit = (client) => {
    setEditId(client._id);
    setFormData({
      title: client.title || "",
      clientName: client.clientName || "",
      mobile: client.mobile || "",
      branch: client.branch || "",
      branchName: client.branchName || "",
      address1: client.address1 || "",
      address2: client.address2 || "",
      pinCode: client.pinCode || "",
      state: client.state || "",
    });
  };

  const handleReset = () => {
    setFormData({
      title: "",
      clientName: "",
      mobile: "",
      branch: "",
      branchName: "",
      address1: "",
      address2: "",
      pinCode: "",
      state: "",
    });
    setEditId(null);
  };
  const filteredClients = clients.filter(
    ({ title, clientName, mobile, branch, branchName }) => {
      const term = searchTerm.toLowerCase();
      return (
        title?.toLowerCase().includes(term) ||
        clientName?.toLowerCase().includes(term) ||
        mobile?.toLowerCase().includes(term) ||
        branch?.toLowerCase().includes(term) ||
        branchName?.toLowerCase().includes(term)
      );
    }
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="w-full md:w-[10%] ">
            <label>Title</label>
            <select
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border py-2.5 px-2 w-full bg-white text-black outline-none rounded-sm"
            >
              <option value="" disabled>
                --Select Title--
              </option>
              <option value="Mr.">Mr.</option>Title
              <option value="Mrs.">Mrs.</option>
              <option value="M/s">M/s</option>
            </select>
          </div>
          <div className="w-full md:w-[25%] ">
            <label>Client Name</label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              className="border p-2 w-full bg-white text-black outline-none rounded-sm"
            />
          </div>
          <div className="w-full md:w-[15%] ">
            <label>Mobile</label>
            <input
              type="text"
              required
              value={formData.mobile}
              maxLength={10}
              minLength={10}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setFormData({ ...formData, mobile: val });
                }
              }}
              className="border p-2 w-full bg-white text-black outline-none rounded-sm"
            />
          </div>
          <div className="w-full md:w-[20%] ">
            <label>Branch</label>
            <select
              required
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              className="border py-2.5 px-2 w-full bg-white text-black outline-none rounded-sm"
            >
              <option value="" disabled>
                --Select Branch--
              </option>
              <option value="Hospital">Hospital</option>
              <option value="Medical">Medical</option>
            </select>
          </div>
          <div className="w-full md:w-[20%] ">
            <label>Branch Name</label>
            <input
              required
              value={formData.branchName}
              onChange={(e) =>
                setFormData({ ...formData, branchName: e.target.value })
              }
              className="border p-2 w-full bg-white text-black outline-none rounded-sm"
            />
          </div>
          <div className="w-full md:w-[25%] ">
            <label>Address 1</label>
            <input
              required
              value={formData.address1}
              onChange={(e) =>
                setFormData({ ...formData, address1: e.target.value })
              }
              className="border p-2 w-full bg-white text-black outline-none rounded-sm"
            />
          </div>
          <div className="w-full md:w-[25%] ">
            <label>Address 2 (Optional)</label>
            <input
              value={formData.address2}
              onChange={(e) =>
                setFormData({ ...formData, address2: e.target.value })
              }
              className="border p-2 w-full bg-white text-black outline-none rounded-sm"
            />
          </div>
          <div className="w-full md:w-[20%] ">
            <label>Pincode</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              minLength={6}
              required
              value={formData.pinCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pinCode: e.target.value.replace(/\D/g, ""),
                })
              }
              className="border p-2 w-full bg-white text-black outline-none rounded-sm"
            />
          </div>
          <div className="w-full md:w-[20%] ">
            <label>State</label>
            <input
              required
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="border p-2 w-full bg-white text-black outline-none rounded-sm"
            />
          </div>
        </div>
        <div className="flex justify-end items-center mt-4 gap-4">
         {isLoading?<LoadingBtn/>: <button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            {editId ? "Update" : "Submit"}
          </button>}
          <div onClick={handleReset} className="text-green-600 cursor-pointer">
            Reset Form
          </div>
        </div>
      </form>
      {clients.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Client List</h3>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); 
              }}
              className="border px-3 py-2 rounded w-64"
            />
          </div>
          <table className="w-full border mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-black">Name</th>
                <th className="p-2 border text-black">Mobile</th>
                <th className="p-2 border text-black">Branch</th>
                <th className="p-2 border text-black">Branch Name</th>
                <th className="p-2 border text-black">Address</th>
                <th className="p-2 border text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map((client) => (
                <tr key={client._id}>
                  <td className="p-2 border text-center">
                    {client.title} {client.clientName}
                  </td>
                  <td className="p-2 border text-center">{client.mobile}</td>
                  <td className="p-2 border text-center">{client.branch}</td>
                  <td className="p-2 border text-center">
                    {client.branchName}
                  </td>
                  <td className="p-2 border text-center">
                    {client.address1 +
                      "," +
                      client.address2 +
                      "," +
                      client.state +
                      "-" +
                      client.pinCode}
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => openDeleteModal(client._id)}
                      className="text-red-600 cursor-pointer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-green-600 cursor-pointer"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                className="px-1 cursor-pointer py-1  disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <BackwardIcon className="w-5 h-6 text-blue-500" />
              </button>
              <span className="text-sm font-medium">
                Page <span className="text-orange-600"> {currentPage}</span> of{" "}
                {totalPages}
              </span>
              <button
                className="px-1 py-1 cursor-pointer disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ForwardIcon className="w-5 h-5 text-blue-500" />
              </button>
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-6 rounded shadow-xl max-w-md mx-auto mt-40"
      >
        <h2 className="text-lg font-bold mb-4 text-black">Confirm Deletion</h2>
        <p className="mb-6 text-black">
          Are you sure you want to delete this client?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalOpen(false)}
            className="cursor-pointer px-4 py-2 border text-gray-500 border-gray-500 "
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer px-4 py-2 bg-red-600 text-white"
          >
            Yes, Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (!context.req.cookies.loggedIn && !context.query.loggedIn) {
    return {
      props: {},
      redirect: { destination: "/login" },
    };
  }

  return {
    props: {},
  };
}

export default Index;
