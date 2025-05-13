import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet"
import Spinner from "../../include/spinner"
import { useEffect, useState } from "react"
import SearchModel from "../../include/searchModel"
import { Link } from "react-router-dom"
import Footer from '../../include/footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
      useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false); 
        }, 100);
        return () => clearTimeout(timer);
      }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://api.indiafoodshop.com/api/auth/v1/forgot-password', { email });
      toast.success('OTP sent to your email');
      navigate('/verify-reset-otp', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
     <>
          <Helmet>
                <title>Login | India Food Shop</title>                
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>
                {
                    loading? <Spinner /> : ''
                }
           
            <SearchModel />
               
            {/* <!-- Single Page Header start --> */}
            <div class="container-fluid page-header py-5">
                <h1 class="text-center text-white display-6">Login</h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><Link to={'/'}>Home</Link></li>
                    {/* <li class="breadcrumb-item"><a href="#">Pages</a></li> */}
                    <li class="breadcrumb-item active text-white">Login</li>
                </ol>
            </div>
            {/* <!-- Single Page Header End --> */}
            
  <div className="d-flex justify-content-center align-items-center bg-light ">
  <div className="card shadow p-4 my-5" style={{ minWidth: '350px' }}>
    <h3 className="text-center mb-4">Forgot Password</h3>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="btn btn-primary w-100" type="submit">
        Send OTP
      </button>
    </form>
  </div>
</div>
 <Footer />
    </>
  );
};

export default ForgotPassword;
