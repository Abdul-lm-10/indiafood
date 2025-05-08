import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); 

  
  // Fetch user details when token is present
  useEffect(() => {
    if (token) {                  
      axios
        .get('https://api.indiafoodshop.com/api/auth/v1/user-details', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data); // Set the user data after fetching
          localStorage.setItem('user', JSON.stringify(res.data)); // Persist user data
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false)); // End loading state
    } else {
      setLoading(false); // If no token, end loading immediately
    }
  }, [token]);

  // Login function to store token and user
  const login = async (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user); 
  };

  // Logout function to clear token and user data
  const logout = () => {
    localStorage.clear();
    localStorage.removeItem('token');
    sessionStorage.removeItem('hasReloaded');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    // You can return a loading spinner here or a blank screen until user details are loaded
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
