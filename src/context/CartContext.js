// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useCountry } from "./CountryContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); 
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const countryContext = useCountry();
  const selectedCountryId = countryContext?.selectedCountryId || sessionStorage.getItem('selectedCountryId') || "67f5728b4722503b112dbd2b";


  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, selectedCountryId]);


  const fetchCart = async () => {
    const now = Date.now();
    if (isLoading || now - lastFetchTime < 1000) {
      return;
    }

    try {
      setIsLoading(true);
      setLastFetchTime(now);

      let res;
      if (user && user._id) {
        res = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/cart/user/${user._id}?country_id=${selectedCountryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });



        if (res.data && res.data.data) {
          setCart(res.data.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };



  const addToCart = async (product, selectedCountryId, selectedPriceIndex = 0, quantity = 1) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      guestCart.push({ product, selectedPriceIndex, quantity, selectedCountryId });
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      //window.location.href = '/login';
      return;
    }

    try {
      const selectedPrice = Array.isArray(product.prices) && product.prices.length > selectedPriceIndex
        ? product.prices[selectedPriceIndex]
        : product.prices?.[0] ?? { price: 0, quantity: 1 };

      const payload = {
        product_id: product._id || product.product_id,
        user_id: user._id,
        quantity: selectedPrice.quantity,
        price: selectedPrice.price,
        country_id: selectedCountryId,
        pieces: quantity,
        product_name: product.name || "",
        product_image: product.image || "",
        product_category: product.category || "",
        product_description: product.description || "",
        admin: product.admin || user.admin || false,
        date_time: new Date().toISOString(),
      };

      await axios.post(`https://api.indiafoodshop.com/api/auth/v1/cart`, payload);
      fetchCart();
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data || err.message);
    }
  };


  const updateCartItem = async (cartItemId, pieces) => {
    try {
      await axios.put(`https://api.indiafoodshop.com/api/auth/v1/cart/${cartItemId}`, {
        pieces,
        country_id: selectedCountryId
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`https://api.indiafoodshop.com/api/auth/v1/cart/${cartItemId}`);
      fetchCart();
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  const clearCart = async () => {
    try {
      await Promise.all(
        cart.map((item) =>
          axios.delete(`https://api.indiafoodshop.com/api/auth/v1/cart/${item._id}`)
        )
      );
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };


  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
