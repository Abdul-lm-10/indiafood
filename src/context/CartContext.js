// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useCountry } from "./CountryContext";
import { toast } from 'react-toastify';

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
      mergeGuestCartToUserCart();
      fetchCart();
    }
  }, [user, selectedCountryId]);


  useEffect(() => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCart(guestCart);
    }
  }, [user]);


  const fetchCart = async () => {
    const now = Date.now();
    if (isLoading || now - lastFetchTime < 1000) return;

    setIsLoading(true);
    setLastFetchTime(now);

    try {
      if (user && user._id) {
        const res = await axios.get(
          `https://api.indiafoodshop.com/api/auth/v1/cart/user/${user._id}?country_id=${selectedCountryId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data && res.data.data) {
          setCart(res.data.data);
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCart(guestCart);
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

      const selectedPrice = Array.isArray(product.prices) && product.prices.length > selectedPriceIndex
        ? product.prices[selectedPriceIndex]
        : product.prices?.[0] ?? { price: 0, quantity: 1 };

      const formattedDate = new Date().toISOString();

      const cartItem = {
        product_id: product._id || product.product_id,
        quantity: selectedPrice.quantity,
        price: selectedPrice.price,
        shipping_charge: selectedPrice.shipping_charge || 0,
        country_id: selectedCountryId,
        pieces: quantity,
        status: "Active",
        admin: product.admin || "guest",
        date_time: formattedDate,
        product_details: {
          name: product.name,
          image: product.image,
          category: product.category,
          category_id: product.category_id,
          description: product.description
        }
      };

      const isAlreadyInCart = guestCart.some(item =>
        item.product_id === cartItem.product_id &&
        item.quantity === cartItem.quantity
      );

      if (isAlreadyInCart) {
        toast.warning("This item is already in your cart.");
        return;
      }

      guestCart.push(cartItem);
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      toast.success("Added to cart successfully");
      setCart(guestCart);
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
        shipping_charge: selectedPrice.shipping_charge || 0,
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
      toast.success("Added to cart successfully");
      fetchCart();
    } catch (err) {
      toast.error("Failed to add to cart:", err.response?.data || err.message);
    }
  };

  const mergeGuestCartToUserCart = async () => {
    if (!user) return;

    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    if (!guestCart.length) return;

    try {
      const res = await axios.get(
        `https://api.indiafoodshop.com/api/auth/v1/cart/user/${user._id}?country_id=${selectedCountryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const serverCart = res.data?.data || [];
      console.log("Server Cart:", serverCart);

      const itemsToAdd = guestCart.filter(guestItem => {
        const guestProductId = String(guestItem.product_id).trim();

        return !serverCart.some(serverItem => {
          const serverProductId = typeof serverItem.product_id === 'object'
            ? serverItem.product_id._id
            : serverItem.product_id;
          return String(serverProductId).trim() === guestProductId;
        });
      });

      console.log("Items to Add:", itemsToAdd);

      if (itemsToAdd.length > 0) {

        for (const item of itemsToAdd) {
          try {
            const payload = {
              product_id: item.product_id,
              user_id: user._id,
              quantity: item.quantity,
              price: item.price,
              shipping_charge: item.shipping_charge || 0,
              country_id: item.country_id || selectedCountryId,
              pieces: item.pieces,
              product_name: item.product_details?.name || '',
              product_image: item.product_details?.image || '',
              product_category: item.product_details?.category || '',
              product_description: item.product_details?.description || '',
              admin: item.admin || user.admin || false,
              date_time: item.date_time || new Date().toISOString(),
            };

            console.log("Sending payload:", payload);

            await axios.post("https://api.indiafoodshop.com/api/auth/v1/cart", payload, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            console.log("Successfully added:", item.product_id);
          } catch (err) {
            console.error("Failed to add item:", item.product_id, err.response?.data || err.message);
          }
        }
      }

      localStorage.removeItem("guestCart");

      await fetchCart();

    } catch (err) {
      console.error("Merge failed:", err);
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      console.log("Restored guest cart due to error");
    }
  };

  const updateCartItem = async (cartItemId, pieces) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const updatedCart = guestCart.map(item =>
        item.product_id === cartItemId ? { ...item, pieces } : item
          === cartItemId ? { ...item, pieces } : item
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      console.log("Trying to update/remove product_id:", cartItemId);
      console.log("Guest cart items:", guestCart.map(i => i.product_id));
      setCart(updatedCart);
      return;
    }

    try {
      await axios.put(`https://api.indiafoodshop.com/api/auth/v1/cart/${cartItemId}`, {
        pieces,
        country_id: selectedCountryId,
      });
      fetchCart();

    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };


  const updateGuestCartPrices = async () => {
    if (user) return;

    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    if (!guestCart.length) return;

    try {
      const res = await axios.get(
        `https://api.indiafoodshop.com/admin/products-by-country?country_id=${selectedCountryId}`
      );

      const products = res.data;

      const updatedCart = guestCart.map((item) => {
        const product = products.find(p => p._id === item.product_id);

        if (!product || !Array.isArray(product.prices)) return item;

        // Pick the first price object as fallback
        const priceObj = product.prices[0];

        return {
          ...item,
          price: priceObj?.price ?? item.price,
          shipping_charge: priceObj?.shipping_charge ?? item.shipping_charge,
          quantity: priceObj?.quantity ?? item.quantity,
          country_id: selectedCountryId,
          product_details: {
            ...item.product_details,
            prices: product.prices
          }
        };
      });

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (err) {
      console.error("Failed to fetch products by country:", err);
    }
  };


  const updateUserCartPrices = async () => {
    if (!user) return;

    try {
      const cartRes = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/cart`);
      const userCart = cartRes.data?.data || [];

      const productRes = await axios.get(
        `https://api.indiafoodshop.com/admin/products-by-country?country_id=${selectedCountryId}`
      );
      const products = productRes.data;

      // Update each cart item
      await Promise.all(
        userCart.map(async (item) => {
          const productId = item.product_id?._id || item.product_id;

          const matchingProduct = products.find(p => p._id === productId);
          if (!matchingProduct || !Array.isArray(matchingProduct.prices)) return;

          const priceObj = matchingProduct.prices[0]; // default price object

          try {
            await axios.put(`https://api.indiafoodshop.com/api/auth/v1/cart/${item._id}`, {
              pieces: item.pieces,
              country_id: selectedCountryId,
              price: priceObj.price,
              shipping_charge: priceObj.shipping_charge,
              quantity: priceObj.quantity
            });
          } catch (err) {
            console.error(`Failed to update cart item: ${item._id}`, err);
          }
        })
      );

      // Refresh the cart
      fetchCart();
    } catch (err) {
      console.error("Error updating user cart prices:", err);
    }
  };



  const removeFromCart = async (cartItemId) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const updatedCart = guestCart.filter(item => item.product_id !== cartItemId);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      toast.success("Removed from cart successfully");
      return;
    }

    try {
      await axios.delete(`https://api.indiafoodshop.com/api/auth/v1/cart/${cartItemId}`);
      fetchCart();
      toast.success("Removed from cart successfully");
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };


  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem("guestCart");
      setCart([]);
      return;
    }

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
    <CartContext.Provider value={{ cart, setCart, addToCart, updateCartItem, removeFromCart, clearCart, mergeGuestCartToUserCart, updateGuestCartPrices, updateUserCartPrices }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
