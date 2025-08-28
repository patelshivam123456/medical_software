import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { FaceSmileIcon } from "@heroicons/react/20/solid";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import Header from "@/components/Header";

const ItemListWithImages = (props) => {
  const [form, setForm] = useState({
    productName: "",
    company: "",
    mrp: "",
    rate: "",
    salt: "",
  });
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [show,setShow]= useState(false)
  const [id,setId]= useState("")
  const [isLoggedCheck, setIsLoggedCheck] = useState("");
  const [loadingPDF, setLoadingPDF] = useState(false);

  useEffect(() => {
    if (props.isLoggedStatus) {
      setIsLoggedCheck(props.isLoggedStatus);
    }
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("/api/item-list");
    setProducts(res.data);
  };

  // Create product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (image) fd.append("image", image);

    await axios.post("/api/item-list", fd);
    setForm({ productName: "", company: "", mrp: "", rate: "", salt: "" });
    setImage(null);
    setShowAddModal(false);
    fetchProducts();
  };

  // Delete product
  const handleDelete = async () => {
    await axios.delete(`/api/item-list?id=${id}`);
    setShow(false)
    fetchProducts();
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (editProduct.newImage) {
      const fd = new FormData();
      Object.keys(editProduct).forEach((k) => {
        if (k !== "newImage" && k !== "image" && k !== "_id") {
          fd.append(k, editProduct[k]);
        }
      });
      fd.append("id", editProduct._id);
      fd.append("image", editProduct.newImage);

      await axios.put("/api/item-list", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await axios.put("/api/item-list", {
        ...editProduct,
        id: editProduct._id,
        image: editProduct.image,
      });
    }

    setEditProduct(null);
    fetchProducts();
  };

  // Convert image URL to base64 for PDF
  const getBase64Image = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (err) => reject(err);
    });
  };

  // Download PDF with same product card design
 // Download PDF with same product card design
 const downloadPDF = async () => {
    try {
        setLoadingPDF(true); // ✅ start loading
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // === First Page Layout ===
    const logo = await getBase64Image("/sriji.png");
    const logoWidth = 100;
    const logoHeight = 100;
  
    // define content block height (everything on first page)
    const blockHeight = 360; // approx total height of logo + texts + spacing
    const startY = (pageHeight - blockHeight) / 2; // center vertically
  
    // Logo
    doc.addImage(logo, "PNG", (pageWidth - logoWidth) / 2, startY, logoWidth, logoHeight);
  
    // Main Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(200, 0, 0);
    doc.text("Shri Ji Enterprises", pageWidth / 2, startY + 130, { align: "center" });
  
    // Tagline
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(0, 102, 204);
    doc.text(
      "Pharmaceuticals | Surgical | Medical Equipment",
      pageWidth / 2,
      startY + 160,
      { align: "center" }
    );
    doc.text(
      "Generic & Patent Medicines | Injections",
      pageWidth / 2,
      startY + 180,
      { align: "center" }
    );
  
    // Separator line
    doc.setDrawColor(200, 0, 0);
    doc.line(100, startY + 200, pageWidth - 100, startY + 200);
  
    // Contact Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Contact:", pageWidth / 2, startY + 230, { align: "center" });
  
    doc.setFont("helvetica", "normal");
    doc.text("8707868591, 9211037182", pageWidth / 2, startY + 250, { align: "center" });
    doc.text("Keshav Nagar, Lucknow, Uttar Pradesh", pageWidth / 2, startY + 270, { align: "center" });
  
    // Slogan
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 0);
    doc.text("Your Health, Our Priority", pageWidth / 2, startY + 310, { align: "center" });
  
    // === Page 2 (existing logic stays same) ===
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Product List", 40, 40);
  
    let yPos = 70;
    let col = 0;
    const cardWidth = (pageWidth - 80) / 2;
    const cardHeight = 280;
    const imgHeight = 200;
  
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      let xPos = col === 0 ? 40 : 40 + cardWidth + 20;
  
      doc.setDrawColor(200, 200, 200);
      doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 8, 8);
  
      if (p.image) {
        try {
          const imgBase64 = await getBase64Image(p.image);
          doc.addImage(imgBase64, "PNG", xPos, yPos, cardWidth, imgHeight, undefined, "SLOW");
        } catch (err) {
          console.error("Image load error", err);
        }
      }
  
      let textX = xPos + 10;
      let textY = yPos + imgHeight + 20;
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(p.productName || "", textX, textY);
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
  
      if (p.company) {
        textY += 15;
        doc.text("Company: " + p.company, textX, textY);
      }
      if (p.salt) {
        textY += 15;
        doc.text("Salt: " + p.salt, textX, textY);
      }
      if (p.mrp) {
        textY += 15;
        doc.setFont("helvetica", "italic");
        doc.text("MRP: Rs." + p.mrp, textX, textY);
      }
    //   if (p.rate) {
    //     textY += 15;
    //     doc.setFont("helvetica", "italic");
    //     doc.text("Rate: Rs." + p.rate, textX, textY);
    //   }
  
      if (col === 0) {
        col = 1;
      } else {
        col = 0;
        yPos += cardHeight + 20;
      }
  
      if (yPos > pageHeight - 320) {
        doc.addPage();
        yPos = 60;
        col = 0;
      }
    }
  
    doc.save("products.pdf");
}
    catch (err) {
        console.error(err);
      } finally {
        setLoadingPDF(false); // ✅ stop loading
      }
  };
  
  
  return (
    <>
    <Header isLoggedStatus={isLoggedCheck} />
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Manager</h1>

      {/* Button to open Add Modal */}
      <div className="flex justify-end gap-2 items-center">
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
      >
        Add Product
      </button>
      <button
            onClick={downloadPDF}
            disabled={loadingPDF} // ✅ disable while loading
            className={`${
              loadingPDF ? "bg-green-400 cursor-not-allowed" : "bg-green-600"
            } text-white px-4 py-2 rounded text-sm flex items-center gap-2`}
          >
            {loadingPDF ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Download PDF"
            )}
          </button>
      </div>
      {/* Product List */}
      <div className="mt-6">
        <h2 className="text-xl mb-2">Products</h2>
        <ul className="lg:flex lg:flex-wrap gap-3">
          {products.map((p) => (
            <li
              key={p._id}
              className=" border-b py-2 bg-white rounded px-3 shadow-sm mb-2"
            >
              <div className="">
                <div>
                  {p.image && (
                    <img src={p.image} alt="" className="w-80 h-80" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-2xl">{p.productName}</p>
                  {p.company && <p>{p.company}</p>}
                  {p.salt && <p>{p.salt}</p>}
                  {p.mrp && (
                    <p className="text-sm text-gray-600">MRP: ₹{p.mrp}</p>
                  )}
                </div>
              
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => setEditProduct(p)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {setShow(true),setId(p._id)}}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Download PDF */}
     

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Product</h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-3 border p-4 rounded bg-white shadow"
            >
              {["productName", "company", "mrp", "rate", "salt"].map((f) => (
                <input
                  key={f}
                  type="text"
                  placeholder={f}
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="border p-2 w-full rounded"
                  required={f === "productName"}
                />
              ))}
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="border p-2 w-full rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              {["productName", "company", "mrp", "rate", "salt"].map((f) => (
                <input
                  key={f}
                  type="text"
                  placeholder={f}
                  value={editProduct[f]}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, [f]: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                />
              ))}

              {editProduct.image && !editProduct.newImage && (
                <img
                  src={editProduct.image}
                  alt="current"
                  className="w-24 h-24 object-cover rounded border"
                />
              )}
              {editProduct.newImage && (
                <img
                  src={URL.createObjectURL(editProduct.newImage)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
              )}

              <input
                type="file"
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    newImage: e.target.files[0],
                  })
                }
                className="border p-2 w-full rounded"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {show&&<ConfirmationModal setConfirmDeleteId={setShow} confirmDelete={handleDelete} confirmDeleteId={show} title={"Are your sure want to delete this item"}/>}
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
    if (
      loggedIn &&
      loginType !== "admin" &&
      loginType !== "sales" &&
      loginType !== "stockiest"
    ) {
      return {
        props: {},
        redirect: { destination: "/admin" },
      };
    }
    const isLoggedStatus = loggedIn;
    const checkLoginType = loginType;
  
    return {
      props: { isLoggedStatus, checkLoginType },
    };
  }
export default ItemListWithImages;
