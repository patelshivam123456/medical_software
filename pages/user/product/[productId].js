import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import LoaderComp from "@/components/User/LoaderComp";
import Header from "@/components/User/Header";
import Footer from "@/components/User/Footer";
import CategoryProductCard from "@/components/User/CategoryProductCard";

const ProductDetailPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  const [product, setProduct] = useState(null);
  const [selectedMG, setSelectedMG] = useState("");
  const [strips, setStrips] = useState(1);
  const [loading, setLoading] = useState(true);
  const { cart, fetchCart, mobile, setCart } = useCart();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get("/api/tablets");
        const allTabs = Array.isArray(res.data) ? res.data : res.data.tablets;
        const tabs = allTabs.filter(
          (tab) => tab._id === productId || tab.name === productId
        );
        console.log(tabs, "lllllllllll");

        if (!tabs.length) return toast.error("Product not found");

        const grouped = {
          name: tabs[0].name,
          packaging: tabs[0].packaging,
          category: tabs[0].category,
          company: tabs[0].company,
          salt: tabs[0].salt,
          batch: tabs[0].batch,
          mgOptions: [],
          fullTabs: [],
        };

        tabs.forEach((tab) => {
          if (tab.mg && !grouped.mgOptions.includes(tab.mg)) {
            grouped.mgOptions.push(tab.mg);
          }
          grouped.fullTabs.push(tab);
        });

        setProduct(grouped);

        const cartItem = cart.find((item) => item.name === grouped.name);
        setSelectedMG(cartItem?.mg || grouped.mgOptions[0]);
        setStrips(cartItem?.strips || 1);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getTablet = () => product?.fullTabs.find((t) => t.mg === selectedMG);

  const isInCart = () =>
    cart.some((item) => item.name === product.name && item.mg === selectedMG);

  const handleMGChange = (mg) => {
    setSelectedMG(mg);
    const item = cart.find((c) => c.name === product.name && c.mg === mg);
    setStrips(item?.strips || 0);
  };

  const handleStripChange = (val) => {
    const newVal = Math.max(1, parseInt(val));
    if (isNaN(newVal)) return;
    setStrips(newVal);
    if (isInCart()) updateCartStrips(newVal);
  };

  const updateCartStrips = async (newStrips) => {
    const tablet = getTablet();
    const packSize = parseInt(product.packaging.split("*")[1] || "1");
    const payload = {
      _id: tablet._id,
      strips: newStrips,
      quantity: packSize * newStrips,
      total: tablet.price * newStrips,
      mobile,
      price: tablet.price,
    };

    try {
      await axios.put("/api/order/cart", payload);
      await fetchCart();
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  const handleAddToCart = async () => {
    if (!mobile) return toast.error("Please login first");

    const tablet = getTablet();
    if (!tablet) return toast.error("Variant not found");
    if (strips <= 0) return toast.error("Enter valid strips");
    if (tablet.quantity === 0) return toast.error("Out of stock");
    if (strips > tablet.quantity) return toast.error("Insufficient stock");

    const packSize = parseInt(product.packaging.split("*")[1] || "1");
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
      quantity: strips * packSize,
      total: strips * tablet.price,
      mobile,
    };

    try {
      await axios.post("/api/order/cart", payload);
      await fetchCart();
      toast.success("Added to cart");
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const handleRemove = async () => {
    const tablet = getTablet();
    if (!tablet) return;
    try {
      await axios.delete("/api/order/cart", {
        data: { productId: tablet._id, mobile: mobile },
      });
      await fetchCart();
      await fetchCart();
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  if (loading) return <LoaderComp />;

  const tablet = getTablet();

  const categoryImages = {
    TAB: "/category/med.jpg",
    CREME: "/category/creme.jpg",
    "DRY SYP": "/category/drysyp.jpg",
    INJ: "/category/inj.jpg",
    OIL: "/category/oil.jpg",
    GEL: "/category/gel.jpg",
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border rounded">
          <img
            src={categoryImages[product.category.toUpperCase()]}
            alt={product.name}
            className="w-full h-64 object-contain p-4"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-0">{product.company}</p>
          <p className="text-sm text-gray-500 mb-2">{product.salt}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Category: {product.category}
              </p>
              <p className="text-sm text-gray-600">Pack: {product.packaging}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Batch: {tablet.batch}</p>
              <p className="text-sm text-gray-600">Expiry: {tablet.expiry}</p>
            </div>
          </div>

          <p className="text-xl font-semibold text-green-700 mt-4">
            ₹{tablet?.price || 0}
            <span className="text-sm text-gray-500">/strips</span>
          </p>

          <div className="flex items-center mt-4 gap-4">
            <label className="text-sm text-gray-600 font-semibold">
              {product?.mgOptions?.length > 1 ? "Units:" : "Unit:"}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.mgOptions.map((mg) => (
                <button
                  key={mg}
                  onClick={() => handleMGChange(mg)}
                  className={`px-3 py-1 text-sm rounded border ${
                    selectedMG === mg
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-black border-gray-300 cursor-pointer"
                  }`}
                >
                  {mg}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {tablet?.quantity === 0 ? (
              <button
                disabled
                className="w-full bg-gray-300 text-white py-2 rounded cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : isInCart() ? (
              <div className="flex items-center">
                <div
                  onClick={() => {
                    const newStrips = Math.max(0, strips - 1);
                    if (newStrips < 1) {
                      handleRemove(); // ✅ already defined to remove current variant
                    } else {
                      handleStripChange(newStrips); // ✅ FIXED: single argument
                    }
                  }}
                  className="cursor-pointer bg-green-700 text-white h-9 rounded-l-sm flex justify-center items-center w-10 text-sm text-center"
                >
                  -
                </div>

                <input
                  className="bg-green-700 text-white h-9 w-12 text-sm text-center"
                  value={strips}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      handleStripChange(val);
                    }
                  }}
                  type="text"
                />

                <div
                  onClick={() => {
                    const newStrips = strips + 1;
                    handleStripChange(newStrips);
                  }}
                  className="cursor-pointer bg-green-700 text-white h-9 rounded-r-sm flex justify-center items-center w-10 text-sm text-center"
                >
                  +
                </div>
              </div>
            ) : (
              <div
                onClick={handleAddToCart}
                className="border w-28 border-green-700 text-green-700 text-center cursor-pointer rounded px-4 py-2 text-sm"
              >
                Add
              </div>
            )}
          </div>
        </div>
      </div>
      <CategoryProductCard category={tablet.category}/>
      <div className="flex justify-end px-10  pb-4">
        <a href={`/user/product/product-list?category=${encodeURIComponent(tablet.category)}`} className="text-green-700 text-sm font-semibold">View All</a>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
