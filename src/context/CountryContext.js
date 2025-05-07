import { createContext, useContext, useState } from 'react';

// Create a new context for the country
const CountryContext = createContext();


const currencyMap = {
  "67f5728b4722503b112dbd2b": "₹", // India
  "67f5730cedfb59d6772ed0d5": "$", // USA
  "67f57335edfb59d6772ed0e1": "€", // Australia
  "67f5731cedfb59d6772ed0db": "£", // UK
  "67f57356edfb59d6772ed0eb": "₩", // UAE
  "67f57347edfb59d6772ed0e5": "¥", // Singapore
};

// Create a provider component
export const CountryProvider = ({ children }) => {
  const [selectedCountryId, setSelectedCountryId] = useState(() => {
    return sessionStorage.getItem('selectedCountryId') || "67f5728b4722503b112dbd2b";
  });

  const handleCountryChange = (countryId) => {
    setSelectedCountryId(countryId);
    sessionStorage.setItem('selectedCountryId', countryId);
  };

  return (
    <CountryContext.Provider value={{ selectedCountryId, handleCountryChange,  currencySymbol: currencyMap[selectedCountryId] || '₹' }}>
      {children}
    </CountryContext.Provider>
  );
};

// Custom hook to use the context
export const useCountry = () => useContext(CountryContext);
