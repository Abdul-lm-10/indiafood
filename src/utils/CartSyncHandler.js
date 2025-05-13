import { useEffect } from 'react';
import { useCountry } from '../context/CountryContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // ✅ import useAuth

const CartSyncHandler = () => {
  const { selectedCountryId } = useCountry();
  const { updateGuestCartPrices, updateUserCartPrices } = useCart(); // ✅ include both
  const { user } = useAuth(); // ✅ check if user is logged in

  useEffect(() => {
    if (user) {
      if (typeof updateUserCartPrices === 'function') {
        updateUserCartPrices();
      }
    } else {
      if (typeof updateGuestCartPrices === 'function') {
        updateGuestCartPrices();
      }
    }
  }, [selectedCountryId, user]);

  return null;
};

export default CartSyncHandler;
