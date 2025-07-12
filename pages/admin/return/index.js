import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import AddPrductDetail from "@/components/Tables/AddPrductDetail";
import {
  DocumentDuplicateIcon,
  PaperClipIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import LoadingBtn from "@/components/Buttons/LoadingBtn";
import Searchable from "@/components/Input/Searchable";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import Header from "@/components/Header";

const Index = (props) => {
  const router = useRouter();
  const [billNo, setBillNo] = useState("");
  const [newbillNo, setnewBillNo] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [returnPerson, setReturnPerson] = useState("");
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
  const [loading, setLoading] = useState(false);
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
    discount: 10,
    sgst: 0,
    cgst: 0,
    total: 0,
    gst: 12,
    lessquantity: 0,
    returnquantity:0,
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

  const [groupedClients, setGroupedClients] = useState({});
  const [mobileOptions, setMobileOptions] = useState([]);
  const [clientMobileGroup, setClientMobileGroup] = useState([]);
  const [invoiceId,setInvoiceId] = useState('')
  const [confirmDeleteId,setConfirmDeleteId] = useState(false)
  const [isLoggedCheck,setIsLoggedCheck] = useState('')
  const [batchSuggestions, setBatchSuggestions] = useState([]);
const [showBatchSuggestions, setShowBatchSuggestions] = useState(false);

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
      `SG000${b.newbillNo}`.toLowerCase().includes(searchTerm.toLowerCase())||
      `SG000${b.billNo}`.toLowerCase().includes(searchTerm.toLowerCase())||
      b.mobile.toLowerCase().includes(searchTerm.toLowerCase())||
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, oldBills]);

  const filteredNewBills = useMemo(() => {
    return newBills.filter((b) =>
      `SG000${b.newbillNo}`.toLowerCase().includes(searchTerm.toLowerCase())||
      `SG000${b.billNo}`.toLowerCase().includes(searchTerm.toLowerCase())||
      b.mobile.toLowerCase().includes(searchTerm.toLowerCase())||
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, newBills]);

  const activeBills = activeTab === "old" ? filteredOldBills : filteredNewBills;

  useEffect(() => {
    // axios.get("/api/tablets/get").then((res) => {
    //   setAvailableTablets(res.data.tablets);
    // });
    if(props.isLoggedStatus){
      setIsLoggedCheck(props.isLoggedStatus)
    }
    fetchTabDetails()
    fetchClients();
  }, []);

  const fetchTabDetails = async () => {
    try {
      const res = await axios.get("/api/tablets/get");
      setAvailableTablets(res.data.tablets);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  useEffect(() => {
    if (gst) {
      setCgst(Number(gst) / 2);
      setSgst(Number(gst) / 2);
    }
  }, [gst]);
  // useEffect(() => {
  //   const updatedFields = { ...formFields };
  //   if (discount > 0) {
  //     updatedFields.discount = discount;
  //   } else if (discount === "") {
  //     updatedFields.discount = 10;
  //   }
  //   if (gst === "" || gst === "0" || Number(gst) === 0) {
  //     updatedFields.gst = 12;
  //   } else {
  //     updatedFields.gst = gst;
  //   }
  //   setFormFields(updatedFields);
  // }, [discount, gst]);

  const filteredBillNumbers = useMemo(() => {
    return billNumbers.filter((num) =>
      `SG000${num}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, billNumbers]);

  useEffect(() => {
    const quantity = parseFloat(formFields.returnquantity) || 0;
    const rate = parseFloat(formFields.rate) || 0;
    const total = quantity * rate;
    setFormFields((prev) => ({ ...prev, total: total.toFixed(2) }));
  }, [formFields.returnquantity, formFields.rate]);

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setFormFields({ ...formFields, expiry: value });
  };

  useEffect(() => {
    const quantity = Number(formFields.returnquantity);

    if (quantity > 0 && editingIndex === null) {
      const timer = setTimeout(() => {
        addMoreTablet();
      }, 1200);
      return () => clearTimeout(timer); 
    }
  }, [formFields.returnquantity]);

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
      returnquantity,
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
      !returnquantity||
      !category
    ) {
      toast.error("Please fill all fields before adding.");
      return;
    }

    if (Number(returnquantity) > Number(lessquantity)) {
      toast.error("Return quantity cannot be greater than sold quantity (lessquantity).");
      return;
    }

    const newTablet = {
      name: name.trim(),
      company: company.trim(),
      salt: salt.trim(),
      quantity: Number(quantity),
      packing: packing.trim(),
      batch: batch.trim(),
      expiry: expiry.trim(),
      price: Number(price),
      discount: Number(discount),
      rate: Number(rate),
      sgst: Number(gst) / 2,
      cgst: Number(gst) / 2,
      total: Number(total),
      gst: Number(gst),
      lessquantity: Number(lessquantity),
      returnquantity:Number(returnquantity),
      category: category.trim(),
      free: Number(free),
      hsm: hsm.trim(),
    };
    const isDuplicate = tablets.some((tablet, index) => {
      if (editingIndex !== null && editingIndex === index) return false;
      return (
        tablet.name === newTablet.name &&
        tablet.company === newTablet.company &&
        tablet.salt === newTablet.salt &&
        tablet.batch === newTablet.batch &&
        tablet.category === newTablet.category &&
        tablet.expiry === newTablet.expiry &&
        tablet.packing === newTablet.packing &&
        tablet.quantity === newTablet.quantity &&
        tablet.price === newTablet.price
      );
    });

    if (isDuplicate) {
      toast.error("Duplicate tablet details found. Please modify the entry.");
      return;
    }

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
      returnquantity: 0,
      category: "",
      free: 0,
      hsm: "",
    });

    setShowSuggestions(false);
  };

  const handleEdit = (tablet, index) => {
    setFormFields({
      name: tablet.name || "",
      company: tablet.company || "",
      salt: tablet.salt || "",
      quantity: tablet.quantity || 0,
      packing: tablet.packing || "",
      batch: tablet.batch || "",
      expiry: tablet.expiry || "",
      price: tablet.price || "",
      discount: tablet.discount || 0,
      rate: tablet.rate || "",
      total: tablet.total || "",
      gst: tablet.gst || 0,
      lessquantity: tablet.lessquantity || 0,
      returnquantity: tablet.returnquantity || 0,
      category: tablet.category || "",
      free: tablet.free || 0,
      hsm: tablet.hsm || "",
    });
  
    setEditingIndex(index); // 🔁 Remember which row is being edited
  };
  

  const handleDelete = (index) => {
    const updated = [...tablets];
    updated.splice(index, 1); // ✅ now correctly deletes the right item
    setTablets(updated);
  
    // Reset form
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
      returnquantity: 0,
      category: "",
      free: 0,
      hsm: "",
    });
  };
  

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!title || !clientName || !mobile || !branch || !branchName || !address1 || !pinCode || !state) {
      toast.error("Please fill all Client fields.");
      setIsLoading(false);
      return;
    }
    if (tablets.length === 0) {
      toast.error("Add at least one tablet before submitting.");
      setIsLoading(false);
      return;
    }
    const sanitizedTablets = tablets.map((tab) => {
      const returnQty = Number(tab.returnquantity) || 0;
      const rate = Number(tab.rate) || 0;
      return {
        ...tab,
        returnquantity: returnQty,
        total: returnQty > 0 ? +(rate * returnQty).toFixed(2) : 0,
      };
    });

    try {
      const response = await axios.post("/api/return", {
        billNo,
        salesperson:salesPerson,
        returnperson:returnPerson,
        tablets:sanitizedTablets,
        discount:Number(discount),
        sgst:Number(sgst),
        cgst:Number(cgst),
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
        setSalesPerson("")
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
        fetchTabDetails()
        fetchreturnData()
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        const { status, data } = error.response;
        setIsLoading(false);
        if (status === 400) {
          toast.error(`Validation Error: ${data.message}`);
          setIsLoading(false);
        } else if (status === 404) {
          toast.error(`Not Found: ${data.message}`);
          setIsLoading(false);
        } else if (status === 409) {
          toast.error(`Duplicate Bill: ${data.message}`);
          setIsLoading(false);
        } else if (status === 500) {
          toast.error(`Server Error: ${data.message}`);
          setIsLoading(false);
        } else {
          toast.error(`Error: ${data.message || "Something went wrong"}`);
          setIsLoading(false);
        }
      } else {
        toast.error("Network error or server not responding");
        setIsLoading(false);
      }
    }
  };

  const fetchreturnData = async () => {
    const res = await axios.get("/api/return");
    const newBillNo=res.data.bills[0].newbillNo
    router.push("/admin/return/"+newBillNo)
  };

  const openModal = async () => {
    const res = await axios.get("/api/return");
    setBillNumbers(res.data.bills);
    setModalOpen(true);
  };


  const handleEditOldBill = async (billNo) => {
    try {
      const res = await axios.get(`/api/bills/${billNo}`);
      const bill = res.data.bill;
      setBillNo(bill.billNo);
      setnewBillNo(bill.newbillNo)
      setSalesPerson(bill.salesperson)
      setReturnPerson(bill.returnperson)
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
      setIsEditingBill("new");
      fetchTabDetails()
      toast.success("Bill loaded for editing");
    } catch (error) {
      toast.error("Failed to load bill details");
    }
  };
  const handleEditBill = async (billNo) => {
    try {
      const res = await axios.get(`/api/return/${billNo}`);
      const bill = res.data.bill;
      setBillNo(bill.billNo);
      setnewBillNo(bill.newbillNo)
      setSalesPerson(bill.salesperson)
      setReturnPerson(bill.returnperson)
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
      fetchTabDetails()
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
      const res = await axios.put(`/api/return/${newbillNo}`, {
        billNo,
        salesperson:salesPerson,
        returnperson:returnPerson,
        tablets,
        discount:Number(discount),
        sgst:Number(sgst),
        cgst:Number(cgst),
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
        setSalesPerson("")
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
        router.push("/admin/return/"+newbillNo)
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error("Failed to update bill.");
    }
  };

  const handleDeleteBill = async () => {
    setLoading(true)
    try {
      const res = await axios.delete(`/api/return/${invoiceId}`);
      if (res.status === 200) {
        toast.success("Bill deleted successfully");
        setBillNumbers((prev) => prev.filter((b) => b !== invoiceId));
        setLoading(false)
      }
    } catch (err) {
      toast.error("Error deleting bill");
      setLoading(false)
    }
  };

  const handleResetForm = () => {
    setBillNo("");
    setSalesPerson("")
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
      returnquantity:0,
      category: "",
      free: 0,
      hsm: "",
    });
    toast.success("Reset successfully");
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get("/api/client");
      const clients = res.data || [];
  
      // Group clients by clientName
      const grouped = clients.reduce((acc, client) => {
        const nameKey = client.clientName.toLowerCase();
        if (!acc[nameKey]) acc[nameKey] = [];
        acc[nameKey].push(client);
        return acc;
      }, {});
  
      setGroupedClients(grouped); // You need to define this state
      setAllClients(clients);
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
    setMobileOptions([]);
  
    const filtered = Object.values(groupedClients).map((clients) => {
      // Pick first client of each group that matches the title
      const match = clients.find((c) => c.title === value);
      return match;
    }).filter(Boolean);
  
    setFilteredClientNames(filtered);
  };
  
  
  const handleClientNameChange = (value) => {
    setClientName(value);
    setSelectedClient(null);
    setMobile("");
    setBranch("");
    setBranchName("");
    setAddress1("");
    setAddress2("");
    setPinCode("");
    setState("");
    setMobileOptions([]);
  
    const nameKey = value.toLowerCase();
    const matchingClients = groupedClients[nameKey] || [];
  
    if (matchingClients.length === 1) {
      // Only one client → auto-fill everything
      const client = matchingClients[0];
      setMobile(client.mobile || "");
      setBranch(client.branch || "");
      setBranchName(client.branchName || "");
      setAddress1(client.address1 || "");
      setAddress2(client.address2 || "");
      setPinCode(client.pinCode || "");
      setState(client.state || "");
      setMobileOptions([]);
      setClientMobileGroup([]);
    } else if (matchingClients.length > 1) {
      // Multiple clients → show mobile dropdown
      setMobileOptions(matchingClients.map((c) => c.mobile));
      setClientMobileGroup(matchingClients);
    }
  };
  

  const resetForm = () => {
    setEditingIndex(null)
    setFormFields({
      name: "",
      company: "",
      salt: "",
      quantity: 0,
      packing: "",
      batch: "",
      expiry: "",
      price: 0,
      discount: 10,
      rate: 0,
      total: 0.0,
      gst: 12,
      lessquantity: 0,
      returnquantity:0,
      category: "",
      free: 0,
      hsm: "",
    });
  };

  const [allBillNos, setAllBillNos] = useState([]);
  const [filteredBillNos, setFilteredBillNos] = useState([]);
  const [showBillDropdown, setShowBillDropdown] = useState(false);

  const handleInvoiceSearchChange = (e) => {
    const value = e.target.value;
    setBillNo(value);
    const filtered = allBillNos.filter((no) =>
        `SG000${no}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBillNos(filtered);
  };



  const fetchAllBillNumbers = async () => {
    try {
      const { data } = await axios.get("/api/bills"); // Make sure this returns array of billNos
      const billNos = data?.bills?.map((item) => item.billNo.toString());
      setAllBillNos(billNos);
      setFilteredBillNos(billNos);
    } catch (err) {
      console.error("Error fetching invoice numbers", err);
    }
  };
  const handleInvoiceSelect = (selectedNo) => {
    setBillNo(selectedNo);
    setShowBillDropdown(false);
    handleEditOldBill(selectedNo);
  };
  
  return (
    <>
    <Header isLoggedStatus={isLoggedCheck}/>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Return Product</h2>
          <button
            onClick={openModal}
            className=" bg-gray-700 text-white px-4 py-2 rounded cursor-pointer hidden lg:block"
          >
            Show All Invoice
          </button>
          <div onClick={openModal} className="block lg:hidden"><PaperClipIcon className="w-6 h-6"/></div>
        </div>
        <form onSubmit={handleSubmit} className="mb-6 w-full max-w-7xl gap-5">
          <div className="lg:flex justify-between lg:items-center">
            <div className="w-full lg:w-1/2 flex flex-wrap lg:flex-nowrap items-center lg:gap-3">
            
     <div className="w-[60%] md:w-[20%] lg:mb-6 relative invoice-search">
  <label>Invoice No:</label>
  <input
    type="text"
    value={billNo}
    onFocus={() => {
      setShowBillDropdown(true);
      fetchAllBillNumbers();
    }}
    onChange={handleInvoiceSearchChange}
    className="block w-full text-black bg-gray-200 border border-red-500 rounded py-2 px-4 mb-3 focus:outline-none focus:bg-white"
  />
  {showBillDropdown && filteredBillNos.length > 0 && (
    <ul className="absolute z-20 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto shadow-lg rounded">
      {filteredBillNos.map((no, index) => (
        <li
          key={index}
          onClick={() => handleInvoiceSelect(no)}
          className="p-2 hover:bg-blue-100 cursor-pointer"
        >
          {"SG000"+no}
        </li>
      ))}
    </ul>
  )}
</div>
<div className="w-full md:w-[50%] lg:mb-6">
              <label>Sales Person:</label>
              <input
                type="text"
                disabled
                value={salesPerson}
                onChange={(e) => setSalesPerson(e.target.value)}
                className="block w-full text-black bg-gray-200 cursor-not-allowed border border-red-500 rounded py-2 px-4 mb-3 focus:outline-none focus:bg-white"
              />
            </div>
            <div className="w-full md:w-[50%] lg:mb-6">
              <label>Return Person:</label>
              <input
                type="text"
                
                value={returnPerson}
                onChange={(e) => setReturnPerson(e.target.value)}
                className="block w-full text-black bg-white border border-red-500 rounded py-2 px-4 mb-3 focus:outline-none focus:bg-white"
              />
            </div>
            </div>
            {!billNo && isEditingBill === "copy" ? (
              <div
                onClick={handleResetForm}
                className={`text-green-700 pb-5 text-right  lg:pb:0 font-medium pr-3 cursor-pointer`}
              >
                Reset Form
              </div>
            ) : !billNo ? (
              <div
                className={`text-green-700 pb-5 text-right  lg:pb:0 font-medium pr-3 cursor-not-allowed`}
              >
                Reset Form
              </div>
            ) : (
              <div
                onClick={handleResetForm}
                className={`text-green-700 pb-5 text-right  lg:pb:0 font-medium pr-3 cursor-pointer`}
              >
                Reset Form
              </div>
            )}
          </div>
          <div className="border px-4 py-3 -mt-4">
            
            <div className="flex flex-wrap gap-4 items-end ">
   

             <div className="w-full md:w-[30%] ">
                <label>product Name</label>
                <input
                  type="text"
                  value={formFields.name}
                  onChange={(e) =>
                    setFormFields({ ...formFields, name: e.target.value })
                  }
                  disabled
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
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
              <div className="w-full md:w-[14%] ">
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
                  disabled
                  className="border px-2 py-2.5 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
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

              <div className="w-full md:w-[12%] ">
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
                  disabled
                  onChange={(e) =>
                    setFormFields({ ...formFields, rate: e.target.value })
                  }
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>

              <div className="w-full md:w-[8%] ">
                <label>Discount %</label>
                <input
                  value={formFields.discount}
                  onChange={(e) =>
                    setFormFields({ ...formFields, discount: e.target.value })
                  }
                  discount
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                />
              </div>
              <div className="w-full md:w-[5%] ">
                <label>GST</label>
                <select
                  type="text"
                  value={formFields.gst}
                  disabled
                  onChange={(e) =>
                    setFormFields({ ...formFields, gst: e.target.value })
                  }
                  className="border py-2.5 px-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                >
                  <option value="0">0</option>
                  <option value="5">5</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                  <option value="28">28</option>
                </select>
              </div>
              <div className="w-full md:w-[5%] ">
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

              <div className="w-full md:w-[5%] ">
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
              {/* <div className="w-full md:w-[10%] ">
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
              </div> */}

              {/* <div className="w-full md:w-[10%] ">
                <label>Free</label>
                <input
                  type="number"
                  value={formFields.free}
                  disabled
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      free: e.target.value,
                    })
                  }
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div> */}

              <div className="w-full md:w-[10%] ">
                <label>Quantity</label>
                <input
                  type="number"
                  value={formFields.lessquantity}
                  disabled
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      lessquantity: e.target.value,
                    })
                  }
                  className="border p-2 w-full bg-gray-200 cursor-not-allowed text-black outline-none rounded-sm"
                  required
                />
              </div>
              <div className="w-full md:w-[10%] ">
                <label>Return Quantity</label>
                <input
                  type="number"
                  value={formFields.returnquantity}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      returnquantity: e.target.value,
                    })
                  }
                  className="border p-2 w-full bg-white text-black outline-none rounded-sm"
                  required
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
            {editingIndex !== null&&<div className="flex items-center gap-2 justify-end pt-2 lg:pt-0 lg:mr-4">
              <button
                type="button"
                onClick={addMoreTablet}
                className="bg-green-600 text-xs text-white p-2 rounded  cursor-pointer"
              >
                Update
              </button>
              <div className="text-sm text-red-600 cursor-pointer" onClick={resetForm}>Reset</div>
            </div>}
            <div className="border-[1px] mt-5 mb-2"></div>
            {tablets.length > 0 && (
              <div className="">
                <h3 className="text-base font-semibold mb-2">Product Detail</h3>
                <div className="flex items-center flex-wrap gap-4">
                  {/* {tablets.map((t, index) => {
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
                  })} */}

{tablets.length > 0 && (
  <div className=" overflow-x-auto">
    <table className="min-w-full border border-gray-300 rounded-md bg-white shadow-md">
      <thead className="bg-green-700 text-white text-sm">
        <tr>
          <th className="p-2">#</th>
          <th className="p-2 min-w-[200px]">Name</th>
          <th className="p-2">Batch</th>
          <th className="p-2">Packing</th>
          <th className="p-2">Qty</th>
          <th className="p-2">LessQty</th>
          <th className="p-2">ReturnQty</th>
          <th className="p-2">Rate</th>
          <th className="p-2">Total</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-800">
      {tablets.map((t, index) => {
  const returnQty = Number(t.returnquantity) || 0;
  const calculatedTotal = Number(t.rate) * returnQty;

  return (
    <tr key={index} className="border-t border-gray-200 hover:bg-gray-100">
      <td className="p-2 text-center">{index + 1}</td>
      <td className="p-2 min-w-[200px]">{t.name}</td>
      <td className="p-2">{t.batch}</td>
      <td className="p-2">{t.packing}</td>
      <td className="p-2 text-center">{t.quantity}</td>
      <td className="p-2 text-center">{t.lessquantity}</td>

      {/* ✅ show 0 if not present */}
      <td className="p-2 text-center">{returnQty}</td>

      <td className="p-2 text-center">{t.rate}</td>

      {/* ✅ show total based on returnquantity */}
      <td className="p-2 text-center">{calculatedTotal.toFixed(2)}</td>

      <td className="p-2 flex items-center justify-center gap-2">
        <div onClick={() => handleEdit(t, index)} title="Edit">
          <PencilSquareIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
        </div>
        <div onClick={() => handleDelete(index)} title="Delete">
          <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-800" />
        </div>
      </td>
    </tr>
  );
})}

      </tbody>
    </table>
  </div>
)}

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
                  disabled
                  onChange={(e) => setDiscount(e.target.value)}
                  className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                  onClick={()=>setDiscount(0)}
                />
              </div>
              <div className="w-full md:w-[10%] ">
                <label>GST</label>
                <select
                  type="text"
                  value={gst}
                  disabled
                  onChange={(e) => setGst(e.target.value)}
                  className="border py-2.5 px-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
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
                {/* <a
                  href="/admin/client"
                  className="bg-orange-600 text-white px-2 py-1 text-xs font-semibold rounded-sm cursor-pointer"
                >
                  + Client
                </a> */}
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="w-full md:w-[10%]">
                  <label>Title</label>
                  <select
                    required
                    value={title}
                    disabled
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="border py-2.5 px-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
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
                    required={true}
                    disabled={true}
                  />
                </div>
                {/* <div className="w-full md:w-[15%]">
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
                </div> */}

<div className="w-full md:w-[15%]">
  <label>Mobile</label>
  {mobileOptions.length > 1 ? (
  <select
    value={mobile}
    onChange={(e) => {
      const selectedMobile = e.target.value;
      setMobile(selectedMobile);

      const matchedClient = clientMobileGroup.find(c => c.mobile === selectedMobile);
      if (matchedClient) {
        setBranch(matchedClient.branch || "");
        setBranchName(matchedClient.branchName || "");
        setAddress1(matchedClient.address1 || "");
        setAddress2(matchedClient.address2 || "");
        setPinCode(matchedClient.pinCode || "");
        setState(matchedClient.state || "");
      }
    }}
    required
    disabled
    className="border py-2.5 px-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
  >
    <option value="" disabled>--Select Mobile--</option>
    {mobileOptions.map((mob, i) => (
      <option key={i} value={mob}>{mob}</option>
    ))}
  </select>
) : (
  <input
    type="text"
    value={mobile}
    maxLength={10}
    minLength={10}
    onChange={(e) => {
      const val = e.target.value;
      if (/^\d*$/.test(val)) setMobile(val);
    }}
    className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
    required
    disabled
  />
)}

</div>

                <div className="w-full md:w-[20%]">
                  <label>Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="border py-2.5 px-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                    required
                    disabled
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
                    className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                    required
                    disabled
                  />
                </div>

                <div className="w-full md:w-[25%]">
                  <label>Address 1</label>
                  <input
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                    required
                    disabled
                  />
                </div>

                <div className="w-full md:w-[25%]">
                  <label>Address 2 (Optional)</label>
                  <input
                    value={address2}
                    disabled
                    onChange={(e) => setAddress2(e.target.value)}
                    className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
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
                    disabled
                    className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                    required
                  />
                </div>

                <div className="w-full md:w-[20%]">
                  <label>State</label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border p-2 w-full bg-gray-300 cursor-not-allowed text-black outline-none rounded-sm"
                    required
                    disabled
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
                {isEditingBill === "edit" ? "Update Bill" : "Return Bill"}
              </button>
            ) : (
              <button
                type="submit"
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Return Bill
              </button>
            )}
          </div>
        </form>
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          className="bg-white  p-6 border max-w-4xl mx-auto mt-2 lg:mt-20 shadow-2xl z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40  overflow-y-auto"
        >
          <div
            onClick={() => setModalOpen(false)}
            className="text-end font-semibold text-sm text-blue-600 cursor-pointer"
          >
            Close
          </div>

          <h2 className="text-xl font-bold mb-2 lg:mb-4 text-black">Invoice Numbers</h2>
          <div className="lg:flex justify-between items-center">
          <div className="flex gap-4 mb-4">
            <button
              className={`px-2 py-0 border rounded text-sm ${
                activeTab === "new"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200  text-green-600"
              }`}
              onClick={() => {
                setActiveTab("new");
                setSearchTerm("");
              }}
            >
              Newest
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
              Draft
            </button>
          </div>

          <input
            type="text"
            placeholder="Search Invoice Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-sm w-full lg:w-[25%] mb-4 text-black"
          />
