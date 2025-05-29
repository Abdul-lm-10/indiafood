import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useCountry } from "../../context/CountryContext";
import { useNavigate } from 'react-router-dom';
import SearchModel from '../include/searchModel';
import Spinner from '../include/spinner';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import defultImage from "../../external-assets/img/ifs-logo-3.png"
import { toast } from 'react-toastify';
import { use } from 'react';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const { currencySymbol, countryCode } = useCountry();
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [error, setError] = useState(-1);
    const [errorMsg, setErrorMsg] = useState('');
    const [orderId, setOrderId] = useState('');
    const [createAccount, setCreateAccount] = useState(true);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const { login } = useAuth();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [addressList, setAddressList] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    //Login 
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    });

    //Success Modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successOrderId, setSuccessOrderId] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        address: '',
        townCity: '',
        country: '',
        postcode: '',
        mobile: '',
        email: '',
        createAccount: false,
        differentAddress: false,
        orderNotes: ''
    });

    const [signupData, setSignupData] = useState({
        password: ''
    });

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "mobile") {
            const digitsOnly = value.replace(/[^\d]/g, '');

            // Remove country code prefix if already present
            const raw = digitsOnly.startsWith(countryCode.replace('+', ''))
                ? digitsOnly.slice(countryCode.length - 1)
                : digitsOnly;

            // If user deletes everything, still show country code
            const formatted = `${countryCode} ${raw}`;

            setFormData(prev => ({
                ...prev,
                mobile: formatted.trim()
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };



    useEffect(() => {
        if (user) {
            fetchAddresses(user?._id);
        } else {
            setFormData(prev => ({
                ...prev,
                differentAddress: true,
                createAccount: true
            }));
        }
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (user) {
            const cleanNumber = user.phone_number?.replace(/^\+\d+\s*|[^\d]/g, '') || '';
            const userData = {
                firstName: user.name || '',
                email: user.email || '',
                mobile: cleanNumber ? `${countryCode} ${cleanNumber}` : '',
                address: user.address || '',
                townCity: user.city || '',
                state: user.state || '',
                country: user.country || '',
                postcode: user.zip_code || ''
            };

            setFormData(prev => ({
                ...prev,
                ...userData
            }));

        }
    }, [user?.id]);

    const fetchAddresses = async (userId) => {
        try {
            const res = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/delivery-address`, {
                params: { userId }
            });

            const addresses = res.data.addresses || [];
            setAddressList(addresses);

            // Find the default address
            const defaultAddr = addresses.find(addr => addr.isDefault);

            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id);
            } else if (addresses.length > 0) {
                setSelectedAddressId(addresses[0]._id);
            }

        } catch (err) {
            console.error("Error fetching addresses:", err);
        }
    };

    const handleAddAddress = async (userId) => {

        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/delivery-address', {
                ...deliveryPayload, userId: userId || user._id
            });

            const savedAddress = res.data.address;

            setAddressList(prev => [...prev, savedAddress]);
            setSelectedAddressId(savedAddress._id);
        } catch (err) {
            console.error("Failed to add address:", err);
        }
    };

    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }
        if (!user || !user._id) {
            toast.error('Please login to apply coupon');
            return;
        }
        try {
            const validateResponse = await axios.post('https://api.indiafoodshop.com/admin/verify-coupon', {
                coupon_code: couponCode.trim(),
                user_id: user._id,
                order_id: orderId || user._id
            });
            if (validateResponse.data && validateResponse.data.data) {
                const couponData = validateResponse.data.data;
                setCouponDiscount(couponData.discount_percentage);
                setCouponError('');
            } else {
                setCouponError(validateResponse.data.message || 'Invalid coupon code');
                toast.error(validateResponse.data.message || 'Invalid coupon code');
                setCouponDiscount(0);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error validating coupon';
            setCouponError(errorMessage);
            toast.error(errorMessage);
            setCouponDiscount(0);
        }
    };

    const shipping_charge = cart.reduce((total, item) => { return total + Number(item.shipping_charge || 0); }, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.pieces) + Number(item.shipping_charge || 0), 0);
    const discountAmount = (subtotal * couponDiscount) / 100;
    const total = subtotal - discountAmount;
    const selectedDeliveryAddress = addressList.find(addr => addr._id === selectedAddressId);

    const deliveryPayload = {
        address: formData.address,
        city: formData.townCity,
        state: formData.state,
        country: formData.country,
        zip_code: formData.postcode,
        isDefault: false
    }

    const orderPayload = {
        user_id: user ? user._id : null,
        location: !formData.differentAddress ? selectedDeliveryAddress?.address : formData.address,
        name: formData.firstName || user?.name,
        city: !formData.differentAddress ? selectedDeliveryAddress?.city : formData.townCity,
        state: !formData.differentAddress ? selectedDeliveryAddress?.state : formData.state,
        country: !formData.differentAddress ? selectedDeliveryAddress?.country : formData.country,
        zip_code: !formData.differentAddress ? selectedDeliveryAddress?.zip_code : formData.postcode,
        email: formData.email || user?.email,
        amount: total,
        notes: formData.orderNotes || '',
        phone_number: formData.mobile || user?.phone_number,
        items: cart.map(item => ({
            cart_id: item._id || item.product_id,
            product_id: user ? item.product_id._id : item.product_id,
            category_id: user
                ? item.product_id.category_id
                : item.product_details?.category_id,
            product_name: user
                ? item.product_id?.name || ""
                : item.product_details?.name || "",
            quantity: item.quantity,
            price: item.price,
            shipping_charge: item.shipping_charge || 0,
            pieces: item.pieces || 0
        }))
    };

    const handlePlaceOrder = async () => {
        if (!formData.firstName || !formData.mobile || !formData.email) {
            toast.error('Please fill in all required fields.');
            return;
        }

        if (!otpVerified && !user) {
            toast.error('Please verify your OTP or login to continue.');
            return;
        }

        if (formData.differentAddress) {
            handleAddAddress(user?._id);
        }
        try {
            let userIdToSend = user ? user._id : null;

            if (!userIdToSend) {
                const ObjectId = (ts = (new Date().getTime() / 1000 | 0).toString(16)) =>
                    ts + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
                        (Math.random() * 16 | 0).toString(16)).toLowerCase();

                userIdToSend = ObjectId();
            }

            const { data } = await axios.post('https://api.indiafoodshop.com/admin/create-razorpay-order', {
                amount: total,
                currency: 'INR',
                user_id: user ? user._id : userIdToSend,
                order_id: orderId,
            });

            const razorpayOrder = data;

            const options = {
                key: 'rzp_live_a6EOFHg69KPq0Y',
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'India Food Shop',
                description: 'Order Payment',
                image: defultImage,
                order_id: razorpayOrder.order_id,
                handler: async function (response) {

                    if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                        toast.error('Incomplete payment response from Razorpay.');
                        return;
                    }

                    try {
                        const verificationResponse = await axios.post(
                            'https://api.indiafoodshop.com/admin/verify-payment',
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                user_id: user ? user._id : userIdToSend,
                                coupon_code: couponCode || null,
                                order_data: orderPayload
                            }
                        );

                        if (verificationResponse.data.success) {
                            toast.success('Payment successful! Your order has been placed.');
                            setSuccessOrderId(response.razorpay_order_id);
                            setShowSuccessModal(true);
                            clearCart()

                            // setTimeout(() => {
                            //     navigate('/order');
                            // }, 6000);
                        } else {
                            toast.error('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        toast.error('An error occurred while verifying payment.');
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.mobile.replace(/[^\d]/g, '').slice(-10)
                },
                notes: {
                    address: formData.address
                },
                theme: {
                    color: '#539A40'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            toast.error('Payment initiation failed:', err);
            alert('An error occurred. Please try again.');
        }
    };

    // Function to handle Signup
    const handleSignupBeforeCheckout = async () => {
        if (!signupData.password) {
            // toast.error("Password is required to create an account");
            setErrorMsg("Password is required to create an account");
            setError(1);
            return;
        }

        if (signupData.password !== confirmPassword) {
            //toast.error("Passwords do not match");
            setErrorMsg("Passwords do not match");
            setError(1);
            return;
        }

        const signupPayload = {
            name: formData.firstName,
            email: formData.email,
            phone_number: formData.mobile,
            password: signupData.password,
            date_time: new Date().toISOString(),
        };

        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/signup', signupPayload);
            toast.success("OTP sent to your email");
            setOtpSent(true);
            setError(-1)
            setErrorMsg('');
            setCreateAccount(false);
        } catch (err) {
            if (err.response.data.message && err.response.data.message != '') {
                setError(1);
                toast.error(err.response?.data?.message || "Signup failed");
                setErrorMsg(err.response.data.message);
                toast.error(err);
            } else {
                setError(1);
                setErrorMsg("Something Went Wrong");
            }
        }
    };

    // Function to handle OTP
    const handleVerifyOtp = async () => {
        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/verify-otp', {
                email: formData.email,
                otp: otp
            });
            await handleAddAddress(res.data.user._id);
            toast.success("OTP verified successfully");
            login(res.data.token, res.data.user);
            window.location.reload();
        } catch (err) {
            setError(1);
            setErrorMsg(err.response.data.message);
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };


    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/login', loginFormData);
            console.log(res);
            setError(-1)
            setErrorMsg('');
            toast.success("Login Successful");
            login(res.data.token, res.data.user);
            setShowLoginModal(false);
            window.location.reload();
        } catch (err) {
            if (err.response.data.message && err.response.data.message != '') {
                setError(1);
                setErrorMsg(err.response.data.message);
                toast.error(err);
            } else {
                setError(1);
                setErrorMsg("Something Went Wrong");
            }
        }
    };


    const handleResend = async () => {
        try {
            await axios.post('https://api.indiafoodshop.com/api/auth/v1/resend-otp', {
                email: formData.email
            });
            toast.success('OTP resent successfully');
        } catch (err) {
            setError('Failed to resend OTP');
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <>
            <Helmet>
                <title>Checkout - India Food Shop</title>
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            </Helmet>

            {loading && <Spinner />}
            <SearchModel />
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Checkout</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item"><a href="#">Pages</a></li>
                    <li className="breadcrumb-item active text-white">Checkout</li>
                </ol>
            </div>
            {/* Page Header End */}

            {/* Checkout Page Start */}
            <div className="container py-5">
                <div className="row g-5">
                    {/* Billing Details */}
                    <div className="col-lg-7">
                        <div className="bg-light p-4 rounded shadow-sm">
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                                <h2 className="mb-0">
                                    <i className="fas fa-user me-2 text-primary"></i>Delivery Information
                                </h2>
                                {!user && (
                                    <button
                                        className="btn btn-link text-decoration-underline"
                                        onClick={() => setShowLoginModal(true)}
                                    >
                                        Login Account
                                    </button>
                                )}
                            </div>

                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <label className="form-label fw-bold">Full Name<span className='text-danger'>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control py-2"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: "8px" }}
                                    />
                                </div>



                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-bold">Mobile<span className='text-danger'>*</span></label>
                                    <input
                                        type="tel"
                                        className="form-control py-2"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        required
                                        maxLength={16}
                                        style={{ borderRadius: "8px" }}
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-bold">Email<span className='text-danger'>*</span></label>
                                    <input
                                        type="email"
                                        className="form-control py-2"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: "8px" }}
                                    />
                                </div>

                            </div>

                            {/* Shipping Information Section */}
                            <h2 className="mb-4 pb-3 border-bottom mt-4">
                                <i className="fas fa-map-marker-alt me-2 text-primary"></i>Shipping Information
                            </h2>

                            {/* Display user's saved address as a card */}
                            {user && addressList.length > 0 && (
                                <div className="mb-4">
                                    {addressList.map((addr) => {
                                        const isSelected = selectedAddressId === addr._id;
                                        return (
                                            <div
                                                key={addr._id}
                                                className={`card p-0 overflow-hidden mb-3 ${isSelected ? 'selected-address' : ''}`}
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #e5e7eb',
                                                    backgroundColor: '#ffffff',
                                                    transition: 'all 0.2s ease',
                                                    position: 'relative',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                                                }}
                                            >
                                                {isSelected && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        width: '4px',
                                                        backgroundColor: '#16a34a'
                                                    }} />
                                                )}

                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div style={{ flex: 1 }}>
                                                            <div className="d-flex align-items-center mb-3">
                                                                <div style={{
                                                                    backgroundColor: isSelected ? '#dcfce7' : '#f3f4f6',
                                                                    width: '44px',
                                                                    height: '44px',
                                                                    borderRadius: '10px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    marginRight: '14px'
                                                                }}>
                                                                    <i className={`fas fa-home ${isSelected ? 'text-green-600' : 'text-gray-500'}`} style={{ fontSize: '1.2rem' }}></i>
                                                                </div>

                                                                <div>
                                                                    <h6 style={{
                                                                        margin: 0,
                                                                        color: isSelected ? '#16a34a' : '#1f2937',
                                                                        fontWeight: 600,
                                                                        fontSize: '1.05rem'
                                                                    }}>
                                                                        {isSelected ? 'Selected Address' : 'Your Address'}
                                                                    </h6>
                                                                    <div style={{
                                                                        fontSize: '0.78rem',
                                                                        color: isSelected ? '#22c55e' : '#6b7280',
                                                                        fontWeight: 500,
                                                                        marginTop: '2px'
                                                                    }}>
                                                                        {isSelected ? 'Currently in use' : 'Not selected'}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div style={{ marginLeft: '58px' }}>
                                                                <div className="address-detail">
                                                                    <i className={`fas fa-map-marker-alt ${isSelected ? 'text-green-500' : 'text-gray-400'} me-2`} />
                                                                    <span>{addr.address}</span>
                                                                </div>
                                                                <div className="address-detail">
                                                                    <i className={`fas fa-city ${isSelected ? 'text-green-500' : 'text-gray-400'} me-2`} />
                                                                    <span>{addr.city}, {addr.state}</span>
                                                                </div>
                                                                <div className="address-detail">
                                                                    <i className={`fas fa-globe ${isSelected ? 'text-green-500' : 'text-gray-400'} me-2`} />
                                                                    <span>{addr.country} - {addr.zip_code}</span>
                                                                </div>
                                                                {/* <div className="address-detail">
                                                                    <i className={`fas fa-phone ${isSelected ? 'text-green-500' : 'text-gray-400'} me-2`} />
                                                                    <span>{addr.phone_number}</span>
                                                                </div> */}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            {!isSelected ? (
                                                                <button
                                                                    className="btn btn-sm"
                                                                    onClick={() => setSelectedAddressId(addr._id)}
                                                                    style={{
                                                                        backgroundColor: '#16a34a',
                                                                        color: 'white',
                                                                        borderRadius: '8px',
                                                                        padding: '7px 14px',
                                                                        fontSize: '0.82rem',
                                                                        fontWeight: 500,
                                                                        border: 'none',
                                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                >
                                                                    <i className="fas fa-check-circle me-1"></i>
                                                                    Use This
                                                                </button>
                                                            ) : (
                                                                <div style={{
                                                                    backgroundColor: '#dcfce7',
                                                                    color: '#16a34a',
                                                                    borderRadius: '50%',
                                                                    width: '36px',
                                                                    height: '36px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                }}>
                                                                    <i className="fas fa-check" style={{ fontSize: '0.9rem' }} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {user && (
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="differentAddress"

                                        checked={formData.differentAddress}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            differentAddress: !prev.differentAddress
                                        }))}
                                    />
                                    <label className="form-check-label" htmlFor="differentAddress">
                                        Ship to a different address
                                    </label>
                                </div>
                            )}
                            {formData.differentAddress && (
                                <div className="row">
                                    <div className="col-md-12 mb-4">

                                        <label className="form-label fw-bold">Shipping Address<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: "8px" }}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold">Town/City<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            name="townCity"
                                            value={formData.townCity}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: "8px" }}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold">State<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: "8px" }}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold">Country<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: "8px" }}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold">Postcode<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            name="postcode"
                                            value={formData.postcode}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: "8px" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Account creation section for guest users */}
                            {!user && (
                                <>
                                    <label className="form-label fw-bold mb-4" htmlFor="createAccountCheckbox">
                                        <i className="fas fa-user-plus me-1 text-primary"></i>
                                        Create account (Set password for you)
                                    </label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input d-none"
                                        disabled={otpSent}

                                        id="createAccountCheckbox"
                                    />

                                    {createAccount && (

                                        <div className='row'>
                                            {
                                                error == 1 ?
                                                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                        <strong>Error!</strong> {errorMsg}
                                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-bold">Password<span className='text-danger'>*</span></label>
                                                <input
                                                    className="form-control py-2"
                                                    type="password"
                                                    placeholder="Password"
                                                    value={signupData.password}
                                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-bold">Confirm Password<span className='text-danger'>*</span></label>
                                                <input
                                                    className="form-control py-2"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-4">
                                                <button type="button"
                                                    className="btn btn-primary text-white py-2 px-3 "
                                                    style={{ borderRadius: "8px" }}
                                                    onClick={handleSignupBeforeCheckout}>
                                                    Send OTP
                                                </button>
                                            </div>


                                        </div>
                                    )}
                                </>
                            )}

                            {otpSent && !otpVerified && (
                                <div className="row">
                                    <div className="alert alert-info d-flex align-items-center" role="alert">
                                        <i className="bi bi-info-circle-fill me-2"></i>
                                        OTP has been sent to your {formData.email}.
                                    </div>
                                    {
                                        error == 1 ?
                                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                <strong>Error!</strong> {errorMsg}
                                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>
                                            :
                                            ''
                                    }
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold">
                                            OTP <span className='text-danger'>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />

                                        {/* Button group for Verify and Resend */}
                                        <div className="d-flex gap-3 mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-primary text-white py-2 px-3"
                                                style={{ borderRadius: "8px" }}
                                                onClick={handleVerifyOtp}
                                            >
                                                Verify OTP
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary py-2 px-3"
                                                style={{ borderRadius: "8px" }}
                                                onClick={handleResend}
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label fw-bold">Order Notes</label>
                                <textarea
                                    className="form-control py-2"
                                    rows="3"
                                    name="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                    placeholder="Any special delivery instructions?"
                                    style={{ borderRadius: "8px" }}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-5">
                        <div className="bg-light p-4 rounded shadow-sm sticky-top" style={{ top: "20px" }}>
                            <h2 className="mb-4 pb-3 border-bottom"><i className="fas fa-receipt me-2 text-primary"></i> Your Order</h2>

                            <div className="table-responsive mb-4">
                                <table className="table">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Product</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={
                                                                item.product_details?.image
                                                                    ? `https://api.indiafoodshop.com${item.product_details?.image}`
                                                                    : `https://api.indiafoodshop.com${item.product_id?.image}`
                                                            } alt={item.product_id.name}
                                                            style={{
                                                                width: '60px',
                                                                height: '60px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                marginRight: '15px'
                                                            }}
                                                            className="img-fluid"
                                                        />
                                                        <div>
                                                            <h6 className="mb-0">{item.product_details?.name || item.product_id?.name}</h6>
                                                            <small className="text-muted">{item.quantity} × {currencySymbol}{item.price}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-bold">{currencySymbol}{(item.price * item.pieces).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Coupon Section */}
                            <div className="p-3 mb-4 bg-white rounded">
                                <h5 className="mb-3"><i className="fas fa-tag me-2 text-primary"></i> Apply Coupon</h5>
                                <form onSubmit={handleCouponSubmit} className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control py-2"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        style={{ borderRadius: "8px" }}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary text-white py-2 px-3"
                                        style={{ borderRadius: "8px" }}
                                    >
                                        Apply
                                    </button>
                                </form>
                                {couponError && <div className="text-danger mt-2">{couponError}</div>}
                                {couponDiscount > 0 && (
                                    <div className="text-success mt-2">
                                        <i className="fas fa-check-circle me-1"></i> Coupon applied! You saved {currencySymbol}{discountAmount.toFixed(2)} ({couponDiscount}% off)
                                    </div>
                                )}

                            </div>

                            {/* Order Total */}
                            <div className="p-3 bg-white rounded mb-4">
                                <h5 className="mb-3"><i className="fas fa-calculator me-2 text-primary"></i> Order Summary</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>{currencySymbol}{(subtotal).toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span>{currencySymbol}{shipping_charge}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="d-flex justify-content-between mb-2 text-success">
                                        <span>Coupon Discount:</span>
                                        <span>-{currencySymbol}{(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between mb-3 pt-2 border-top">
                                    <span className="fw-bold">Total:</span>
                                    <span className="fw-bold text-primary">{currencySymbol}{(total).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <button
                                className="btn btn-primary w-100 py-3 fw-bold text-white"
                                onClick={handlePlaceOrder}
                                style={{
                                    borderRadius: "8px",
                                    fontSize: "1.1rem",
                                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                                    transition: "all 0.3s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                <i className="fas fa-lock me-2"></i> Place Order Securely
                            </button>

                            <div className="text-center mt-3">
                                <img
                                    src="/external-assets/img/payment.png"
                                    alt="Payment Methods"
                                    className="img-fluid"
                                    style={{ maxWidth: "250px", opacity: 0.7 }}
                                />
                                <p className="text-muted small mt-2">Your personal data will be used to process your order and support your experience throughout this website.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Checkout Page End */}

            {/* Bootstrap Modal */}
            <div
                className={`modal fade ${showLoginModal ? 'show' : ''}`}
                style={{
                    display: showLoginModal ? 'block' : 'none',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1050
                }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Login to Continue</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowLoginModal(false)}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {error === 1 && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <strong>Error!</strong> {errorMsg}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setError(-1)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                            )}
                            <form onSubmit={handleLoginSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={loginFormData.email}
                                        onChange={handleLoginInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={loginFormData.password}
                                        onChange={handleLoginInputChange}
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="/forgot-password">Forgot password?</a>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 text-white"
                                    style={{ borderRadius: "8px", padding: "10px" }}
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {showSuccessModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                            <div className="modal-body p-5 text-center">
                                <div className="mb-4">
                                    <div className="bg-success bg-opacity-10 d-inline-flex p-3 rounded-circle">
                                        <i className="fas fa-check-circle text-white" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-3">Order Placed Successfully!</h3>
                                <p className="text-muted mb-4">
                                    Your order ID: <span className="fw-bold text-dark">{successOrderId}</span>
                                </p>
                                <p className="mb-4">
                                    We've sent the confirmation to your email. Thank you for shopping with us!
                                </p>
                                <button
                                    className="btn btn-success px-4 py-2 fw-bold"
                                    style={{ minWidth: '150px' }}
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigate('/order');
                                    }}
                                >
                                    View Orders <i className="fas fa-arrow-right ms-2"></i>
                                </button>
                            </div>

                            {/* Decorative elements */}
                            <div className="position-absolute top-0 end-0 m-3">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigate('/order');
                                    }}
                                ></button>
                            </div>
                            <div className="position-absolute bottom-0 start-0 w-100 bg-success bg-opacity-10" style={{ height: '8px' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Checkout;