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
import { isEqual } from 'lodash';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const { currencySymbol } = useCountry();
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [orderId, setOrderId] = useState('');
    const [createAccount, setCreateAccount] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const { login } = useAuth();
    const [confirmPassword, setConfirmPassword] = useState('');

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

    const handleInputChange = (e) => {
        console.log('Changing:', e.target.name, e.target.value); // Debug log
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
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
        const userData = {
            firstName: user.name || '',
            email: user.email || '',
            mobile: user.phone_number || '',
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


    const orderPayload = {
        user_id: user ? user._id : null,
        location: formData.address,
        name: formData.firstName,
        city: formData.townCity,
        state: formData.state,
        country: formData.country,
        zip_code: formData.postcode,
        email: formData.email,
        phone_number: formData.mobile,
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
            pieces: item.pieces || 0
        }))
    };

    const handlePlaceOrder = async () => {
        if (!formData.firstName || !formData.mobile || !formData.email || !formData.address ||
            !formData.townCity || !formData.country || !formData.postcode || !formData.state) {
            toast.error('Please fill in all required fields.');
            return;
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
                key: 'rzp_test_T7RYplU5wIDWYV',
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'India Food Shop',
                description: 'Order Payment',
                image: defultImage,
                order_id: razorpayOrder.order_id,
                handler: async function (response) {
                    console.log('Razorpay payment response:', response);

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
                            clearCart()
                            setTimeout(() => {
                                navigate('/order');
                            }, 6000);
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
                    contact: formData.mobile
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
            toast.error("Password is required to create an account");
            return;
        }

        if (signupData.password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const signupPayload = {
            name: formData.firstName,
            email: formData.email,
            phone_number: formData.mobile,
            password: signupData.password,
            country: formData.country,
            address: formData.address,
            city: formData.townCity,
            state: formData.state,
            zip_code: formData.postcode,
            date_time: new Date().toISOString(),
        };

        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/signup', signupPayload);
            toast.success("OTP sent to your email");
            setOtpSent(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };


    // Function to handle OTP
    const handleVerifyOtp = async () => {
        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/verify-otp', {
                email: formData.email,
                otp: otp
            });
            toast.success("OTP verified successfully");
            login(res.data.token, res.data.user);
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };


    const subtotal = cart.reduce((total, item) => total + (item.price * item.pieces), 0);
    const discountAmount = (subtotal * couponDiscount) / 100;
    const total = subtotal - discountAmount;

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

            {/* Page Header Start */}
            <div className="container-fluid page-header mb-5 position-relative" style={{
                background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/external-assets/img/cart-page-header-img.png') center/cover no-repeat",
                minHeight: "300px",
                display: "flex",
                alignItems: "center"
            }}>

                <div className="container text-center">
                    <h1 className="display-3 mb-3 text-white animated fadeInDown">Checkout</h1>
                    <nav aria-label="breadcrumb" className="animated fadeInDown">
                        <ol className="breadcrumb justify-content-center text-uppercase mb-0">
                            <li className="breadcrumb-item"><a className="text-white" href="/">Home</a></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Checkout</li>
                        </ol>
                    </nav>
                </div>
            </div>
            {/* Page Header End */}

            {/* Checkout Page Start */}
            <div className="container py-5">
                <div className="row g-5">
                    {/* Billing Details */}
                    <div className="col-lg-7">
                        <div className="bg-light p-4 rounded shadow-sm">
                            <h2 className="mb-4 pb-3 border-bottom"><i className="fas fa-map-marker-alt me-2 text-primary"></i>Shipping Information</h2>

                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-bold">Name<span className='text-danger'>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control py-2"
                                        name="firstName"
                                        value={formData.firstName || ''}
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
                                        style={{ borderRadius: "8px" }}
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-bold">Email
                                        <span className='text-danger'>*</span>
                                    </label>
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


                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-bold">Address<span className='text-danger'>*</span></label>
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
                                        style={{ borderRadius: "8px" }}
                                    />
                                </div>

                                {!user && (
                                    <div className="form-check mb-4">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={createAccount}
                                            onChange={(e) => setCreateAccount(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="createAccount">
                                            Create an account with this information
                                        </label>
                                    </div>
                                )}
                                {createAccount && (
                                    <>
                                        {createAccount && (
                                            <div className='row'>
                                                <div className="col-md-6 mb-4" >
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
                                                        style={{ borderRadius: "8px", }} onClick={handleSignupBeforeCheckout}>Send OTP</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {otpSent && !otpVerified && (
                                    <>
                                        <div className="col-md-6 mb-4" >
                                            <label className="form-label fw-bold">OTP<span className='text-danger'>*</span></label>

                                            <input
                                                type="text"
                                                className="form-control py-2"
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                            <button type="button"
                                                className="btn btn-primary text-white py-2 px-3 "
                                                style={{ borderRadius: "8px", marginTop: "13px" }}
                                                onClick={handleVerifyOtp}>Verify OTP</button>
                                        </div>
                                    </>

                                )}


                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="differentAddress"
                                        checked={formData.differentAddress}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label">Ship to a different address?</label>
                                </div>

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
                                {couponDiscount > 0 && (
                                    <div className="d-flex justify-content-between mb-2 text-success">
                                        <span>Coupon Discount:</span>
                                        <span>-{currencySymbol}{discountAmount}</span>
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
        </>
    );
};

export default Checkout;