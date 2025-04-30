import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import SearchModel from '../include/searchModel';
import Spinner from '../include/spinner';
import { Helmet } from 'react-helmet';

const Checkout = () => {
    const { cart } = useCart();
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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
            {/* Checkout Page End */}
        </>
    );
};

export default Checkout;