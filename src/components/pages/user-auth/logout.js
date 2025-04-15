import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const Logout = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (user) {
        navigate('/login');
    }

    logout();
    // Redirect to the login page after logout
    navigate('/login');
  }, [logout, navigate]);

  return null; // No need to render anything for the logout page
};

export default Logout;
