import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import ProductCard from "./ProductCard";
import LoaderComp from "./LoaderComp";

const CategoryProductCard = ({category}) => {
  const [groupedTablets, setGroupedTablets] = useState([]);
  const [stripCounts, setStripCounts] = useState({});
  const [selectedMG, setSelectedMG] = useState({});
  const [loadingTablets, setLoadingTablets] = useState(true);
  const { cart, setCart, fetchCart, mobile } = useCart();

  const router = useRouter();
//   const { category } = router.query;

  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    setSelectedCategory(category);
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
    const mgInit = {};
    const stripInit = {};
    groupedTablets.forEach((product) => {
      const cartItem = cart.find(
        (item) =>
          item.name === product.name && product.mgOptions.includes(item.mg)
      );
      if (cartItem) {
        mgInit[product.name] = cartItem.mg;
        stripInit[product.name] = cartItem.strips;
      } else {
        mgInit[product.name] = product.mgOptions[0];
        stripInit[product.name] = 1;
      }
    });

    setSelectedMG(mgInit);
    setStripCounts(stripInit);
  }, [groupedTablets, cart]);

  useEffect(() => {
    const fetchTablets = async () => {
      setLoadingTablets(true);
      try {
        const res = await axios.get("/api/tablets");
        const data = Array.isArray(res.data) ? res.data : res.data.tablets;

        const filtered = (
          category
            ? data.filter(
                (tab) => tab.category?.toLowerCase() === category.toLowerCase()
              )
            : data
        ).filter((tab) => {
          if (!tab.expiry) return true;
          const [expMonth, expYear] = tab.expiry.split("/").map(Number);
          if (!expMonth || !expYear) return true; 
          const today = new Date();
          const currentMonth = today.getMonth() + 1;
          const currentYear = today.getFullYear() % 100;

         
          if (expYear < currentYear) return false;
          if (expYear === currentYear && expMonth <= currentMonth) return false;

          return true; 
        });

        const grouped = {};
        filtered.forEach((tab) => {
          if (!grouped[tab.name]) {
            grouped[tab.name] = {
              name: tab.name,
              packaging: tab.packaging,
              category: tab.category,
              company: tab.company,
              price:tab.price,
              mgOptions: [],
              fullTabs: [],
            };
          }
          if (tab.mg && !grouped[tab.name].mgOptions.includes(tab.mg)) {
            grouped[tab.name].mgOptions.push(tab.mg);
          }
          grouped[tab.name].fullTabs.push(tab);
        });

        setGroupedTablets(Object.values(grouped)?.slice(0,5));

     
        const mgInit = {};
        const stripInit = {};
        Object.values(grouped).forEach((product) => {
          const cartItem = cart.find(
            (item) =>
              item.name === product.name && product.mgOptions.includes(item.mg)
          );
          if (cartItem) {
            mgInit[product.name] = cartItem.mg;
            stripInit[product.name] = cartItem.strips;
          } else {
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
    fetchCart();
  }, [fetchCart]);

  const handleStripChange = (productName, value) => {
    const newStrips = Number(value);
    setStripCounts((prev) => ({ ...prev, [productName]: newStrips }));

    const product = groupedTablets.find((p) => p.name === productName);
    if (product && isInCart(product)) {
      updateCartStrips(product, newStrips);
    }
  };

  // const handleMGChange = (productName, mg) => {
  //   setSelectedMG((prev) => ({ ...prev, [productName]: mg }));
  // };
  const handleMGChange = (productName, mg) => {
    setSelectedMG((prev) => ({ ...prev, [productName]: mg }));

    const product = groupedTablets.find((p) => p.name === productName);
    if (!product) return;

    // If product has only one MG, do not change strips logic (preserve behavior)
    if (product.mgOptions.length <= 1) return;

    const cartItem = cart.find(
      (item) => item.name === productName && item.mg === mg
    );
    const strips = cartItem ? cartItem.strips : 1;

    setStripCounts((prev) => ({
      ...prev,
      [productName]: strips,
    }));
  };

  const isInCart = (product) => {
    const selectedMg = selectedMG[product.name];
    return cart.some(
      (item) => item.name === product.name && item.mg === selectedMg
    );
  };

  const handleAddToCart = async (product) => {
    const selectedMg = selectedMG[product.name] || product.mgOptions[0];

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
      await fetchCart();
      toast.success("🛒 Added to cart successfully");
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
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
        data: { productId: tablet._id, mobile },
      });

      toast.success("Item removed from cart");
      await fetchCart();
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
    } catch (err) {
      console.error("❌ Failed to remove:", err);
      toast.error("Failed to remove item");
    }
  };

  const updateCartStrips = async (product, newStrips) => {
    const selectedMg = selectedMG[product.name];
    const tablet = product.fullTabs.find((t) => t.mg === selectedMg);
    if (!tablet) return;

    const stripCountInPack = parseInt(product.packaging.split("*")[1] || "1");
    const quantity = stripCountInPack * newStrips;
    const total = tablet.price * newStrips;
    console.log(total);

    const updatedPayload = {
      _id: tablet._id,
      strips: newStrips,
      quantity,
      total: total,
      mobile,
      price: tablet.price,
    };

    try {
      await axios.put("/api/order/cart", updatedPayload); // Or POST if PUT not supported
      await fetchCart();
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
    } catch (err) {
      console.error("❌ Failed to update cart:", err);
      toast.error("Failed to update cart");
    }
  };

  const categoryImages = {
    TAB: "/category/med.jpg",
    CREME: "/category/creme.jpg",
    "DRY SYP": "/category/drysyp.jpg",
    INJ: "/category/inj.jpg",
    OIL: "/category/oil.jpg",
    GEL: "/category/gel.jpg",
    "SURGICALS":"/category/surgical.webp"
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-2 pb-4">
        <h2 className="text-lg font-bold sm:mb-2 text-gray-800">
          {category ? `${category} Releted Product` : "Our Products"}
        </h2>
      {/* <div className="sm:flex justify-between">
        <h2 className="text-2xl font-bold sm:mb-6 text-gray-800">
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
      <div>
      </div> */}

      {loadingTablets ? (
        <div className="flex justify-center items-center h-[calc(100vh-400px)]">
          <LoaderComp/>
        </div>
      ) : groupedTablets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {groupedTablets.map((product, index) => {
            const selectedMg = selectedMG[product.name];
            const strips = Number(stripCounts[product.name] || 0);
            const tablet = product.fullTabs.find((t) => t.mg === selectedMg);
            const availableStock = tablet?.quantity || 0;
            const alreadyInCart = isInCart(product);

            const handleClick = () => {
              if (!mobile) {
                toast.error("Your are not Logged In, Please Login First");
              } else {
                if (!selectedMg) return toast.error("Please select MG");
                if (strips <= 0)
                  return toast.error("Please enter a valid strip quantity");
                if (!tablet) return toast.error("Variant not found");
                if (availableStock === 0) return toast.error("Out of stock");
                if (strips > availableStock)
                  return toast.error("Insufficient stock");

                handleAddToCart(product);
              }
            };

            return (
              <>
                <div className="border border-gray-400 rounded p-2 cursor-pointer" >
                  <div className="flex ju">
                    <img
                      src={
                        categoryImages[product.category.toUpperCase()] ||
                        "/productcategory/default.jpg"
                      }
                      alt={product.category}
                      className="w-full h-28"
                    />
                  </div>
                  <div onClick={()=>router.push(`/user/product/${product.name}`)} className="text-[14px] font-medium text-gray-600 font-sans pt-2 line-clamp-2 h-13">
                    {product.name}
                  </div>
                  <div className="text-xs font-medium text-gray-600 font-sans pt-0">
                    {product.company}
                  </div>
                  <div className="flex justify-between items-center">
                    <select
                      value={selectedMG[product.name] || product.mgOptions[0]}
                      onChange={(e) =>
                        handleMGChange(product.name, e.target.value)
                      }
                      className="mt-2 text-xs font-medium text-gray-600 font-sans border px-2 py-1 rounded outline-none"
                    >
                      {product.mgOptions.map((mg, idx) => (
                          <option key={idx} value={mg}>
                            {mg}
                          </option>
                        ))}
                    </select>
                    <div className="mt-2 text-xs font-medium text-gray-600 font-sans">
                    {product.packaging} pack
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm font-semibold text-gray-600 font-sans">
                    ₹{product.fullTabs.find((tab) => tab.mg === selectedMG[product.name])?.price || 0}
                    </div>
                    {availableStock === 0 ?
                    <div className="border bg-gray-300 text-white cursor-not-allowed rounded px-5 py-1.5 text-sm">
                    Add
                  </div>
                    :
                    alreadyInCart ?  <div className="flex items-center">
                      <div onClick={() => {
                          const newStrips = Math.max(0, strips - 1);
                          console.log(newStrips);
                          
                          if(newStrips<1){
                            handleRemoveFromCart(product)
                          }else{
                            handleStripChange(product.name, newStrips);
                          }  
                        }}
                         className="cursor-pointer bg-green-700 text-white h-8 rounded-l-sm flex justify-center items-center w-6 text-sm text-center">
                        -
                      </div>
                      <input className="bg-green-700 text-white h-8  flex justify-center items-center w-5 text-sm text-center"
                        value={strips}
                        onChange={(e) =>
                          handleStripChange(product.name, e.target.value)
                        }
                        type="text"
                        disabled
                      />
                      <div onClick={() => {
                          const newStrips = strips + 1;
                          handleStripChange(product.name, newStrips);
                        }}
                       className="cursor-pointer bg-green-700 text-white h-8 rounded-r-sm flex justify-center items-center w-6 text-sm text-center">
                        +
                      </div>
                    </div>
                    :<div onClick={handleClick}
                     className="border border-green-700 text-green-700 cursor-pointer rounded px-4 py-1 text-sm">
                    Add
                  </div>}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                   
                  
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <div className="h-[calc(100vh-426px)]">
          <div className="bg-green-100 text-green-600 p-6 text-center">
            Item Not Found
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProductCard;
