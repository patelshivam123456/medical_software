import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ProductList = () => {
  const [groupedTablets, setGroupedTablets] = useState([]);
  const [stripCounts, setStripCounts] = useState({});
  const [selectedMG, setSelectedMG] = useState({});
  const [mobile, setMobile] = useState("8707868591");
  const [cart, setCart] = useState([]);
  const [loadingTablets, setLoadingTablets] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);

  const router = useRouter();
  const { category } = router.query;

  const [selectedCategory, setSelectedCategory] = useState(category || "");

  useEffect(() => {
    setSelectedCategory(category || "");
  }, [category]);

  const CategoryList = [
    { id: 1, value: "", option: "All" },
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

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    router.push(
      selected
        ? `/user/product/product-list?category=${encodeURIComponent(selected)}`
        : `/user/product/product-list`
    );
  };

  useEffect(() => {
    const fetchTablets = async () => {
      setLoadingTablets(true);
      try {
        const res = await axios.get("/api/tablets");
        const data = Array.isArray(res.data) ? res.data : res.data.tablets;

        const filtered = category
          ? data.filter((tab) => tab.category?.toLowerCase() === category.toLowerCase())
          : data;

        const grouped = {};
        filtered.forEach((tab) => {
          if (!grouped[tab.name]) {
            grouped[tab.name] = {
              name: tab.name,
              packaging: tab.packaging,
              category: tab.category,
              company: tab.company,
              mgOptions: [],
              fullTabs: [],
            };
          }
          if (tab.mg && !grouped[tab.name].mgOptions.includes(tab.mg)) {
            grouped[tab.name].mgOptions.push(tab.mg);
          }
          grouped[tab.name].fullTabs.push(tab);
        });

        setGroupedTablets(Object.values(grouped));

        // ✅ Prefill MG and strip counts
        const mgInit = {};
        const stripInit = {};
        Object.values(grouped).forEach((product) => {
          if (product.mgOptions.length > 0) {
            mgInit[product.name] = product.mgOptions[0];
            stripInit[product.name] = 3;
          }
        });
        setSelectedMG(mgInit);
        setStripCounts(stripInit);
      } catch (err) {
        console.error("Error fetching tablets:", err);
      } finally {
        setLoadingTablets(false);
      }
    };

    fetchTablets();
  }, [category]);

  useEffect(() => {
    if (!mobile) return;
    const fetchCart = async () => {
      setLoadingCart(true);
      try {
        const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
        setCart(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching cart:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [mobile]);

  const handleStripChange = (productName, value) => {
    setStripCounts((prev) => ({ ...prev, [productName]: value }));
  };

  const handleMGChange = (productName, mg) => {
    setSelectedMG((prev) => ({ ...prev, [productName]: mg }));
  };

  const isInCart = (product) => {
    const selectedMg = selectedMG[product.name];
    return cart.some((item) => item.name === product.name && item.mg === selectedMg);
  };

  const handleAddToCart = async (product) => {
    const selectedMg = selectedMG[product.name];
    const strips = Number(stripCounts[product.name] || 0);

    if (!selectedMg || !strips || strips <= 0) {
      toast.error("Please select MG and enter valid strips.");
      return;
    }

    const tablet = product.fullTabs.find((t) => t.mg === selectedMg);
    if (!tablet) {
      toast.error("Variant not found");
      return;
    }

    const stripCountInPack = parseInt(product.packaging.split("*")[1] || "1");
    const quantity = stripCountInPack * strips;
    const total = tablet.price * strips;

    const payload = {
      _id: tablet._id,
      name: tablet.name,
      packaging: tablet.packaging,
      category: tablet.category,
      company: tablet.company,
      salt: tablet.salt,
      purchase: tablet.purchase,
      price: tablet.price,
      mrp: tablet.mrp,
      mg: tablet.mg,
      batch: tablet.batch,
      expiry: tablet.expiry,
      strips,
      quantity,
      total,
      mobile,
    };

    try {
      await axios.post("/api/order/cart", payload);
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
      toast.success("🛒 Added to cart successfully");
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleRemoveFromCart = async (product) => {
    const selectedMg = selectedMG[product.name];
    const tablet = product.fullTabs.find((t) => t.mg === selectedMg);
    if (!tablet) return toast.error("Tablet not found");
  
    try {
      await axios.delete("/api/order/cart", {
        data: { productId: tablet._id, mobile }
      });
      setCart((prev) => prev.filter((item) => !(item._id === tablet._id)));
      toast.success("Item removed from cart");
  
      // Optional re-fetch to sync
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
    } catch (err) {
      console.error("❌ Failed to remove:", err);
      toast.error("Failed to remove item");
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {category ? `Category: ${category}` : "Our Products"}
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Category:
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-64"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {CategoryList.map((cat) => (
              <option key={cat.id} value={cat.value}>
                {cat.option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingTablets ? (
        <div className="flex justify-center items-center h-[calc(100vh-400px)]">
          <div className="text-blue-600 font-semibold text-lg animate-pulse">
            Loading products...
          </div>
        </div>
      ) : groupedTablets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groupedTablets.map((product, index) => {
            const selectedMg = selectedMG[product.name];
            const strips = Number(stripCounts[product.name] || 0);
            const tablet = product.fullTabs.find((t) => t.mg === selectedMg);
            const availableStock = tablet?.quantity || 0;
            const alreadyInCart = isInCart(product);

            const handleClick = () => {
              if (!selectedMg) return toast.error("Please select MG");
              if (strips <= 0) return toast.error("Please enter a valid strip quantity");
              if (!tablet) return toast.error("Variant not found");
              if (availableStock === 0) return toast.error("Out of stock");
              if (strips > availableStock) return toast.error("Insufficient stock");

              handleAddToCart(product);
            };

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  <span>Product Image</span>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.company}</p>
                  <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
                  <p className="text-sm text-gray-500">Packaging: {product.packaging}</p>

                  <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    <select
                      className="border rounded-md px-3 py-2 text-sm text-gray-700 w-full"
                      value={selectedMG[product.name] || ""}
                      onChange={(e) => handleMGChange(product.name, e.target.value)}
                    >
                      <option value="">Select MG</option>
                      {product.mgOptions.map((mg, idx) => (
                        <option key={idx} value={mg}>
                          {mg} mg
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      placeholder="Strips"
                      className="border rounded-md px-3 py-2 text-sm w-full"
                      value={stripCounts[product.name] || ""}
                      onChange={(e) => handleStripChange(product.name, e.target.value)}
                    />
                  </div>

                  {availableStock === 0 ? (
                    <button
                      className="mt-4 w-full bg-gray-400 text-white rounded-md px-4 py-2 text-sm font-medium cursor-not-allowed"
                      disabled
                    >
                      Out of Stock
                    </button>
                  ) : alreadyInCart ? (
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <button
                        className="w-full bg-green-500 text-white rounded-md px-4 py-2 text-sm font-medium cursor-not-allowed"
                        disabled
                      >
                        Added
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveFromCart(product)}
                        title="Remove from cart"
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <button
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium"
                      onClick={handleClick}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-[calc(100vh-426px)]">
          <div className="bg-green-100 text-green-600 p-6 text-center">Item Not Found</div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
