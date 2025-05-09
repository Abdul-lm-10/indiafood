import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from "../../../context/AuthContext";

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const ref4 = useRef();
    const ref5 = useRef();
    const ref6 = useRef();
    const refs = [ref1, ref2, ref3, ref4, ref5, ref6];

    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const { userId, email } = location.state || {};

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
        if (value.length > 1) value = value[0];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
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
        const pastedNumbers = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');

        if (pastedNumbers.length) {
            const newOtp = [...otp];
            pastedNumbers.forEach((num, index) => {
                if (index < 6) newOtp[index] = num;
            });
            setOtp(newOtp);
            setError('');

            const nextEmpty = newOtp.findIndex(val => !val);
            refs[nextEmpty !== -1 ? nextEmpty : 5].current.focus();
        }
    };

    const handleResend = async () => {
        const otpString = otp.join('');
        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/verify-otp', {
                email,
                otp: otpString
            }); setTimer(30);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            toast.success('OTP resent successfully');
            refs[0].current.focus();
        } catch (err) {
            setError('Failed to resend OTP');
            toast.error('Failed to resend OTP');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            toast.error('Please enter all 6 digits');
            return;
        }

        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/verify-otp', {
                email,
                otp: otpString
            });
            console.log(res.data);
            toast.success('OTP verified successfully');
            login(res.data.token, res.data.user);
            navigate('/dashboard/my-profile');
        } catch (err) {
            toast.error('Invalid OTP');
            setError(err.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <>
            <Helmet>
                <title>OTP Verification - India Food Shop</title>
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">OTP</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active text-white">OTP</li>
                </ol>
            </div>

            <div className="container" style={{ minHeight: '100vh', display: 'flex' }}>
                <div className="row w-100 justify-content-center">
                    <div className="col-md-6 col-lg-4 mt-4">
                        <div className="card shadow border-0" style={{ borderRadius: '20px' }}>
                            <div className="card-body p-5">
                                <div className="text-center mb-5">
                                    <h3 className="fw-bold mb-3">Verify Your Email</h3>
                                    <p className="text-muted">
                                        Please enter the 6-digit verification code<br />
                                        sent to your email
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit}>
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
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 mb-4"
                                        style={{ borderRadius: '12px' }}
                                        disabled={otp.join('').length !== 6}
                                    >
                                        Verify Code
                                    </button>

                                    <div className="text-center">
                                        <p className="text-muted mb-0">
                                            Didn't receive the code?
                                            <button
                                                type="button"
                                                className="btn btn-link text-decoration-none p-0 ms-2"
                                                onClick={handleResend}
                                                disabled={!canResend}
                                            >
                                                {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default OTP;