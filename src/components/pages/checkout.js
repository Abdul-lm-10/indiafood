import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import SearchModel from '../include/searchModel';
import Spinner from '../include/spinner';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [orderId, setOrderId] = useState('');
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

    const handleInputChange = (e) => {
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

    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }
        if (!user || !user._id) {
            setCouponError('Please login to apply coupon');
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
                setCouponDiscount(0);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error validating coupon';
            setCouponError(errorMessage);
            setCouponDiscount(0);
        }
    };

    const orderPayload = {
        user_id: user._id,
        location: formData.address + ", " + formData.townCity + ", " + formData.country,
        items: cart.map(item => ({
          cart_id: item._id,
          product_id: item.product_id._id,
          category_id: item.product_id.category_id, 
          product_name: item.product_id.name,
          quantity: item.quantity,
          price: item.price,
          pieces: item.pieces || 0
        }))
      };
      
    const handlePlaceOrder = async () => {
        if (!user) {
            alert('Please log in to place order.');
            return;
        }
    
        try {
    
            const { data } = await axios.post('https://api.indiafoodshop.com/admin/create-razorpay-order', {
                amount: total ,
                currency: 'INR',
                user_id: user._id,
                order_id: orderId ,
            });
    
            const razorpayOrder = data;
    
            const options = {
                key: 'rzp_test_T7RYplU5wIDWYV', 
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'India Food Shop',
                description: 'Order Payment',
                image: '/logo.png',
                order_id: razorpayOrder.order_id, 
                handler: async function (response) {
                  console.log('Razorpay payment response:', response);
              
                  if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                    alert('Incomplete payment response from Razorpay.');
                    return;
                  }
              
                  try {
                    const verificationResponse = await axios.post(
                      'https://api.indiafoodshop.com/admin/verify-payment',
                      {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        user_id: user._id,
                        coupon_code: couponCode || null,
                        order_data: orderPayload
                      }
                    );
              
                    if (verificationResponse.data.success) {
                      navigate('/order');
                    } else {
                      alert('Payment verification failed. Please contact support.');
                    }
                  } catch (err) {
                    console.error('Verification error:', err);
                    alert('An error occurred while verifying payment.');
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
            console.error('Payment initiation failed:', err);
            alert('An error occurred. Please try again.');
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
                            <h2 className="mb-4 pb-3 border-bottom"><i className="fas fa-map-marker-alt me-2 text-primary"></i> Delivery Location</h2>
                            
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-bold">Town/City*</label>
                                    <input
                                        type="text"
                                        className="form-control py-2"
                                        name="townCity"
                                        value={formData.townCity}
                                        onChange={handleInputChange}
                                        required
                                        style={{borderRadius: "8px"}}
                                    />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-bold">Country*</label>
                                    <input
                                        type="text"
                                        className="form-control py-2"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                        style={{borderRadius: "8px"}}
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label fw-bold">Delivery Instructions</label>
                                <textarea
                                    className="form-control py-2"
                                    rows="3"
                                    placeholder="Any special delivery instructions?"
                                    style={{borderRadius: "8px"}}
                                ></textarea>
                            </div>
                        </div>
                    </div>
    
                    {/* Order Summary */}
                    <div className="col-lg-5">
                        <div className="bg-light p-4 rounded shadow-sm sticky-top" style={{top: "20px"}}>
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
                                                            src={`https://api.indiafoodshop.com${item.product_id.image}`}
                                                            alt={item.product_id.name}
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
                                                            <h6 className="mb-0">{item.product_id.name}</h6>
                                                            <small className="text-muted">{item.quantity} × ₹{item.price}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-bold">₹{item.price * item.pieces}</td>
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
                                        style={{borderRadius: "8px"}}
                                    />
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary text-white py-2 px-3"
                                        style={{borderRadius: "8px"}}
                                    >
                                        Apply
                                    </button>
                                </form>
                                {couponError && <div className="text-danger mt-2">{couponError}</div>}
                                {couponDiscount > 0 && (
                                    <div className="text-success mt-2">
                                        <i className="fas fa-check-circle me-1"></i> Coupon applied! You saved ₹{discountAmount}
                                    </div>
                                )}
                            </div>
    
                            {/* Order Total */}
                            <div className="p-3 bg-white rounded mb-4">
                                <h5 className="mb-3"><i className="fas fa-calculator me-2 text-primary"></i> Order Summary</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="d-flex justify-content-between mb-2 text-success">
                                        <span>Coupon Discount:</span>
                                        <span>-₹{discountAmount}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between mb-3 pt-2 border-top">
                                    <span className="fw-bold">Total:</span>
                                    <span className="fw-bold text-primary">₹{total}</span>
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
                                    style={{maxWidth: "250px", opacity: 0.7}}
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