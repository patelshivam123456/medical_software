import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [mobile, setMobile] = useState("");
  const [cartLoading, setCartLoading] = useState(false); // ✅ loading state

  // Fetch cart items by mobile number
  const fetchCart = async (mobileNumber) => {
    if (!mobileNumber) return;
    setCartLoading(true);
    try {
      const res = await axios.get(`/api/order/cart?mobile=${mobileNumber}`);
      setCart(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
    } finally {
      setCartLoading(false);
    }
  };

  // Remove item from cart by productId
  const removeFromCart = async (productId) => {
    setCartLoading(true);
    try {
      await axios.delete("/api/order/cart", {
        data: { productId, mobile },
      });
      setCart((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
    } finally {
      setCartLoading(false);
    }
  };

  // On mount, get mobile from cookie and fetch cart
  useEffect(() => {
    const savedMobile = Cookies.get("mobile");
    if (savedMobile) {
      setMobile(savedMobile);
      fetchCart(savedMobile);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCart,
        removeFromCart,
        mobile,
        cartLoading, // ✅ make available in context
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
