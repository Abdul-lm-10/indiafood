import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const refs = [useRef(), useRef(), useRef(), useRef()];

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

        if (value && index < 3) {
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
        const pastedData = e.clipboardData.getData('text');
        const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 4).split('');

        if (pastedNumbers.length) {
            const newOtp = [...otp];
            pastedNumbers.forEach((num, index) => {
                if (index < 4) newOtp[index] = num;
            });
            setOtp(newOtp);
            setError('');

            const nextEmptyIndex = newOtp.findIndex(val => !val);
            if (nextEmptyIndex !== -1) {
                refs[nextEmptyIndex].current.focus();
            } else {
                refs[3].current.focus();
            }
        }
    };

    const handleResend = () => {
        setTimer(30);
        setCanResend(false);
        setError('');
        setOtp(['', '', '', '']);
        refs[0].current.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            setError('Please enter all 4 digits');
            return;
        }
        console.log('OTP submitted:', otpString);
    };

    return (
        <>
            <Helmet>
                <title>OTP Verification - India Food Shop</title>
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>

            <div class="container-fluid page-header py-5">
                <h1 class="text-center text-white display-6">OTP</h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><Link to={'/'}>Home</Link></li>
                    <li class="breadcrumb-item active text-white">OTP</li>
                </ol>
            </div>

            <div
                className="container"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                }}
            >
                <div className="row w-100 justify-content-center">
                    <div className="col-md-6 col-lg-4 mt-4">
                        <div className="card shadow border-0" style={{ borderRadius: '20px' }}>
                            <div className="card-body p-5">
                                <div className="text-center mb-5">
                                    <h3 className="fw-bold mb-3">Verify Your Email</h3>
                                    <p className="text-muted">
                                        Please enter the 4-digit verification code<br />
                                        sent to your email
                                    </p>
                                </div>


                                <form onSubmit={handleSubmit}>
                                    <div className="d-flex justify-content-center gap-3 mb-4">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={refs[index]}
                                                type="text"
                                                className="form-control text-center fw-bold fs-4"
                                                style={{
                                                    width: '65px',
                                                    height: '65px',
                                                    borderRadius: '15px',
                                                    backgroundColor: '#f8f9fa',
                                                    border: error ? '1px solid #dc3545' : '1px solid #dee2e6',
                                                    fontSize: '24px'
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
                                        disabled={otp.join('').length !== 4}
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