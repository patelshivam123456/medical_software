import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import AddPrductDetail from "@/components/Tables/AddPrductDetail";
import {
  DocumentDuplicateIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import LoadingBtn from "@/components/Buttons/LoadingBtn";
import Searchable from "@/components/Input/Searchable";

const Index = () => {
  const router = useRouter();
  const [billNo, setBillNo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [clientName, setClientName] = useState("");
  const [title, setTitle] = useState("");
  const [mobile, setMobile] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branch, setBranch] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [availableTablets, setAvailableTablets] = useState([]);
  const [tablets, setTablets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [billNumbers, setBillNumbers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    company: "",
    salt: "",
    quantity: 0,
    packing: "",
    batch: "",
    expiry: "",
    price: "",
    rate: "",
    discount: 0,
    sgst: 0,
    cgst: 0,
    total: 0,
    gst: 12,
    lessquantity: 0,
    category: "",
    free: 0,
    hsm: "",
  });

  // for custom dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isEditingBill, setIsEditingBill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [filteredClientNames, setFilteredClientNames] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState("new");

  const now = new Date();

  const { oldBills, newBills } = useMemo(() => {
    const oneHourAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const old = billNumbers.filter((b) => new Date(b.createdAt) < oneHourAgo);
    const newer = billNumbers.filter(
      (b) => new Date(b.createdAt) >= oneHourAgo
    );

    return { oldBills: old, newBills: newer };
  }, [billNumbers]);

  const filteredOldBills = useMemo(() => {
    return oldBills.filter((b) =>
      `SG000${b.billNo}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, oldBills]);

  const filteredNewBills = useMemo(() => {
    return newBills.filter((b) =>
      `SG000${b.billNo}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, newBills]);

  const activeBills = activeTab === "old" ? filteredOldBills : filteredNewBills;

  useEffect(() => {
    axios.get("/api/tablets/get").then((res) => {
      setAvailableTablets(res.data.tablets);
    });
    fetchClients();
  }, []);

  useEffect(() => {
    if (gst) {
      setCgst(Number(gst) / 2);
      setSgst(Number(gst) / 2);
    }
  }, [gst]);

  const filteredBillNumbers = useMemo(() => {
    return billNumbers.filter((num) =>
      `SG000${num}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, billNumbers]);

  useEffect(() => {
    const quantity = parseFloat(formFields.lessquantity) || 0;
    const rate = parseFloat(formFields.rate) || 0;
    const total = quantity * rate;
    setFormFields((prev) => ({ ...prev, total: total.toFixed(2) }));
  }, [formFields.lessquantity, formFields.rate]);


  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setFormFields({ ...formFields, expiry: value });
  };

  const addMoreTablet = () => {
    const {
      name,
      company,
      salt,
      quantity,
      packing,
      batch,
      expiry,
      price,
      discount,
      rate,
      total,
      gst,
      lessquantity,
      category,
      free,
      hsm,
    } = formFields;

    if (
      !name ||
      !company ||
      !salt ||
      !packing ||
      !batch ||
      !expiry ||
      !price ||
      !rate ||
      !total ||
      !gst ||
      !lessquantity ||
      !category
    ) {
      toast.error("Please fill all fields before adding.");
      return;
    }

    const newTablet = {
      name,
      company,
      salt,
      quantity: Number(quantity),
      packing,
      batch,
      expiry,
      price: Number(price),
      discount: Number(discount),
      rate: Number(rate),
      sgst: Number(gst) / 2,
      cgst: Number(gst) / 2,
      total: Number(total),
      gst: Number(gst),
      lessquantity: Number(lessquantity),
      category,
      free: Number(free),
      hsm,
    };

    if (editingIndex !== null) {
      const updatedTablets = [...tablets];
      updatedTablets[editingIndex] = newTablet;
      setTablets(updatedTablets);
      setEditingIndex(null);
    } else {
      setTablets([...tablets, newTablet]);
    }

    setFormFields({
      name: "",
      company: "",
      salt: "",
      quantity: 0,
      packing: "",
      batch: "",
      expiry: "",
      price: 0,
      discount: 0,
      rate: 0,
      total: 0.0,
      gst: Number(formFields.gst),
      lessquantity: 0,
      category: "",
      free: 0,
      hsm: "",
    });

    setShowSuggestions(false);
  };

  const handleEdit = (tablet, index) => {
    setFormFields({
      name: tablet.name,
      company: tablet.company,
      salt: tablet.salt,
      quantity: tablet.quantity,
      packing: tablet.packing,
      batch: tablet.batch,
      expiry: tablet.expiry,
      price: tablet.price,
      discount: tablet.discount,
      rate: tablet.rate,
      cgst: tablet.cgst,
      sgst: tablet.sgst,
      total: tablet.total,
      gst: tablet.gst,
      lessquantity: tablet.lessquantity,
      category: tablet.category,
      free: tablet.free,
      hsm: tablet.hsm,
    });
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...tablets];
    updated.splice(index, 1);
    setTablets(updated);
    setFormFields({
      name: "",
      company: "",
      salt: "",
      quantity: 0,
      packing: "",
      batch: "",
      expiry: "",
      price: "",
      discount: 0,
      rate: "",
      total: "",
      gst: Number(formFields.gst),
      lessquantity: 0,
      category: "",
      free: 0,
      hsm: "",
    });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (tablets.length === 0) {
      toast.error("Add at least one tablet before submitting.");
      return;
    }

    try {
      const response = await axios.post("/api/bills", {
        billNo,
        tablets,
        discount,
        sgst,
        cgst,
        gst: Number(gst),
        clientName,
        branchName,
        branch,
        address1,
        address2,
        pinCode,
        state,
        title,
        mobile,
      });

      if (response.status === 201) {
        setBillNo("");
        setTablets([]);
        setDiscount(0);
        setSgst(0);
        setCgst(0);
        setGst(0);
        setClientName("");
        setBranchName("");
        setBranch("");
        setAddress1("");
        setAddress2("");
        setPinCode("");
        setState("");
        setMobile("");
        setTitle("");
        setIsLoading(false);
        setIsEditingBill("");
        toast.success("Bill created successfully");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        const { status, data } = error.response;
        setIsLoading(false);
        if (status === 400) {
          toast.error(`Validation Error: ${data.message}`);
        } else if (status === 404) {
          toast.error(`Not Found: ${data.message}`);
        } else if (status === 409) {
          toast.error(`Duplicate Bill: ${data.message}`);
        } else if (status === 500) {
          toast.error(`Server Error: ${data.message}`);
        } else {
          toast.error(`Error: ${data.message || "Something went wrong"}`);
        }
      } else {
        toast.error("Network error or server not responding");
        setIsLoading(false);
      }
    }
  };

  const openModal = async () => {
    const res = await axios.get("/api/bills");
    setBillNumbers(res.data.bills);
    setModalOpen(true);
  };

  const handleCopyBill = async (billNo) => {
    try {
      const res = await axios.get(`/api/bills/${billNo}`);
      const bill = res.data.bill;
      setInputValue(bill.clientName);
      setDiscount(bill.discount || 0);
      setGst(bill.gst || 0);
      setCgst(bill.cgst || bill.gst / 2);
      setSgst(bill.sgst || bill.gst / 2);
      setClientName(bill.clientName || "");
      setTitle(bill.title || "");
      setMobile(bill.mobile || "");
      setBranchName(bill.branchName || "");
      setBranch(bill.branch || "");
      setAddress1(bill.address1 || "");
      setAddress2(bill.address2 || "");
      setPinCode(bill.pinCode || "");
      setState(bill.state || "");
      setTablets(bill.tablets || []);
      setModalOpen(false);
      setIsEditingBill("copy");
      toast.success("Bill copy");
    } catch (error) {
      toast.error("Failed to load bill details");
    }
  };
  const handleEditBill = async (billNo) => {
    try {
      const res = await axios.get(`/api/bills/${billNo}`);
      const bill = res.data.bill;
      setBillNo(bill.billNo);
      setInputValue(bill.clientName);
      setDiscount(bill.discount || 0);
      setGst(bill.gst || 0);
      setCgst(bill.cgst || bill.gst / 2);
      setSgst(bill.sgst || bill.gst / 2);
      setClientName(bill.clientName || "");
      setTitle(bill.title || "");
      setMobile(bill.mobile || "");
      setBranchName(bill.branchName || "");
      setBranch(bill.branch || "");
      setAddress1(bill.address1 || "");
      setAddress2(bill.address2 || "");
      setPinCode(bill.pinCode || "");
      setState(bill.state || "");
      setTablets(bill.tablets || []);
      setModalOpen(false);
      setIsEditingBill("edit");
      toast.success("Bill loaded for editing");
    } catch (error) {
      toast.error("Failed to load bill details");
    }
  };
  const handleUpdateBill = async () => {
    setIsLoading(true);
    if (tablets.length === 0) {
      toast.error("No tablets to update.");
      return;
    }

    try {
      const res = await axios.put(`/api/bills/${billNo}`, {
        billNo,
        tablets,
        discount,
        sgst,
        cgst,
        gst: Number(gst),
        clientName,
        branchName,
        branch,
        address1,
        address2,
        pinCode,
        state,
        title,
        mobile,
      });

      if (res.status === 200) {
        toast.success("Bill updated successfully");
        setBillNo("");
        setTablets([]);
        setDiscount(0);
        setSgst(0);
        setCgst(0);
        setGst(0);
        setClientName("");
        setBranchName("");
        setBranch("");
        setAddress1("");
        setAddress2("");
        setPinCode("");
        setState("");
        setMobile("");
        setTitle("");
        setIsLoading(false);
        setIsEditingBill("");
        setInputValue("");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error("Failed to update bill.");
    }
  };

  const handleDeleteBill = async (billNo) => {
    try {
      const res = await axios.delete(`/api/bills/${billNo}`);
      if (res.status === 200) {
        toast.success("Bill deleted successfully");
        setBillNumbers((prev) => prev.filter((b) => b !== billNo));
      }
    } catch (err) {
      toast.error("Error deleting bill");
    }
  };

  // const handleDraftBill = async (billNo) => {
  //   try {
  //     router.push(`/bill/${billNo}?draft=true`);
  //   } catch (error) {
  //     toast.error("Failed to open bill draft");
  //   }
  // };

  const handleResetForm = () => {
    setBillNo("");
    setTablets([]);
    setDiscount(0);
    setSgst(0);
    setCgst(0);
    setGst(0);
    setClientName("");
    setBranchName("");
    setBranch("");
    setAddress1("");
    setAddress2("");
    setPinCode("");
    setState("");
    setMobile("");
    setTitle("");
    setIsEditingBill("");
    setInputValue("");
    setFormFields({
      name: "",
      company: "",
      salt: "",
      quantity: 0,
      packing: "",
      batch: "",
      expiry: "",
      price: "",
      discount: 0,
      rate: "",
      total: "",
      gst: Number(formFields.gst),
      lessquantity: 0,
      category: "",
      free: 0,
      hsm: "",
    });
    toast.success("Reset successfully");
  };
  const fetchClients = async () => {
    try {
      const res = await axios.get("/api/client");
      setAllClients(res.data || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleTitleChange = (value) => {
    setTitle(value);
    setClientName("");
    setSelectedClient(null);
    setInputValue("");
    setMobile("");
    setBranch("");
    setBranchName("");
    setAddress1("");
    setAddress2("");
    setPinCode("");
    setState("");
    const filtered = allClients.filter((c) => c.title === value);
    setFilteredClientNames(filtered);
  };

  const handleClientNameChange = (value) => {
    setClientName(value);

    const found = filteredClientNames.find(
      (c) => c.clientName.toLowerCase() === value.toLowerCase()
    );

    if (found) {
      setSelectedClient(found);
      setMobile(found.mobile || "");
      setBranch(found.branch || "");
      setBranchName(found.branchName || "");
      setAddress1(found.address1 || "");
      setAddress2(found.address2 || "");
      setPinCode(found.pinCode || "");
      setState(found.state || "");
    } else {
      setSelectedClient(null);
    }
  };
  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Create Bill</h2>
          <button
            onClick={openModal}
            className=" bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            Show All Invoice
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mb-6 w-full max-w-7xl gap-5">
          <div className="flex justify-between items-center">
            <div className="w-1/2 md:w-[10%] mb-6">
              <label>Invoice No:</label>
              <input
                type="number"
                required
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="block w-full text-black bg-gray-200 border border-red-500 rounded py-2 px-4 mb-3 focus:outline-none focus:bg-white"
              />
            </div>
            {!billNo && isEditingBill === "copy" ? (
              <div
                onClick={handleResetForm}
                className={`text-green-700 font-medium pr-3 cursor-pointer`}
              >
                Reset Form
              </div>
            ) : !billNo ? (
              <div
                className={`text-green-700 font-medium pr-3 cursor-not-allowed`}
              >
                Reset Form
              </div>
            ) : (
              <div
                onClick={handleResetForm}
                className={`text-green-700 font-medium pr-3 cursor-pointer`}
              >
                Reset Form
              </div>
            )}
          </div>
          <div className="border px-4 py-3 -mt-4">
            <div className="flex justify-end mr-4">
              <button
                type="button"
                onClick={addMoreTablet}
                className="bg-green-600 text-white px-4 py-2 rounded h-[42px] cursor-pointer"
              >
                {editingIndex !== null ? "Update Tablet" : "Add More"}
              </button>
            </div>
            <div className="flex flex-wrap gap-4 items-end ">
              <div className="w-full md:w-[30%] relative">
                <label>Product Name:</label>
                <input
                  type="text"
                  value={formFields.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormFields({ ...formFields, name: value });

                    const filtered = value
                      ? availableTablets.filter((t) =>
                          t.name.toLowerCase().includes(value.toLowerCase())
                        )
                      : availableTablets;

                    setFilteredSuggestions(filtered);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    setFilteredSuggestions(availableTablets);
                    setShowSuggestions(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                  autoComplete="off"
                  required
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border max-h-[200px] overflow-y-auto shadow rounded mt-1">
                    {filteredSuggestions.map((t, i) => (
                      <li
                        key={i}
                        onMouseDown={() => {
                          setFormFields({
                            ...formFields,
                            name: t.name,
                            packing: t.packaging || "",
                            quantity: t.quantity,
                            category: t.category,
                            rate: t.rate || t.price || "",
                            company: t.company,
                            salt: t.salt,
                            discount: 10,
                            cgst: 6,
                            sgst: 6,
                            batch: t.batch,
                            expiry: t.expiry,
                            price: t.mrp,
                            total: (1 * (t.rate || t.price || 0)).toFixed(2),
                          });
                          setShowSuggestions(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                      >
                        {t.name + " " + "(" + t.packaging + ")"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="w-full md:w-[30%] ">
                <label>Comapny</label>
                <input
                  type="text"
                  value={formFields.company}
                  onChange={(e) =>
                    setFormFields({ ...formFields, company: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>
              <div className="w-full md:w-[30%] ">
                <label>Salt</label>
                <input
                  type="text"
                  disabled
                  value={formFields.salt}
                  onChange={(e) =>
                    setFormFields({ ...formFields, salt: e.target.value })
                  }
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>
              <div className="w-full md:w-[20%] ">
                <label>Category</label>
                <input
                  type="text"
                  value={formFields.category}
                  onChange={(e) =>
                    setFormFields({ ...formFields, category: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>
              <div className="w-full md:w-[10%] ">
                <label>Total Stock</label>
                <input
                  type="number"
                  value={formFields.quantity}
                  onChange={(e) =>
                    setFormFields({ ...formFields, quantity: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[10%] ">
                <label>Quantity</label>
                <input
                  type="number"
                  value={formFields.lessquantity}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      lessquantity: e.target.value,
                    })
                  }
                  className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[10%] ">
                <label>Free</label>
                <input
                  type="number"
                  value={formFields.free}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      free: e.target.value,
                    })
                  }
                  className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[10%] ">
                <label>HSM</label>
                <select
                  type="number"
                  value={formFields.hsm}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      hsm: e.target.value,
                    })
                  }
                  className="border px-2 py-2.5 w-full bg-white text-black outline-none rounded-sm"
                >
                  <option value={""}>Select HSM</option>
                  <option value={"3003"}>
                    {`3000` + "   " + `5.00` + "   " + `2.5+2.5+5 G`}
                  </option>
                  <option value={"3004"}>
                    {`3004` + "   " + `12.00` + "   " + `6+6+12 G`}
                  </option>
                </select>
              </div>

              <div className="w-full md:w-[14%] ">
                <label>Packing</label>
                <input
                  type="text"
                  value={formFields.packing}
                  onChange={(e) =>
                    setFormFields({ ...formFields, packing: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[16%] ">
                <label>Batch</label>
                <input
                  type="text"
                  value={formFields.batch}
                  onChange={(e) =>
                    setFormFields({ ...formFields, batch: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[10%] ">
                <label>Expiry</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={formFields.expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[12%] ">
                <label>MRP</label>
                <input
                  type="number"
                  value={formFields.price}
                  onChange={(e) =>
                    setFormFields({ ...formFields, price: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[12%] ">
                <label>Rate</label>
                <input
                  type="number"
                  value={formFields.rate}
                  onChange={(e) =>
                    setFormFields({ ...formFields, rate: e.target.value })
                  }
                  className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[10%] ">
                <label>Discount %</label>
                <input
                  value={formFields.discount}
                  onChange={(e) =>
                    setFormFields({ ...formFields, discount: e.target.value })
                  }
                  className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                />
              </div>
              <div className="w-full md:w-[10%] ">
                <label>GST</label>
                <select
                  type="text"
                  value={formFields.gst}
                  onChange={(e) =>
                    setFormFields({ ...formFields, gst: e.target.value })
                  }
                  className="border py-2.5 px-2 w-full bg-white text-black outline-none rounded-sm"
                >
                  <option value="0">0</option>
                  <option value="5">5</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                  <option value="28">28</option>
                </select>
              </div>
              <div className="w-full md:w-[10%] ">
                <label>CGST</label>
                <input
                  value={formFields.gst / 2}
                  onChange={(e) =>
                    setFormFields({ ...formFields, cgst: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                />
              </div>

              <div className="w-full md:w-[10%] ">
                <label>SGST</label>
                <input
                  value={formFields.gst / 2}
                  onChange={(e) =>
                    setFormFields({ ...formFields, sgst: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                />
              </div>
              <div className="w-full md:w-[10%] ">
                <label>Total</label>
                <input
                  value={formFields.total}
                  onChange={(e) =>
                    setFormFields({ ...formFields, total: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed  text-black outline-none rounded-sm"
                />
              </div>
            </div>
            <div className="border-[1px] mt-5 mb-2"></div>
            {tablets.length > 0 && (
              <div className="">
                <h3 className="text-base font-semibold mb-2">Product Detail</h3>
                <div className="flex items-center flex-wrap gap-4">
                  {tablets.map((t, index) => {
                    return (
                      <div className="flex items-center gap-2 bg-[#3b8f4b] p-2 shadow-2xl z-30 rounded-sm">
                        <div className="pr-2 text-[#f3ab37]">
                          {" "}
                          Product&nbsp;{index + 1}
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => handleEdit(t, index)}
                        >
                          <PencilSquareIcon className="h-5 w-5 text-red-500" />
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => handleDelete(t._id)}
                        >
                          <TrashIcon className="h-5 w-5 text-[#f3ab37]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="w-full md:w-[10%] ">
                <label>Discount %</label>
                <input
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                />
              </div>
              <div className="w-full md:w-[10%] ">
                <label>GST</label>
                <select
                  type="text"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="border py-2.5 px-2 w-full bg-white text-black outline-none rounded-sm"
                >
                  <option value="0">0</option>
                  <option value="5">5</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                  <option value="28">28</option>
                </select>
              </div>
              <div className="w-full md:w-[10%] ">
                <label>CGST</label>
                <input
                  type="text"
                  value={cgst}
                  disabled
                  onChange={(e) => setCgst(e.target.value)}
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                />
              </div>
              <div className="w-full md:w-[10%] ">
                <label>SGST</label>
                <input
                  type="text"
                  value={sgst}
                  disabled
                  onChange={(e) => setSgst(e.target.value)}
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                />
              </div>
            </div>

            <div className="bg-gray-200 p-4 mt-5 text-black">
              <div className="flex gap-4">
                <div className="text-base font-semibold">
                  Add Client Details
                </div>
                <a
                  href="/client"
                  className="bg-orange-600 text-white px-2 py-1 text-xs font-semibold rounded-sm cursor-pointer"
                >
                  + Client
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="w-full md:w-[10%]">
                  <label>Title</label>
                  <select
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="border py-2.5 px-2 w-full bg-white text-black outline-none rounded-sm"
                  >
                    <option value="" disabled>
                      --Select Title--
                    </option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="M/s">M/s</option>
                  </select>
                </div>
                <div className="w-full md:w-[25%]">
                  <label>Client Name</label>
                  <Searchable
                    clientNames={filteredClientNames}
                    onSelect={(value) => handleClientNameChange(value)}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    setShowOptions={setShowOptions}
                    showOptions={showOptions}
                  />
                </div>
                <div className="w-full md:w-[15%]">
                  <label>Mobile</label>
                  <input
                    type="text"
                    value={mobile}
                    maxLength={10}
                    minLength={10}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) setMobile(val);
                    }}
                    className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                    required
                  />
                </div>

                <div className="w-full md:w-[20%]">
                  <label>Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="border py-2.5 px-2 w-full bg-white text-black outline-none rounded-sm"
                    required
                  >
                    <option value="" disabled>
                      --Select Branch--
                    </option>
                    <option value="Hospital">Hospital</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>

                <div className="w-full md:w-[20%]">
                  <label>Branch Name</label>
                  <input
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                    required
                  />
                </div>

                <div className="w-full md:w-[25%]">
                  <label>Address 1</label>
                  <input
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                    required
                  />
                </div>

                <div className="w-full md:w-[25%]">
                  <label>Address 2 (Optional)</label>
                  <input
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                  />
                </div>

                <div className="w-full md:w-[20%]">
                  <label>Pincode</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    minLength={6}
                    value={pinCode}
                    onChange={(e) =>
                      setPinCode(e.target.value.replace(/\D/g, ""))
                    }
                    className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                    required
                  />
                </div>

                <div className="w-full md:w-[20%]">
                  <label>State</label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center mt-2">
            {isLoading ? (
              <LoadingBtn />
            ) : tablets.length > 0 ? (
              <button
                onClick={
                  isEditingBill === "edit" ? handleUpdateBill : handleSubmit
                }
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                {isEditingBill === "edit" ? "Update Bill" : "Submit Bill"}
              </button>
            ) : (
              <button
                type="submit"
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Submit Bill
              </button>
            )}
          </div>
        </form>
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          className="bg-white p-6 border max-w-4xl mx-auto mt-40 shadow-2xl z-[100px]"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40  overflow-y-auto"
        >
          <div
            onClick={() => setModalOpen(false)}
            className="text-end font-semibold text-sm text-blue-600 cursor-pointer"
          >
            Close
          </div>

          <h2 className="text-xl font-bold mb-4 text-black">Invoice Numbers</h2>
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 border rounded ${
                activeTab === "new"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200  text-green-600"
              }`}
              onClick={() => {
                setActiveTab("new");
                setSearchTerm("");
              }}
            >
              New Bills
            </button>
            <button
              className={`px-4 py-2 border rounded ${
                activeTab === "old"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-green-600"
              }`}
              onClick={() => {
                setActiveTab("old");
                setSearchTerm("");
              }}
            >
              Old Bills
            </button>
          </div>

          <input
            type="text"
            placeholder="Search Bill Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-sm w-full lg:w-1/2 mb-4 text-black"
          />

          <div className="flex gap-4 flex-wrap">
            {activeBills.length > 0 ? (
              activeBills.map((bill, idx) => (
                <div
                  key={idx}
                  className="bg-orange-500 py-2 px-3 flex gap-3 items-center rounded"
                >
                  <button
                    className="text-white cursor-pointer"
                    onClick={() => {
                      setModalOpen(false);
                      window.location.href = `/bill/${bill.billNo}`;
                    }}
                  >
                    SG000{bill.billNo}
                  </button>
                  <div onClick={() => handleEditBill(bill.billNo)}>
                    <PencilSquareIcon className="h-4 w-4 text-white cursor-pointer" />
                  </div>
                  <div onClick={() => handleDeleteBill(bill.billNo)}>
                    <TrashIcon className="h-4 w-4 text-white cursor-pointer" />
                  </div>
                  <div onClick={() => handleCopyBill(bill.billNo)}>
                    <DocumentDuplicateIcon className="h-4 w-4 text-white cursor-pointer" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black">No matching invoice numbers found.</p>
            )}
          </div>
        </Modal>
      </div>
    </>
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
