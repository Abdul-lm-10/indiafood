import React, { useState, useRef, useEffect, useLocation } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import SearchModel from '../../include/searchModel';
import Footer from '../../include/footer';

const VerifyResetOtp = () => {
  const [email, setEmail] = useState(sessionStorage.getItem('resetEmail') || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const refs = [ref1, ref2, ref3, ref4, ref5, ref6];


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const newOtp = [...otp];
    pasted.forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);

    const next = newOtp.findIndex((val) => !val);
    refs[next !== -1 ? next : 5].current.focus();
  };

  const handleResend = async () => {
    if (!email) return toast.error('Please enter your email first');
    try {
      await axios.post('https://api.indiafoodshop.com/api/auth/v1/forgot-password', { email });
      toast.success('OTP resent successfully');
      setOtp(['', '', '', '', '', '']);
      setTimer(30);
      setCanResend(false);
      refs[0].current.focus();
    } catch (err) {
      toast.error('Failed to resend OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (!email) return toast.error('Email is required');
    if (otpString.length !== 6) return toast.error('Enter all 6 digits');

    try {
      const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/verify-reset-otp', {
        email,
        otp: otpString,
      });
      toast.success('OTP verified');
      navigate('/reset-password', { state: { email, token: res.data.token } });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
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
          <li className="breadcrumb-item active text-white">Verify OTP</li>
        </ol>
      </div>

      <div className="container" style={{ minHeight: '100vh', display: 'flex' }}>
        <div className="row w-100 justify-content-center">
          <div className="col-md-6 col-lg-4 mt-4">
            <div className="card shadow border-0" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-3">Verify Your Email</h3>
                  <p className="text-muted">
                    Enter the 6-digit OTP sent to your email
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-center gap-2 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={refs[index]}
                        type="text"
                        className="form-control text-center fw-bold fs-4"
                        style={{
                          width: '50px',
                          height: '60px',
                          borderRadius: '10px',
                          backgroundColor: '#f8f9fa',
                          border: error ? '1px solid #dc3545' : '1px solid #dee2e6'
                        }}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        maxLength={1}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="alert alert-danger text-center py-2" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-100 py-3 mb-4 text-white"
                    type="submit"
                    style={{ borderRadius: '12px' }}
                    disabled={otp.join('').length !== 6}
                  >
                    Verify OTP
                  </button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Didn’t receive the code?
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none p-0 ms-2 "
                        onClick={handleResend}
                        disabled={!canResend}
                      >
                        {canResend ? 'Resend Code' : `Resend in ${formatTime(timer)}s`}
                      </button>
                    </p>
                  </div>
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

export default VerifyResetOtp;