</div>
<div className="overflow-auto max-h-[300px]">
<div className="mt-4 overflow-x-auto">
  <table className="min-w-full border border-gray-300 rounded bg-white shadow-md">
    <thead className="bg-orange-500 text-white text-sm">
      <tr>
        <th className="p-2 text-left">Bill No</th>
        <th className="p-2 text-left">Client</th>
        <th className="p-2 text-left">Mobile</th>
        <th className="p-2 text-left">Created At</th>
        <th className="p-2 text-left">Updated At</th>
        <th className="p-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody className="text-sm text-gray-800">
      {activeBills.length > 0 ? (
        activeBills.map((bill, idx) => (
          <tr key={idx} className="border-t border-gray-200 hover:bg-gray-100">
            <td className="p-2 font-semibold text-[#f3ab37]">SG000{bill.newbillNo}</td>
            <td className="p-2">{bill.clientName || "-"}</td>
            <td className="p-2">{bill.mobile || "-"}</td>
            <td className="p-2">{new Date(bill.createdAt).toLocaleDateString()}</td>
            <td className="p-2">{new Date(bill.updatedAt).toLocaleDateString()}</td>
            <td className="p-2 flex gap-3">
              <div
                title="View"
                className="cursor-pointer"
                onClick={() => {
                  setModalOpen(false);
                  window.location.href = `/admin/return/${bill.newbillNo}`;
                }}
              >
                <span className="text-xs text-white bg-green-600 px-2 py-1 rounded">View</span>
              </div>

              <div title="Edit" className="cursor-pointer" onClick={() => handleEditBill(bill.newbillNo)}>
                <PencilSquareIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
              </div>

              <div
              className="cursor-pointer"
                title="Delete"
                onClick={() => {
                  setConfirmDeleteId(true);
                  setInvoiceId(bill.newbillNo);
                }}
              >
                <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-800" />
              </div>

              {/* <div title="Copy" onClick={() => handleCopyBill(bill.newbillNo)}>
                <DocumentDuplicateIcon className="h-5 w-5 text-gray-500 hover:text-black" />
              </div> */}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="p-3 text-center text-gray-500">
            No matching invoice numbers found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

          </div>
        </Modal>
      </div>
      <div>
        <ConfirmationModal loading={loading} title={"Are you sure want to delete this Invoice?"}
        confirmDeleteId={confirmDeleteId} setConfirmDeleteId={setConfirmDeleteId} confirmDelete={handleDeleteBill}/>
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
  const isLoggedStatus= loggedIn

  return {
    props: {isLoggedStatus},
  };
}

export default Index;
