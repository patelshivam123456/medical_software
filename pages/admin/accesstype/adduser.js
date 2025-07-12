"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Pagination from "@/components/Pagination/pagination";
import LoadingBtn from "@/components/Buttons/LoadingBtn";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Header from "@/components/Header";

const AddUser = (props)=> {
  const [formData, setFormData] = useState({ mobile: "", password: "", loginType: "" });
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); 
  const [loading,setLoading] = useState(false)
   const [currentPage, setCurrentPage] = useState(1);
   const [isLoggedCheck,setIsLoggedCheck] = useState('')
   const itemsPerPage = 10;

  const fetchUsers = async () => {
    const res = await axios.get("/api/users");
    setUsers(res.data);
  };

  useEffect(() => {
    if(props.isLoggedStatus){
      setIsLoggedCheck(props.isLoggedStatus)
    }
    fetchUsers();
    setFormData({ mobile: "", password: "", loginType: "" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!/^\d{10}$/.test(formData.mobile)) {
      setError("Mobile must be 10 digits");
      setLoading(false)
    }

    try {
      if (editId) {
        await axios.put(`/api/users/${editId}`, formData);
      } else {
        await axios.post("/api/users", formData);
      }
      setFormData({ mobile: "", password: "", loginType: "" });
      setEditId(null);
      setError("");
      fetchUsers();
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || "Error adding user");
      setLoading(false)
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setFormData({
      mobile: user.mobile,
      password: user.password,
      loginType: user.loginType,
    });
  };

  const handleReset = () => {
    setFormData({ mobile: "", password: "", loginType: "" });
    setEditId(null);
    setError("");
  };

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      await axios.delete(`/api/users/${confirmDeleteId}`);
      fetchUsers();
      setConfirmDeleteId(null);
    }
  };

  const filteredUsers = users.filter((u) => u.mobile.includes(search));
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedClients = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
    <Header isLoggedStatus={isLoggedCheck}/>
    <div className="p-6 max-w-4xl mx-auto">
      <div className=" bg-white text-black px-4 py-2">
        <div className="flex items-center gap-5 border-b-[1px]">
      <h2 className="text-xl font-bold">{editId ? "Edit User" : "Add User"}</h2>

      <div className="">
        <button onClick={handleReset} className="text-blue-500 underline cursor-pointer">Reset</button>
      </div></div>

      <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex flex-wrap gap-4 items-end ">
              <div className="w-full md:w-[30%] relative">
                <label>User Name:</label>
        <input
          type="text"
          placeholder="Mobile"
          maxLength={10}
          minLength={10}
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
         className="border p-2 w-full bg-gray-300  text-black outline-none rounded-sm"
          required
        />
        </div>
     

        <div className="w-full md:w-[30%] relative">
        <label>Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="border p-2 w-full bg-gray-300  text-black outline-none rounded-sm"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </span>
        </div>
        <div className="w-full md:w-[30%] relative">
        <label>Access Type:</label>
        <select
          value={formData.loginType}
          onChange={(e) => setFormData({ ...formData, loginType: e.target.value })}
          className="border px-2 py-2.5 w-full bg-gray-300  text-black outline-none rounded-sm"
          required
        >
          <option value="" disabled>Select Login Type</option>
          <option value="admin">Admin</option>
          <option value="sales">Sales</option>
          <option value="stockiest">Stockiest</option>
        </select>
        </div>
        </div>
      <div className="flex justify-end mt-2">
        {loading?<LoadingBtn/>:<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          {editId ? "Update" : "Submit"}
        </button>}
        </div>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="mt-10">
        <input
          type="text"
          placeholder="Search by mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 mb-4 w-full lg:w-[20%]"
        />
       <div className="overflow-auto">
        <table className="w-full border">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Created</th>
              <th className="border p-2">Updated</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {paginatedClients.map((user) => (
              <tr key={user._id}>
                <td className="border p-2">{user.mobile}</td>
                <td className="border p-2">{user.loginType}</td>
                <td className="border p-2">{new Date(user.createdAt).toLocaleString()}</td>
                <td className="border p-2">{new Date(user.updatedAt).toLocaleString()}</td>
                <td className="p-2  flex items-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="rounded cursor-pointer"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-yellow-600"/>
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(user._id)} // 🆕 open confirmation
                    className="  rounded cursor-pointer"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <div><Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/></div>

      {/* ✅ Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-80 text-center">
            <p className="mb-4 text-lg">Are you sure you want to delete this user?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              {loading?<LoadingBtn/>:<button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
              >
                Confirm
              </button>}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const { loggedIn, loginType } = context.req.cookies;

  if (!loggedIn && !context.query.loggedIn) {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }

  // Only allow admin or sales
  if (loggedIn && loginType !== "admin") {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }

  const isLoggedStatus= loggedIn

  return {
    props: {isLoggedStatus},
  };
}
export default AddUser