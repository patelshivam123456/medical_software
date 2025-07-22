import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const router = useRouter();

  const [variants, setVariants] = useState([]);
  const [selectedMG, setSelectedMG] = useState("");
  const [stripCount, setStripCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const { cart, fetchCart, mobile, setCart } = useCart();

  useEffect(() => {
    if (!router.isReady) return; // ✅ Wait for query to be ready

    const  {name}  = router.query
  console.log(name);
  
    if (!name) {
      toast.error("Invalid tablet name");
      // router.push("/user/product/product-list");
      return;
    }

    const fetchVariants = async () => {
      try {
        const res = await axios.get("/api/tablets");
        const allTabs = Array.isArray(res.data) ? res.data : res.data.tablets;

        const matched = allTabs
          .filter((t) => t.name === name)
          .filter((t) => {
            if (!t.expiry) return true;
            const [m, y] = t.expiry.split("/").map(Number);
            const today = new Date();
            const cy = today.getFullYear() % 100;
            const cm = today.getMonth() + 1;
            return y > cy || (y === cy && m > cm);
          });

        if (matched.length === 0) {
          toast.error("Tablet not found or expired");
          // router.push("/user/product/product-list");
          return;
        }

        setVariants(matched);
        setSelectedMG(matched[0]?.mg || "");
      } catch (err) {
        console.error("Error loading tablets", err);
        toast.error("Failed to load tablets");
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [router.isReady, router.query]);


  const selectedTab = variants.find((v) => v.mg === selectedMG);

  const handleAddToCart = async () => {
    if (!mobile) return toast.error("Please login first");
    if (!selectedTab) return toast.error("Invalid MG");

    const strips = parseInt(stripCount);
    const stripCountInPack = parseInt(selectedTab.packaging.split("*")[1] || "1");
    const quantity = strips * stripCountInPack;
    const total = selectedTab.price * strips;

    const payload = {
      _id: selectedTab._id,
      name: selectedTab.name,
      packaging: selectedTab.packaging,
      category: selectedTab.category,
      company: selectedTab.company,
      salt: selectedTab.salt,
      purchase: selectedTab.purchase,
      price: selectedTab.price,
      mrp: selectedTab.mrp,
      mg: selectedTab.mg,
      batch: selectedTab.batch,
      expiry: selectedTab.expiry,
      strips:selectedTab.strips,
      quantity,
      total,
      mobile,
    };

    try {
      await axios.post("/api/order/cart", payload);
      toast.success("🛒 Added to cart");
      await fetchCart();
      const res = await axios.get(`/api/order/cart?mobile=${mobile}`);
      setCart(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!selectedTab) return <div className="text-center py-20">Tablet not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start gap-6">
          <img
            src="/category/med.jpg"
            alt={selectedTab.name}
            className="w-24 h-24 object-cover rounded"
          />
          <div>
            <h1 className="text-xl font-bold">{selectedTab.name}</h1>
            <p className="text-sm text-gray-600">{selectedTab.company}</p>
            <p className="text-sm text-gray-500">Category: {selectedTab.category}</p>
            <p className="text-sm text-gray-500">Pack: {selectedTab.packaging}</p>
            <p className="text-sm text-gray-500">Salt: {selectedTab.salt}</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Select MG:</label>
          <div className="flex gap-2 flex-wrap">
            {variants.map((v, i) => (
              <button
                key={i}
                onClick={() => setSelectedMG(v.mg)}
                className={`px-3 py-1 border rounded text-sm ${
                  selectedMG === v.mg ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {v.mg}
              </button>
            ))}
          </div>
        </div>

        {selectedTab && (
          <>
            <div className="mt-4 text-sm text-gray-600">
              Price: ₹{selectedTab.price} / strip <br />
              Stock: {selectedTab.quantity}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                min={1}
                className="border px-3 py-2 rounded w-24 text-sm"
                value={stripCount}
                onChange={(e) => setStripCount(e.target.value)}
              />
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
              >
                ➕ Add to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
