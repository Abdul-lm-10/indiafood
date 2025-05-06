import { createContext, useContext, useState } from 'react';

// Create a new context for the country
const CountryContext = createContext();

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
    <CountryContext.Provider value={{ selectedCountryId, handleCountryChange }}>
      {children}
    </CountryContext.Provider>
  );
};

// Custom hook to use the context
export const useCountry = () => useContext(CountryContext);
