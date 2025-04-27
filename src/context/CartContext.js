// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // Assuming you store user in localStorage

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      let res;
      if (user) {
        // Logged in
        res = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/cart/user/${user._id}`);
      } else {
        // Not logged in
        res = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/cart`);
      }
      setCart(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };
  
  const addToCart = async (product,selectedCountryId) => {
    try {
      console.log("Selected Product:", product); // Log selected product
  
      const existingItem = cart.find((item) => item.product_id === product._id);
  
      if (existingItem) {
        // If item exists, increase quantity
        await axios.put(`https://api.indiafoodshop.com/api/auth/v1/cart/${existingItem._id}`, {
          quantity: existingItem.quantity + 1,
        });
      } else {
        const payload = {
          product_id: product._id,
          user_id: user._id,
          quantity: 1,
          price: product.prices?.[0]?.price ?? product.price ?? 1,
          country_id: selectedCountryId,
          pieces: product.pieces || 1,
          admin: product.admin || user.admin || false,
          product_name: product.name || "",
          product_image: product.image || "",
          product_category: product.category || "",
          product_description: product.description || "",
        };
  
        console.log("Payload sending to Cart API:", payload);
  
        await axios.post(`https://api.indiafoodshop.com/api/auth/v1/cart`, payload); // 👉 corrected URL
      }
  
      fetchCart(); // Refresh cart
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data || err.message);
    }
  };
  

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await axios.put(`https://api.indiafoodshop.com/api/auth/v1/cart/${cartItemId}`, { quantity });
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
