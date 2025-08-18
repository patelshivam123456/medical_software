import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PaymentsModal from "@/components/Modal/PaymentModal";
import Header from "@/components/Header";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import InputModal from "@/components/Modal/InputModal";

const initialTablet = {
  name: "",
  company: "",
  salt: "",
  category: "",
  mg:"",
  batch: "",
  mg:"",
  expiry: "",
  packing: "",
  strips: 0,
  free: 0,
  quantity: 0,
  mrp: "",
  price: "",
  rate: "",
  total: 0,
  gst: 0,
  sgst: 0,
  cgst: 0,
  discount: 0,
 
  hsm: "",
  
};

const initialForm = {
  oldbillNo: "",
  salesperson: "",
  paymenttype: "",
  ordertype: "pending",
  invoiceDate:"",

  clientName: "",
  mobile: "",
  branch: "",
  branchName: "",
  address1: "",
  address2: "",
  pinCode: "",
  state: "",
  email:"",
  accountDetails:"",
  accountNumber:"",
  accountIfscCode:"",
  gstIn:"",
  gst: 0,
  cgst: 0,
  sgst: 0,
  discount: 0,
  
  grandtotal: 0,
  
  amountPaid:0,
};

const NewPurchasePage=(props)=> {
  const [form, setForm] = useState(initialForm);
  const [clients, setClients] = useState([]);
  const [tablets, setTablets] = useState([]);
  const [tabletForm, setTabletForm] = useState(initialTablet);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBillId, setEditBillId] = useState(null);
  const [isLoggedCheck,setIsLoggedCheck] = useState('')
  const [errors, setErrors] = useState({});
  const [editTabletIndex, setEditTabletIndex] = useState(null);
  const [confirmDeleteId,setConfirmDeleteId] = useState(false)
  const [billNoDelete, setBillNoDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [companyError, setCompanyError] = useState("");

  const [saltList, setSaltList] = useState([]);
  const [filteredSalts, setFilteredSalts] = useState([]);
  const [showSaltDropdown, setShowSaltDropdown] = useState(false);

  const [showSaltModal, setShowSaltModal] = useState(false);
  const [newSaltName, setNewSaltName] = useState("");
  const [saltError, setSaltError] = useState("");
  


  useEffect(() => {
    fetchCompanies();
    fetchSalt()
  }, []);

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

  useEffect(()=>{
    if(props.isLoggedStatus){
        setIsLoggedCheck(props.isLoggedStatus)
      }
  },[])
  useEffect(() => {
    const fetchClients = async () => {
      const res = await axios.get("/api/new-stockiest-pharam");
      setClients(res.data);
    };
    fetchClients();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (clientName) => {
    const selectedClient = clients.find((c) => c.clientName === clientName);
    if (selectedClient) {
      setForm((prev) => ({
        ...prev,
        clientName: selectedClient.clientName,
        mobile: selectedClient.mobile || "",
        branch: selectedClient.branch || "",
        branchName: selectedClient.branchName || "",
        address1: selectedClient.address1 || "",
        address2: selectedClient.address2 || "",
        pinCode: selectedClient.pinCode || "",
        state: selectedClient.state || "",
        email:selectedClient.email||"",
        accountDetails:selectedClient.accountDetails||"",
        accountNumber:selectedClient.accountNumber||"",
        accountIfscCode:selectedClient.accountIfscCode||"",
        gstIn:selectedClient.gstIn||""
      }));
    }
  };

  const handleTabletChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "strips" ) {
      newValue = Number(value);
    }

    let updatedForm = {
      ...tabletForm,
      [name]: newValue,
    };

    if (name === "strips" || name === "price") {
      const strips = name === "strips" ? Number(value) : Number(tabletForm.strips);
      const price = name === "price" ? Number(value) : Number(tabletForm.price);
      updatedForm.total = strips * price;
    }
    if (name === "packing" || name === "strips"||name==="free") {
        const pack = name === "packing" ? Number(value.split("*")[1]) : Number(tabletForm?.packing.split("*")[1]);
        const strips = name === "strips" ? Number(value) : Number(tabletForm.strips);
        const free = name === "free" ? Number(value) : Number(tabletForm.free);
        updatedForm.quantity = pack * (strips+free);
      }

    if (name === "gst") {
      const gstValue = Number(value);
      updatedForm.cgst = gstValue / 2;
      updatedForm.sgst = gstValue / 2;
      updatedForm.gst = gstValue;
    }

    setTabletForm(updatedForm);
    setErrors((prev) => ({ ...prev, [name]: false }));
  };




const handleAddTablet = () => {
    const newErrors = {};
    let isValid = true;
  
    const optionalFields = ["gst", "cgst", "sgst", "free", "hsm", "discount"];
  
    Object.keys(initialTablet).forEach((field) => {
      if (optionalFields.includes(field)) return;
  
      const value = tabletForm[field];
      if (
        value === "" ||
        value === null ||
        (typeof value === "number" && value === 0)
      ) {
        newErrors[field] = true;
        isValid = false;
      }
    });
  
    if (!isValid) {
      setErrors(newErrors);
      toast.error("Please fill all fields correctly before continuing.");
      return;
    }
  
    const cleanedTablet = {
      ...tabletForm,
      quantity: Number(tabletForm.quantity),
      rate: Number(tabletForm.rate),
      mrp: Number(tabletForm.mrp),
      free: Number(tabletForm.free),
      strips: Number(tabletForm.strips),
      price: Number(tabletForm.price),
      gst: Number(tabletForm.gst),
      cgst: Number(tabletForm.gst) / 2,
      sgst: Number(tabletForm.gst) / 2,
      total: Number(tabletForm.strips) * Number(tabletForm.price),
      discount: Number(tabletForm.discount),
    };
  
    if (editTabletIndex !== null) {
      const updated = [...tablets];
      updated[editTabletIndex] = cleanedTablet;
      setTablets(updated);
      toast.success("Tablet updated!");
    } else {
      setTablets((prev) => [...prev, cleanedTablet]);
      toast.success("Tablet added!");
    }
  
    setTabletForm(initialTablet);
    setEditTabletIndex(null);
    setErrors({});
  };
  
  
  const removeTablet = (index) => {
    const updated = tablets.filter((_, i) => i !== index);
    setTablets(updated);
  };

  // const updateTabletField = (index, field, value) => {
  //   const updated = [...tablets];
  //   updated[index][field] = value;
  //   setTablets(updated);
  // };

  const updateTabletField = (index, field, value) => {
    setTablets((prev) => {
      const newTablets = [...prev];
      newTablets[index] = {
        ...newTablets[index],
        [field]: value,
      };
  
      const strips = parseInt(newTablets[index].strips || 0, 10);
      const free = parseInt(newTablets[index].free || 0, 10);
      const price = parseFloat(newTablets[index].price || 0);
  
      // ✅ Quantity calculation
      const packing = newTablets[index].packing || "0*1";
      const multiplier = parseInt(packing.split("*")[1] || 1, 10);
      newTablets[index].quantity = (strips + free) * multiplier;
  
      // ✅ Total calculation
      newTablets[index].total = strips * price;
  
      return newTablets;
    });
  };
  

  // const calculateGrandTotal = () => {
  //   return tablets.reduce((sum, tab) => sum + Number(tab.total || 0), 0);
  // };

  // const calculateGrandTotal = () => {
  //   // Step 1: Tablet-level calculations (each tablet’s total already includes its own gst/discount logic if set)
  //   let total = tablets.reduce((sum, tab) => sum + Number(tab.total || 0), 0);
  
  //   // Step 2: Apply form-level discount (if any)
  //   if (form.discount && !isNaN(form.discount) && Number(form.discount) > 0) {
  //     total -= (total * Number(form.discount)) / 100;
  //   }
  
  //   // Step 3: Apply form-level GST (if any)
  //   if (form.gst && !isNaN(form.gst) && Number(form.gst) > 0) {
  //     total += (total * Number(form.gst)) / 100;
  //   }
  
  //   return Number(Math.ceil(total));
  // };

  const calculateGrandTotal = () => {
    // ✅ Step 1: Tablet-level total (already calculated in updateTabletField)
    let total = tablets.reduce((sum, tab) => {
      return sum + (Number(tab.total) || 0);
    }, 0);
  
    // ✅ Step 2: Apply form-level discount
    const discount = Number(form.discount) || 0;
    if (discount > 0) {
      total -= (total * discount) / 100;
    }
  
    // ✅ Step 3: Apply form-level GST
    const gst = Number(form.gst) || 0;
    if (gst > 0) {
      total += (total * gst) / 100;
    }
  
    // ✅ Final rounded value
    return Math.ceil(total);
  };
  
  

  const submitPurchase = async () => {
    const requiredFields = [
      "oldbillNo",
      "salesperson",
      "clientName",
      "mobile",
      "paymenttype",
      "ordertype",
    ];
    for (let key of requiredFields) {
      if (!form[key] || form[key].toString().trim() === "") {
        toast.error(`Please enter ${key}`);
        return;
      }
    }
    if (!Array.isArray(tablets) || tablets.length === 0) {
      toast.error("At least one tablet must be added");
      return;
    }
    for (let i = 0; i < tablets.length; i++) {
      const tab = tablets[i];
      if (!tab.name || !tab.quantity) {
        toast.error(`Tablet ${i + 1} is missing name or quantity`);
        return;
      }
    }
    const payload = {
      ...form,
      tablets,
      dispatchDate: form.dispatchDate || null,
      grandtotal: calculateGrandTotal(),
      paymentDate:form.ordertype === "CASH"
      ? new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
      : "",
    };
    setIsLoading(true);
    try {
      if (isEditMode && editBillId) {
        const res = await axios.put(`/api/new-purchase/${editBillId}`, payload);
        if (res.data.success) {
          toast.success("Purchase updated!");
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post("/api/new-purchase", payload);
        if (res.data.success) {
          toast.success("Purchase saved!");
        } else {
          toast.error(res.data.message);
        }
      }
      setForm(initialForm);
      setTablets([]);
      setIsEditMode(false);
      setEditBillId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit purchase.");
    } finally {
      setIsLoading(false); // 🔴 Stop loading
    }
  };

  const handleEditBill = async (billId) => {
    try {
      const res = await axios.get(`/api/new-purchase/${billId}`);
      const { data } = res.data;

      setForm({
        ...initialForm,
        ...data,
        invoiceDate: data.invoiceDate?.slice(0, 10),
      });

      setTablets(data.tablets || []);
      setEditBillId(data._id);
      setIsEditMode(true);
    } catch (err) {
      toast.error("Failed to load bill for editing");
      console.error(err);
    }
  };

  const deletePurchase = async (id) => {
    setLoading(true)
    try {
      const res = await axios.delete(`/api/new-purchase?id=${billNoDelete}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setLoading(false) // "Purchase deleted successfully"
      } else {
        toast.error(res.data.message);
        setLoading(false)
      }
    } catch (err) {
      console.error(err);
      setLoading(false)
      toast.error("Error deleting purchase.");
    }
  };

  const labelMap = {
    oldbillNo: "Invoice No",
    clientName: "Stockiest Name",
    mobile: "Mobile Number",
    paymenttype: "Payment Type",
    ordertype: "Order Type",
    discount: "Discount (%)",
    gst: "GST (%)",
    cgst: "CGST (%)",
    sgst: "SGST (%)",
    grandtotal: "Grand Total",
    salesperson: "Purchase Person",
    branch: "Branch Code",
    branchName: "Branch Name",
    address1: "Address Line 1",
    address2: "Address Line 2",
    pinCode: "PIN Code",
    state: "State",
    invoiceDate: "Invoice Date",
    email:"Email",
    accountDetails:"Account Details",
    accountNumber:"Account Number",
    accountIfscCode:"Ifsc Code",
    gstIn:"GSTIN",
    amountPaid:"Paid Amount"
  };
  const handleEditTablet = (index) => {
    setTabletForm(tablets[index]);
    setEditTabletIndex(index);
    setErrors({});
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

  const handleSelectCompany = (name) => {
    setTabletForm((prev) => ({ ...prev, company: name }));
    setShowCompanyDropdown(false);
  };

  const handleCompanyInputChange = (e) => {
    const value = e.target.value;
    setTabletForm((prev) => ({ ...prev, company: value }));
  
    if (value.trim() === "") {
      setFilteredCompanies([]);
      setShowCompanyDropdown(false);
      return;
    }
  
    const filtered = companyList.filter((comp) =>
      comp.option.toLowerCase().includes(value.toLowerCase())
    );
  
    setFilteredCompanies(filtered);
    setShowCompanyDropdown(true);
  };

  const handleSelectSalt = (name) => {
    setTabletForm((prev) => ({ ...prev, salt: name }));
    setShowSaltDropdown(false);
  };

  const handleSaltInputChange = (e) => {
    const value = e.target.value;
    setTabletForm((prev) => ({ ...prev, salt: value }));
  
    if (value.trim() === "") {
      setFilteredSalts([]);
      setShowSaltDropdown(false);
      return;
    }
  
    const filtered = saltList.filter((comp) =>
      comp.option.toLowerCase().includes(value.toLowerCase())
    );
  
    setFilteredSalts(filtered);
    setShowSaltDropdown(true);
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

  return (
    <>
    <Header isLoggedStatus={isLoggedCheck}/>
    <div className="max-w-[1400px] mx-auto p-4">
        <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-4">Create New Purchase</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        View Ledger
      </button>
      </div>

      {/* General Info */}
      <div className="grid grid-cols-4 gap-3 mb-3">
      {Object.keys(initialForm)
  .filter((k) => k !== "grandtotal")
  .map((field) => (
    <div key={field} className="flex flex-col mb-2">
      <label className="mb-1 font-semibold">
        {labelMap[field] || field.replace(/([A-Z])/g, " $1").toUpperCase()}
      </label>

      {/* Searchable Client Name Input */}
      {field === "clientName" ? (
        <>
          <input
            list="client-options"
            name="clientName"
            value={form.clientName}
            onChange={(e) => {
              const val = e.target.value;
              setForm((prev) => ({ ...prev, clientName: val }));
              handleClientSelect(val);
            }}
            className="border p-2 rounded"
            placeholder="Search Client Name"
          />
          <datalist id="client-options">
            {clients.map((client, idx) => (
              <option key={idx} value={client.clientName} />
            ))}
          </datalist>
        </>

      // Dropdown: Payment Type
      ) : field === "paymenttype" ? (
        <select
          name="paymenttype"
          value={form.paymenttype}
          onChange={handleFormChange}
          className="border p-2 rounded"
        >
          <option value="">Select Payment Type</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
          <option value="Cash">Cash</option>
        </select>

      // Dropdown: Order Type
      ) 
      : field === "ordertype" ? (
        <select
          name="ordertype"
          value={form.ordertype}
          onChange={handleFormChange}
          className="border p-2 rounded"
        >
          <option value="">Select Order Type</option>
          <option value="pending">Pending</option>
          <option value="CASH">Cash</option>
        </select>

      // GST Dropdown
      ) : field === "gst" ? (
        <select
          name="gst"
          value={form.gst}
          onChange={(e) => {
            const gstValue = e.target.value;
            setForm((prev) => ({
              ...prev,
              gst: gstValue,
              cgst: gstValue / 2,
              sgst: gstValue / 2,
            }));
          }}
          className="border p-2 rounded"
        >
          <option value="">Select GST %</option>
          <option value="5">5%</option>
          <option value="12">12%</option>
          <option value="18">18%</option>
          <option value="28">28%</option>
        </select>

      // Disabled CGST/SGST inputs
      ) : field === "cgst" || field === "sgst" ? (
        <input
          name={field}
          value={form[field]}
          disabled
          className="border p-2 rounded bg-gray-100 text-gray-700"
          placeholder={field}
        />

      // Regular Input
      ) : (
        <input
          name={field}
          value={form[field]}
          onChange={handleFormChange}
          type={field.includes("Date") ? "date" : "text"}
          className="border p-2 rounded"
          placeholder={field}
        />
      )}
    </div>
))}

      </div>

      {/* Add Tablet */}
      <h2 className="text-lg font-semibold mb-2">Add Tablet</h2>
      <div className="grid grid-cols-4 gap-3 mb-4">
       
       {Object.keys(initialTablet).map((field) => {
          const isError = errors[field];

          if (field === "gst") {
            return (
              <div key={field} className="flex flex-col">
                <label className="text-sm mb-1">GST (%)</label>
                <select
                  name="gst"
                  value={tabletForm.gst}
                  onChange={handleTabletChange}
                  className={`border p-2 ${isError ? "border-red-500" : ""}`}
                >
                  <option value="">Select GST</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
            );
          }

          if (field === "cgst" || field === "sgst") {
            return (
              <div key={field} className="flex flex-col">
                <label className="text-sm mb-1">{field.toUpperCase()} (%)</label>
                <input
                  type="number"
                  name={field}
                  value={tabletForm[field]}
                  disabled
                  className="border p-2 bg-gray-100"
                />
              </div>
            );
          }

          if (field === "expiry") {
            return (
              <div key={field} className="flex flex-col">
                <label className="text-sm mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  name="expiry"
                  value={tabletForm.expiry}
                  onChange={handleTabletChange}
                  placeholder="MM/YY"
                  pattern="\d{2}/\d{2}"
                  className={`border p-2 ${isError ? "border-red-500" : ""}`}
                />
              </div>
            );
          }

          if (field === "company") {
            return (
              <div key={field} className="flex flex-col relative">
                <div className="flex justify-between">
                <label className="text-sm mb-1 capitalize">Company</label>
                <div
                className="text-red-400 text-sm cursor-pointer"
                onClick={() => setShowCompanyModal(true)}
              >
                +Add Company
              </div>
                </div>
                <input
                  type="text"
                  name="company"
                  value={tabletForm.company}
                  onChange={handleCompanyInputChange}
                  onFocus={() => {
                    setFilteredCompanies(companyList); // ✅ always show full list on focus
                    setShowCompanyDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowCompanyDropdown(false), 200);
                  }}
                  placeholder="Search Company"
                  className={`border p-2 ${errors[field] ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
                {showCompanyDropdown && filteredCompanies.length > 0 && (
                  <div className="absolute top-full left-0 right-0 max-h-40 overflow-y-auto bg-white border border-gray-300 z-10 rounded shadow">
                    {filteredCompanies.map((comp, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectCompany(comp.value)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {comp.option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (field === "salt") {
            return (
              <div key={field} className="flex flex-col relative">
                <div className="flex justify-between">
                <label className="text-sm mb-1 capitalize">Salt</label>
                <div
                className="text-red-400 text-sm cursor-pointer"
                onClick={() => setShowSaltModal(true)}
              >
                +Add Salt
              </div>
                </div>
                <input
                  type="text"
                  name="salt"
                  value={tabletForm.salt}
                  onChange={handleSaltInputChange}
                  onFocus={() => {
                    setFilteredSalts(saltList); // ✅ always show full list on focus
                    setShowSaltDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSaltDropdown(false), 200);
                  }}
                  placeholder="Search Salt"
                  className={`border p-2 ${errors[field] ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
                {showSaltDropdown && filteredSalts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 max-h-40 overflow-y-auto bg-white border border-gray-300 z-10 rounded shadow">
                    {filteredSalts.map((comp, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSalt(comp.value)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {comp.option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          

          if (field === "category") {
            return (
              <div key={field} className="flex flex-col">
                <label className="text-sm mb-1 capitalize">{field}</label>
                <select
                  name="category"
                  value={tabletForm.category}
                  onChange={handleTabletChange}
                  className={`border p-2 ${isError ? "border-red-500" : ""}`}
                >
                  <option value="">Select Category</option>
                  {CategoryList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.option}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          

          return (
            <div key={field} className="flex flex-col">
              <label className="text-sm capitalize mb-1">{field}</label>
              <input
                name={field}
                type={typeof initialTablet[field] === "number" ? "number" : "text"}
                value={tabletForm[field]}
                onChange={handleTabletChange}
                placeholder={field}
                className={`border p-2 ${isError ? "border-red-500" : ""}`}
              />
            </div>
          );
        })}
    
    <button
  onClick={handleAddTablet}
  className="bg-blue-600 text-white py-2 px-4 rounded col-span-4"
>
  {editTabletIndex !== null ? "Update Tablet" : "Add Tablet"}
</button>
      </div>

      {/* Tablet Table */}
      {/* <div className="overflow-x-auto mb-6">
        <table className="min-w-[1200px] border text-sm">
          <thead>
            <tr className="bg-gray-200">
              {Object.keys(initialTablet).map((field) => (
                <th key={field} className="border p-2">
                  {field}
                </th>
              ))}
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tablets.map((tab, index) => (
              <tr key={index}>
                {Object.keys(initialTablet).map((field) => (
                  <td key={field} className="border p-1">
                    <input
                      className="w-full border p-1"
                      type={
                        typeof initialTablet[field] === "number"
                          ? "number"
                          : "text"
                      }
                      value={tab[field]}
                      onChange={(e) =>
                        updateTabletField(index, field, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td className="border text-center space-x-2">
  <button
    onClick={() => handleEditTablet(index)}
    className="text-blue-600"
    title="Edit"
  >
    ✏️
  </button>
  <button
    onClick={() => removeTablet(index)}
    className="text-red-600"
    title="Delete"
  >
    🗑
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <div className="overflow-x-auto mb-6">
  <table className="table-auto border text-sm min-w-max">
    <thead>
      <tr className="bg-gray-200">
        {Object.keys(initialTablet).map((field) => (
          <th key={field} className="border p-2 whitespace-nowrap">
            {field}
          </th>
        ))}
        <th className="border p-2">Action</th>
      </tr>
    </thead>
    <tbody>
      {tablets.map((tab, index) => (
        <tr key={index}>
          {Object.keys(initialTablet).map((field) => (
            <td key={field} className="border p-1 whitespace-nowrap">
              <input
                className="border p-1 min-w-[120px] max-w-xs w-full overflow-x-auto"
                type={
                  typeof initialTablet[field] === "number"
                    ? "number"
                    : "text"
                }
                value={tab[field]}
                onChange={(e) =>
                  updateTabletField(index, field, e.target.value)
                }
              />
            </td>
          ))}
          <td className="border text-center space-x-2">
            <button
              onClick={() => handleEditTablet(index)}
              className="text-blue-600"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => removeTablet(index)}
              className="text-red-600"
              title="Delete"
            >
              🗑
            </button>
          </td>
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
  onClick={submitPurchase}
  className="bg-green-600 text-white px-6 py-2 rounded flex items-center justify-center"
  disabled={isLoading}
>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
      Submitting...
    </span>
  ) : (
    "Submit Purchase"
  )}
</button>
      </div>
     

      <PaymentsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        handleEdit={handleEditBill}
        handleDelete={()=>setConfirmDeleteId(true)}
        billNoDelete={billNoDelete}
        setBillNoDelete={setBillNoDelete}
      />

<div>
        <ConfirmationModal loading={loading} title={"Are you sure want to delete this Invoice?"}
        confirmDeleteId={confirmDeleteId} setConfirmDeleteId={setConfirmDeleteId} confirmDelete={deletePurchase}/>
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
    if (loggedIn && loginType !== "admin" && loginType !== "stockiest") {
      return {
        props: {},
        redirect: { destination: "/admin" },
      };
    }
    const isLoggedStatus= loggedIn
    const checkLoginType=loginType
  
    return {
      props: {isLoggedStatus,checkLoginType},
    };
  }
export default NewPurchasePage