import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchModel from '../include/searchModel';
import Spinner from '../include/spinner';
import Footer from '../include/footer';
import OrderTracking from './OrderTracking';

const OrderPage = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !user._id) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`https://api.indiafoodshop.com/admin/orders/user/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.data.data) {
                    setOrders(response.data.data);
                } else {
                    setError('No orders found');
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    return (
        <>
            <Helmet>
                <title>My Orders | India Food Shop</title>
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>

            <SearchModel />

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">My Orders</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
                    <li className="breadcrumb-item text-white active">Orders</li>
                </ol>
            </div>

            <div className="container-fluid py-5">
                <div className="container">
                    {loading ? (
                        <Spinner />
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : !user ? (
                        <div className="text-center py-5">
                            <h4>Please login to view your orders</h4>
                            <Link to="/login" className="btn btn-primary mt-3">Login</Link>
                        </div>
                    ) : (
                        <>
                            {/* All Orders Section */}
                            <div className="row">
                                <div className="col-12">
                                    <h4 className="mb-4">My Orders</h4>
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Date</th>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Status</th>
                                                    <th>Payment</th>
                                                </tr>
                                            </thead>
                                            {/* <tbody>
                                                {orders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td>#{order._id.slice(-6)}</td>
                                                        <td>{order.date_time}</td>
                                                        <td>{order.product_name}</td>
                                                        <td>{order.quantity} ({order.pieces} pieces)</td>
                                                        <td>₹{order.price}</td>
                                                        <td>
                                                            <span className={`badge ${
                                                                order.order_status === 'Pending' ? 'bg-warning' :
                                                                order.order_status === 'Processing' ? 'bg-info' :
                                                                order.order_status === 'Shipped' ? 'bg-primary' :
                                                                order.order_status === 'Delivered' ? 'bg-success' :
                                                                'bg-secondary'
                                                            }`}>
                                                                {order.order_status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${order.is_paid === 'YES' ? 'bg-success' : 'bg-danger'}`}>
                                                                {order.is_paid === 'YES' ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody> */}


                                            <tbody>
                                                {orders.map(order =>
                                                    order.items.map((item, index) => (
                                                        <tr key={`${order._id}-${index}`}>
                                                            <td>#{order.order_no}</td>
                                                            <td>{order.date_time}</td>
                                                            <td>{item.product_name}</td>
                                                            <td>{item.quantity} ({item.pieces} pieces)</td>
                                                            <td>₹{item.price}</td>
                                                            <td>
                                                                <span className={`badge ${order.order_status === 'Pending' ? 'bg-warning' :
                                                                        order.order_status === 'Processing' ? 'bg-info' :
                                                                            order.order_status === 'Shipped' ? 'bg-primary' :
                                                                                order.order_status === 'Delivered' ? 'bg-success' :
                                                                                    'bg-secondary'
                                                                    }`}>
                                                                    {order.order_status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${order.is_paid === 'YES' ? 'bg-success' : 'bg-danger'}`}>
                                                                    {order.is_paid === 'YES' ? 'Paid' : 'Unpaid'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                        {orders.length === 0 && (
                                            <div className="text-center py-4">
                                                <h5>No orders found</h5>
                                                <Link to="/products" className="btn btn-primary mt-3">
                                                    Start Shopping
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderPage;