// components/CartSyncHandler.js
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from '../context/CartContext';

const CartSyncHandler = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const syncGuestCart = async () => {
      if (user && user._id) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        // for (const item of guestCart) {
        //   await addToCart(item.product, item.selectedCountryId, item.selectedPriceIndex, item.quantity);
        // }
        // localStorage.removeItem("guestCart");
      }
    };

    syncGuestCart();
  }, [user]);

  return null; 
};

export default CartSyncHandler;
