import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import SearchModel from '../include/searchModel';
import Spinner from '../include/spinner';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const Checkout = () => {
    const { cart } = useCart();
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
                user_id: user._id
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

    const handlePlaceOrder = async () => {
        try {
            const orderResponse = await axios.post('https://api.indiafoodshop.com/admin/create-order', {
                user_id: user._id,
                items: cart,
                shipping_details: formData,
                subtotal,
                total
            });
            if (orderResponse.data && orderResponse.data.order_id && couponCode) {
                await axios.post('https://api.indiafoodshop.com/admin/verify-coupon', {
                    coupon_code: couponCode.trim(),
                    user_id: user._id,
                    order_id: orderResponse.data.order_id
                });
            }
            navigate('/order');
        } catch (error) {
            console.error('Order creation failed:', error);
        }
    };
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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
            </Helmet>

            {loading && <Spinner />}
            <SearchModel />

            {/* Page Header Start */}
            <div className="container-fluid page-header mb-5">
                <div className="container">
                    <h1 className="display-3 mb-3 animated slideInDown text-white">Checkout</h1>
                    <nav aria-label="breadcrumb animated slideInDown">
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
                <h2 className="mb-4">Billing details</h2>
                <div className="row">
                    <div className="col-lg-7">
                        <form>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">First Name*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Last Name*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Company Name*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address*</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="House Number Street Name"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Town/City*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="townCity"
                                    value={formData.townCity}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Country*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Postcode/ZIP*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mobile*</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email Address*</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="createAccount"
                                        name="createAccount"
                                        checked={formData.createAccount}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="createAccount">
                                        Create an account?
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="differentAddress"
                                        name="differentAddress"
                                        checked={formData.differentAddress}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="differentAddress">
                                        Ship to a different address?
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Order Notes (Optional)</label>
                                <textarea
                                    className="form-control"
                                    rows="6"
                                    name="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="col-lg-5">
                        <div className="table-responsive mb-4">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Products</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <img
                                                    src={`https://api.indiafoodshop.com${item.product_id.image}`}
                                                    alt={item.product_id.name}
                                                    style={{ width: '100px', height: 'auto' }}
                                                    class="img-fluid"
                                                />
                                            </td>
                                            <td>{item.product_id.name}</td>
                                            <td>₹{item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-light mb-4">
                            <h4 className="mb-3">Apply Coupon</h4>
                            <form onSubmit={handleCouponSubmit} className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary text-white">Apply</button>
                            </form>
                            {couponError && <div className="text-danger mt-2">{couponError}</div>}
                            {couponDiscount > 0 && (
                                <div className="text-success mt-2">Coupon applied! You saved ₹{couponDiscount}</div>
                            )}
                        </div>

                        <div className="p-4 bg-light">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>₹{subtotal}</span>
                            </div>
                            {couponDiscount > 0 && (
                                <div className="d-flex justify-content-between mb-2 text-success">
                                    <span>Coupon Discount ({couponDiscount}%):</span>
                                    <span>-₹{discountAmount}</span>
                                </div>
                            )}
                            <div className="d-flex justify-content-between mb-4 fw-bold">
                                <span>Total:</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="p-4 bg-light">
                                <h4 className="mb-4">Shipping</h4>
                                <div className="form-check mb-2">
                                    <input type="radio" className="form-check-input" name="shipping" id="free" />
                                    <label className="form-check-label" htmlFor="free">Free Shipping</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input type="radio" className="form-check-input" name="shipping" id="flat" />
                                    <label className="form-check-label" htmlFor="flat">Flat rate: ₹15.00</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="shipping" id="local" />
                                    <label className="form-check-label" htmlFor="local">Local Pickup: ₹8.00</label>
                                </div>

                                <div className="mt-4">
                                    <h4 className="mb-3">Payment Method</h4>
                                    <div className="form-check mb-2">
                                        <input type="radio" className="form-check-input" name="payment" id="bank" />
                                        <label className="form-check-label" htmlFor="bank">Direct Bank Transfer</label>
                                        <div className="text-muted small mt-2">
                                            Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                                        </div>
                                    </div>
                                </div>

                                <button className="btn btn-primary w-100 mt-4 text-white">Place Order</button>
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