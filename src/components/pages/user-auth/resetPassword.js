
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../../include/footer';
import SearchModel from '../../include/searchModel';
import { Helmet } from 'react-helmet';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    try {
      await axios.post('https://api.indiafoodshop.com/api/auth/v1/reset-password', {
        email: state.email,
        newPassword,
        token: state.token,
      });
      sessionStorage.removeItem('resetEmail');
      toast.success('Password updated successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
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

      <SearchModel />

      {/* <!-- Single Page Header start --> */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Reset Password</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active text-white">Reset Password</li>
        </ol>
      </div>
      <div className="container" style={{ minHeight: '100vh', display: 'flex' }}>
        <div className="row w-100 justify-content-center">
          <div className="col-md-6 col-lg-4 mt-4">
            <div className="card shadow border-0" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-2">Reset Your Password</h3>
                  <p className="text-muted">Enter your new password below.</p>
                </div>

                <form onSubmit={handleReset}>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger text-center py-2" role="alert">
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-success w-100 py-3" style={{ borderRadius: '12px' }}>
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>

  );
};

export default ResetPassword;
