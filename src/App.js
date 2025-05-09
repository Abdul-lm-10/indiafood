import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Home from './components/pages/home';
import Categories from './components/pages/category';
import ProductList from './components/pages/productsList';
import ProductDetails from './components/pages/productDetails';
import Cart from './components/pages/cart';
import Contact from './components/pages/contact';
import TermsAndConditions from './components/pages/termsAndConditions';
import PrivacyPolicy from './components/pages/privacyPolicy';
import NotFound from './components/pages/404';
import Checkout from './components/pages/checkout';
import useScrollRestoration from './components/include/scrollTop';
import AuthPage from './components/pages/user-auth/authPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import EditProfile from './components/pages/user-auth/dashboard/edit-profile';
import Logout from './components/pages/user-auth/logout';
import CategoryProductList from './components/pages/categoryProductList';
import { CartProvider } from './context/CartContext';
 
const ProtectedRoute = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {  

  return (
      <>
        <AuthProvider>
        <CartProvider>
          <Router>       
            <ScrollManager />   
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:id" element={<CategoryProductList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:slug" element={<ProductDetails />} />  
              <Route path="/cart" element={<Cart />} />   
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />   
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />  
              <Route path="/checkout" element={<Checkout />} />                     
              <Route path="/login" element={<AuthPage />} />  
              <Route
            path="/dashboard/my-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute> }/>   
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<NotFound />}/>                                                   
            </Routes>
          </Router>
          </CartProvider>
        </AuthProvider>
      </>
  );
}

const ScrollManager = () => {
  useScrollRestoration(); // This ensures that it's used inside the <Router> context
  return null; // It doesn't need to render anything, just manage the scroll behavior
};

export default App;
