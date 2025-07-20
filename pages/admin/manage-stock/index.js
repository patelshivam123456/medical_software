"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import InputModal from "@/components/Modal/InputModal";
import { toast } from "react-toastify";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import LoadingBtn from "@/components/Buttons/LoadingBtn";
import Header from "@/components/Header";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

const ManageStockPage = (props) => {
  const categoryDropdownRef = useRef(null);
  const companyDropdownRef = useRef(null);
  const saltDropdownRef = useRef(null);

  const [name, setName] = useState("");
  const [packaging, setPacking] = useState("");
  const [category, setCategory] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [company, setCompany] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [filteredCompany, setFilteredCompany] = useState([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [companyError, setCompanyError] = useState("");

  const [salt, setSalt] = useState("");
  const [saltSearch, setSaltSearch] = useState("");
  const [showSaltDropdown, setShowSaltDropdown] = useState(false);
  const [saltList, setSaltList] = useState([]);
  const [filteredSalt, setFilteredSalt] = useState([]);
  const [showSaltModal, setShowSaltModal] = useState(false);
  const [newSaltName, setNewSaltName] = useState("");
  const [saltError, setSaltError] = useState("");
  const [strips,setStrips]= useState(0)
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState();
  const [purchase, setPurchase] = useState();
  const [mrp, setMrp] = useState();
  const [tablets, setTablets] = useState([]);
  const [filteredTablets, setFilteredTablets] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mg, setMg] = useState("");
  const [batch, setBatch] = useState("");
  const [expiry, setExpiry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkStatus,setCheckStatus]=useState('')
  const [saveId,setSaveId]= useState('')
  const [confirmDeleteId,setConfirmDeleteId] = useState(false)
  const [loading,setLoading]= useState(false)
  const tabletsPerPage = 5;

  const [filters, setFilters] = useState({
    expiry: "",
    name: "",
    packaging: "",
    category: "",
    company: "",
    salt: "",
    mg:"",
    strips:"",
    quantity: "",
    mrp: "",
    price: "",
    purchase:"",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(()=>{
    if(props.isCheckStatus){
      setCheckStatus(props.isCheckStatus)
    }
  },[])

  useEffect(() => {
    const searchText = search.toLowerCase();

    const filtered = tablets.filter((tab) => {
      const matchesSearch =
        !searchText ||
        [
          tab.name,
          tab.company,
          tab.salt,
          tab.expiry,
          tab.category,
          tab.mg?.toString(),
        ].some((field) => field?.toLowerCase().includes(searchText));

      const matchesColumnFilters = Object.entries(filters).every(
        ([key, value]) => {
          if (!value) return true;
          const field = tab[key];
          return field?.toString().toLowerCase().includes(value.toLowerCase());
        }
      );

      return matchesSearch && matchesColumnFilters;
    });

    setFilteredTablets(filtered);
    setCurrentPage(1);
  }, [search, filters, tablets]);

  const handleFilterChange = (e, key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const CategoryList = [
    { id: 1, value: "", option: "--Select category" },
    { id: 2, value: "DRY SYP", option: "DRY SYP" },
    { id: 3, value: "EYE DROP", option: "EYE DROP" },
    { id: 4, value: "GEL", option: "GEL" },
    { id: 5, value: "INJ", option: "INJ" },
    { id: 6, value: "KIT", option: "KIT" },
    { id: 7, value: "LIQUID", option: "LIQUID" },
    { id: 8, value: "LOTION", option: "LOTION" },
    { id: 9, value: "OIL", option: "OIL" },
    { id: 10, value: "OINTMENT", option: "OINTMENT" },
    { id: 11, value: "POWDER", option: "POWDER" },
    { id: 12, value: "REPSULES", option: "REPSULES" },
    { id: 13, value: "RESPULES", option: "RESPULES" },
    { id: 14, value: "SACHET", option: "SACHET" },
    { id: 15, value: "SOLUTION", option: "SOLUTION" },
    { id: 16, value: "SUPPOSITORI", option: "SUPPOSITORI" },
    { id: 17, value: "SURGICALS", option: "SURGICALS" },
    { id: 18, value: "SUSPENSION", option: "SUSPENSION" },
    { id: 19, value: "SYP", option: "SYP" },
    { id: 20, value: "TAB", option: "TAB" },
  ];

  const filteredCategories = CategoryList.filter((cat) =>
    cat.option.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    fetchTablets();
    fetchSalt();
    fetchCompanies();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }

      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target)
      ) {
        setShowCompanyDropdown(false);
      }
      if (
        saltDropdownRef.current &&
        !saltDropdownRef.current.contains(event.target)
      ) {
        setShowSaltDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = companyList.filter((c) =>
      c.option.toLowerCase().includes(companySearch.toLowerCase())
    );
    setFilteredCompany(filtered);
  }, [companySearch, companyList]);
  useEffect(() => {
    const filtered = saltList.filter((c) =>
      c.option.toLowerCase().includes(saltSearch.toLowerCase())
    );
    setFilteredSalt(filtered);
  }, [saltSearch, saltList]);

  const fetchTablets = async () => {
    try {
      const res = await axios.get("/api/tablets/get");
      setTablets(res.data?.success ? res.data.tablets || [] : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setTablets([]);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/api/company/list");
      setCompanyList(res.data?.success ? res.data.company || [] : []);
    } catch (err) {
      console.error("Company fetch error:", err);
      setCompanyList([]);
    }
  };

  const fetchSalt = async () => {
    try {
      const res = await axios.get("/api/salt/saltlist");
      setSaltList(res.data?.success ? res.data.salt || [] : []);
    } catch (err) {
      console.error("Salt fetch error:", err);
      setSaltList([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: name.trim(),
        packaging: packaging.trim(),
        category,
        company,
        salt,
        mg,
        strips:Number(strips),
        quantity: Number(quantity),
        price: Number(price),
        purchase: Number(purchase),
        mrp: Number(mrp),
        mg,
        batch,
        expiry,
      };

      if (editId) {
        await axios.put("/api/tablets/update", { id: editId, ...payload });
        setEditId(null);
        setIsLoading(false);
        toast.success("Product Update SuccessFully");
      } else {
        await axios.post("/api/tablets/create", payload);
        toast.success("Product Add SuccessFully");
        setIsLoading(false);
      }

      setName("");
      setPacking("");
      setCategory("");
      setCompany("");
      setSalt("");
      setSaltSearch("");
      setMg("")
      setStrips(0);
      setQuantity(0);
      setPrice("");
      setPurchase("");
      fetchTablets();
      setMrp("");
      setCompanySearch("");
      setCategorySearch("");
      setSalt("");
      setMg("");
      setBatch("");
      setExpiry("");
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error(err.response?.data?.message || "Server Error");
    }
  };

  const handleEdit = (tab) => {
    setName(tab.name);
    setPacking(tab.packaging);
    setCategory(tab.category);
    setCompany(tab.company);
    setSalt(tab.salt);
    setMg(tab.mg)
    setStrips(tab.strips);
    setQuantity(tab.quantity);
    setPrice(tab.price);
    setPurchase(tab.purchase);
    setMrp(tab.mrp);
    setEditId(tab._id);
    setMg(tab.mg);
    setBatch(tab.batch);
    setExpiry(tab.expiry);
  };

  const handleReset = () => {
    setName("");
    setPacking("");
    setCategory("");
    setCompany("");
    setSalt("");
    setStrip(0);
    setQuantity(0);
    setPrice("");
    setPurchase("");
    setMrp("");
    setCompanySearch("");
    setCategorySearch("");
    setSalt("");
    setEditId(null);
    setMg("");
    setBatch("");
    setExpiry("");
  };

  const handleDelete = async () => {
    setLoading(true)
    try {
      await axios.delete(`/api/tablets/delete?id=${saveId}`);
      fetchTablets();
      setLoading(false)
      setConfirmDeleteId(false)
    } catch (err) {
      toast.error("Delete failed");
      setLoading(false)
    }
  };

  const submitCompany = async () => {
    setIsLoading(true);
    const trimmedName = newCompanyName.trim();

    if (!trimmedName) {
      setCompanyError("Company name is required.");
      return;
    }

    try {
      await axios.post("/api/company/create", { name: trimmedName });
      setNewCompanyName("");
      setShowCompanyModal(false);
      setCompanyError("");
      fetchCompanies();
      toast.success("Company added successfully");
      setIsLoading(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add company";
      setCompanyError(msg);
      toast.error(msg);
      setIsLoading(false);
    }
  };

  const submitSalt = async () => {
    setIsLoading(true);
    const trimmedName = newSaltName.trim();

    if (!trimmedName) {
      setSaltError("Salt name is required.");
      return;
    }

    try {
      await axios.post("/api/salt/create", { name: trimmedName });
      setNewSaltName("");
      setShowSaltModal(false);
      setSaltError("");
      fetchCompanies();
      fetchSalt();
      toast.success("Salt added successfully");
      setIsLoading(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add Salt";
      setSaltError(msg);
      toast.error(msg);
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const wsData = [
      [
        "Sr. NO.",
        "Expiry",
        "Name",
        "Packing",
        "Category",
        "Company",
        "Salt",
        "Mg",
        "Strips",
        "Quantity",
        "MRP",
        "Price",
        "Purchase",
        "Created Date",
        "Updated Date",
      ],
      ...paginatedTablets.map((tab, index) => [
        index + 1,
        tab.expiry,
        tab.name,
        tab.packaging,
        tab.category,
        tab.company,
        tab.salt,
        tab.mg,
        tab.strips,
        tab.quantity,
        tab.mrp,
        tab.price,
        tab.purchase,
        tab.createdAt?.split("T")[0],
        tab.updatedAt?.split("T")[0],
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true },
      };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tablets");
    XLSX.writeFile(workbook, "tablet_data.xlsx", { cellStyles: true });
  };

  const startIndex = (currentPage - 1) * tabletsPerPage;
  const paginatedTablets = filteredTablets.slice(
    startIndex,
    startIndex + tabletsPerPage
  );
  const totalPages = Math.ceil(filteredTablets.length / tabletsPerPage);
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiry(value);
  };

  return (
    <>
     <Header isLoggedStatus={checkStatus}/>
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Purchase</h2>
      </div>
      <form onSubmit={handleSubmit} className="mb-6 w-full max-w-7xl gap-5">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Product Name</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tablet Name"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>

          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Packaging</div>
            <input
              type="text"
              value={packaging}
              onChange={(e) => setPacking(e.target.value)}
              placeholder="Packing"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>

          <div
            className="w-full md:w-[30%] px-3 mb-6 md:mb-0 relative"
            ref={categoryDropdownRef}
          >
            <div className="pb-1 text-base">Category</div>
            <input
              type="text"
              value={categorySearch || category}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setShowCategoryDropdown(true);
                if (!e.target.value) setCategory("");
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              placeholder="Search category..."
              className="text-black block w-full bg-gray-200 border border-red-500 rounded py-3 px-4 focus:outline-none focus:bg-white"
              required
            />
            {showCategoryDropdown && (
              <ul className="absolute z-10 bg-white w-full border mt-1 max-h-40 overflow-y-auto shadow-md rounded">
                {filteredCategories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.value);
                      setCategorySearch(cat.value);
                      setShowCategoryDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                  >
                    {cat.option}
                  </li>
                ))}
                {filteredCategories.length === 0 && (
                  <li className="px-4 py-2 text-gray-500">No matches found</li>
                )}
              </ul>
            )}
          </div>

          <div
            className="w-full md:w-[30%] px-3 mb-6 md:mb-0 relative"
            ref={companyDropdownRef}
          >
            <div className="flex justify-between items-center">
              <div className="pb-1 text-base">Company Name</div>
              <div
                className="text-red-400 text-sm cursor-pointer"
                onClick={() => setShowCompanyModal(true)}
              >
                +Add Company
              </div>
            </div>
            <input
              type="text"
              value={companySearch || company}
              onChange={(e) => {
                setCompanySearch(e.target.value);
                setShowCompanyDropdown(true);
                if (!e.target.value) setCompany("");
              }}
              onFocus={() => setShowCompanyDropdown(true)}
              placeholder="Search company..."
              className="block w-full bg-gray-200 border border-red-500 rounded py-3 px-4 focus:outline-none focus:bg-white text-black"
              required
            />
            {showCompanyDropdown && (
              <ul className="absolute z-10 bg-white w-full border mt-1 max-h-40 overflow-y-auto shadow-md rounded">
                {filteredCompany.map((comp) => (
                  <li
                    key={comp.id}
                    onClick={() => {
                      setCompany(comp.value);
                      setCompanySearch(comp.value);
                      setShowCompanyDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                  >
                    {comp.option}
                  </li>
                ))}
                {filteredCompany.length === 0 && (
                  <li className="px-4 py-2 text-gray-500">No matches found</li>
                )}
              </ul>
            )}
          </div>

          <div
            className="w-full md:w-[30%] px-3 mb-6 md:mb-0 relative"
            ref={saltDropdownRef}
          >
            <div className="flex justify-between items-center">
              <div className="pb-1 text-base">Salt</div>
              <div
                className="text-red-400 text-sm cursor-pointer"
                onClick={() => setShowSaltModal(true)}
              >
                +Add Salt
              </div>
            </div>
            <input
              type="text"
              value={saltSearch || salt}
              onChange={(e) => {
                setSaltSearch(e.target.value);
                setShowSaltDropdown(true);
                if (!e.target.value) setSalt("");
              }}
              onFocus={() => setShowSaltDropdown(true)}
              placeholder="Search Salt..."
              className="block w-full bg-gray-200 border border-red-500 rounded py-3 px-4 focus:outline-none focus:bg-white text-black"
              required
            />
            {showSaltDropdown && (
              <ul className="absolute z-10 bg-white w-full border mt-1 max-h-40 overflow-y-auto shadow-md rounded">
                {filteredSalt.map((comp) => (
                  <li
                    key={comp.id}
                    onClick={() => {
                      setSalt(comp.value);
                      setSaltSearch(comp.value);
                      setShowSaltDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                  >
                    {comp.option}
                  </li>
                ))}
                {filteredSalt.length === 0 && (
                  <li className="px-4 py-2 text-gray-500">No matches found</li>
                )}
              </ul>
            )}
          </div>
          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Strips</div>
            <input
              type="number"
              value={strips}
              onChange={(e) => setStrips(e.target.value)}
              placeholder="Strips"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>

          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Quantity</div>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>

          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">MRP</div>
            <input
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="MRP"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>
          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Purchase Rate</div>
            <input
              type="number"
              value={purchase}
              onChange={(e) => setPurchase(e.target.value)}
              placeholder="Rate"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>

          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Sell Rate</div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Rate"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>
          
          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Mg</div>
            <input
              type="number"
              value={mg}
              onChange={(e) => setMg(e.target.value)}
              placeholder="mg"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>
          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Batch Number</div>
            <input
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="Rate"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>
          <div className="w-full md:w-[30%] px-3 mb-6 md:mb-0">
            <div className="pb-1 text-base">Expiry</div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              className="block w-full text-black bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 focus:outline-none focus:bg-white"
              required
            />
          </div>
        </div>
        <div className="flex justify-end items-center gap-4">
          {isLoading ? (
            <LoadingBtn />
          ) : (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              {editId ? "Update" : "Add"}
            </button>
          )}
          <div
            className="text-green-600 text-base cursor-pointer"
            onClick={handleReset}
          >
            Reset
          </div>
        </div>
      </form>
      <div className="border p-6 mt-10">
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-1/2"
          />
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] ">
          <table className="w-full border mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-black">Sr. NO.</th>
                <th className="border p-2 text-black">Expiry</th>
                <th className="border p-2 text-black">Name</th>
                <th className="border p-2 text-black">Packing</th>
                <th className="border p-2 text-black">Category</th>
                <th className="border p-2 text-black">Company</th>
                <th className="border p-2 text-black">Salt</th>
                <th className="border p-2 text-black">Mg</th>
                <th className="border p-2 text-black">Strips</th>
                <th className="border p-2 text-black">Quantity</th>
                <th className="border p-2 text-black">MRP</th>
                <th className="border p-2 text-black">Purchase Price</th>
                <th className="border p-2 text-black">Sell Price</th>
                <th className="border p-2 text-black">Created date</th>
                <th className="border p-2 text-black">Updated date</th>
                <th className="border p-2 text-black">Actions</th>
              </tr>
              <tr>
                <td className="border p-1"></td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.expiry}
                    onChange={(e) => handleFilterChange(e, "expiry")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => handleFilterChange(e, "name")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.packaging}
                    onChange={(e) => handleFilterChange(e, "packaging")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.category}
                    onChange={(e) => handleFilterChange(e, "category")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.company}
                    onChange={(e) => handleFilterChange(e, "company")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.salt}
                    onChange={(e) => handleFilterChange(e, "salt")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.mg}
                    onChange={(e) => handleFilterChange(e, "mg")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.strips}
                    onChange={(e) => handleFilterChange(e, "strips")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.quantity}
                    onChange={(e) => handleFilterChange(e, "quantity")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.mrp}
                    onChange={(e) => handleFilterChange(e, "mrp")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.price}
                    onChange={(e) => handleFilterChange(e, "price")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.createdAt}
                    onChange={(e) => handleFilterChange(e, "createdAt")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.purchase}
                    onChange={(e) => handleFilterChange(e, "price")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={filters.updatedAt}
                    onChange={(e) => handleFilterChange(e, "updatedAt")}
                    className="w-full p-1 border rounded text-black"
                  />
                </td>
                <td className="border p-1"></td>
              </tr>
            </thead>
            <tbody>
              {paginatedTablets.map((tab, index) => (
                <tr key={tab._id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{tab.expiry}</td>
                  <td className="border p-2 text-center">{tab.name}</td>
                  <td className="border p-2 text-center">{tab.packaging}</td>
                  <td className="border p-2 text-center">{tab.category}</td>
                  <td className="border p-2 text-center">{tab.company}</td>
                  <td className="border p-2 text-center">{tab.salt}</td>
                  <td className="border p-2 text-center">{tab.mg}</td>
                  <td className="border p-2 text-center">{tab.strips}</td>
                  <td className="border p-2 text-center">{tab.quantity}</td>
                  <td className="border p-2 text-center">₹{tab.mrp}</td>
                  <td className="border p-2 text-center">₹{tab.price}</td>
                  <td className="border p-2 text-center">₹{tab.purchase}</td>
                  
                  <td className="border p-2 text-center">
                    {tab.createdAt?.split("T")[0]}
                  </td>
                  <td className="border p-2 text-center">
                    {tab.updatedAt?.split("T")[0]}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEdit(tab)}
                      className="text-yellow-600 font-semibold lg:text-green-600 mr-4 cursor-pointer"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>{setConfirmDeleteId(true), setSaveId(tab._id)}}
                      className="text-red-600 cursor-pointer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {showCompanyModal && (
        <>
          <InputModal
            value={newCompanyName}
            onChange={(e) => {
              setNewCompanyName(e.target.value);
              setCompanyError(false);
            }}
            onClose={() => {
              setShowCompanyModal(false);
              setCompanyError(false);
            }}
            onSubmit={submitCompany}
            label={"Add New Company"}
            Error={companyError}
            isLoading={isLoading}
          />
        </>
      )}

      {showSaltModal && (
        <>
          <InputModal
            value={newSaltName}
            onChange={(e) => {
              setNewSaltName(e.target.value);
              setSaltError(false);
            }}
            onClose={() => {
              setShowSaltModal(false);
              setSaltError(false);
            }}
            onSubmit={submitSalt}
            label={"Add New Salt"}
            Error={saltError}
            isLoading={isLoading}
          />
        </>
      )}
      <div>
        <ConfirmationModal loading={loading} title={"Are you sure want to delete this Product?"}
        confirmDeleteId={confirmDeleteId} setConfirmDeleteId={setConfirmDeleteId} confirmDelete={handleDelete}/>
      </div>
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

  // Only allow admin or sales
  if (loggedIn && loginType !== "admin" && loginType !== "stockiest") {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }

  const isCheckStatus=loggedIn

  return {
    props: {isCheckStatus},
  };
}

export default ManageStockPage;
