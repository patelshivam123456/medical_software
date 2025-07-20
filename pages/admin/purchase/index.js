import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PaymentsModal from "@/components/Modal/PaymentModal";
import Header from "@/components/Header";

const initialTablet = {
  name: "",
  company: "",
  salt: "",
  category: "",
  mg:"",
  batch: "",
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
  
  gst: 0,
  cgst: 0,
  sgst: 0,
  discount: 0,
  
  grandtotal: 0,
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
      }));
    }
  };

  const handleTabletChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "strips" || name === "price") {
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

  const updateTabletField = (index, field, value) => {
    const updated = [...tablets];
    updated[index][field] = value;
    setTablets(updated);
  };

  const calculateGrandTotal = () => {
    return tablets.reduce((sum, tab) => sum + Number(tab.total || 0), 0);
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
    try {
      const res = await axios.delete(`/api/new-purchase?id=${id}`);
      if (res.data.success) {
        toast.success(res.data.message); // "Purchase deleted successfully"
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
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
    salesperson: "Sales Person",
    branch: "Branch Code",
    branchName: "Branch Name",
    address1: "Address Line 1",
    address2: "Address Line 2",
    pinCode: "PIN Code",
    state: "State",
    invoiceDate: "Invoice Date",
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
        {/* {Object.keys(initialTablet).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm capitalize mb-1">{field}</label>
            <input
              key={field}
              name={field}
              type={
                typeof initialTablet[field] === "number" ? "number" : "text"
              }
              value={tabletForm[field]}
              onChange={handleTabletChange}
              placeholder={field}
              className="border p-2"
            />
          </div>
        ))} */}
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
      <div className="overflow-x-auto mb-6">
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
      </div>

      {/* Submit */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Grand Total: ₹{calculateGrandTotal()}
        </div>
        <button
          onClick={submitPurchase}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit Purchase
        </button>
      </div>
     

      <PaymentsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        handleEdit={handleEditBill}
        handleDelete={deletePurchase}
      />
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