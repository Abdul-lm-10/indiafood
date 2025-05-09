import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import SearchModel from '../include/searchModel';
import { Link } from 'react-router-dom';

const OrderTracking = () => {
    const [trackingOrders, setTrackingOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('Pending');

    const fetchOrdersByStatus = async (status) => {
        try {
            const response = await axios.get(`https://api.indiafoodshop.com/admin/orders/status/${status}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            
            if (response.data.data) {
                setTrackingOrders(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching orders by status:', err);
        }
    };

    useEffect(() => {
        fetchOrdersByStatus(selectedStatus);
    }, [selectedStatus]);

    return (
        <>
            <Helmet>
                <title>Track Orders | India Food Shop</title>
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>

            <SearchModel />

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Track Orders</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
                    <li className="breadcrumb-item text-white active">Track Orders</li>
                </ol>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="card shadow-sm border-0 rounded-3">
                            <div className="card-body p-4">
                                <h4 className="mb-4 text-center text-md-start">Track Orders by Status</h4>

                                {/* Responsive status buttons */}
                                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start mb-4">
                                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map(status => (
                                        <button
                                            key={status}
                                            className={`btn ${selectedStatus === status ? 'btn-primary' : 'btn-outline-primary'} px-4 py-2`}
                                            onClick={() => setSelectedStatus(status)}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>

                                {/* Responsive table with cards for mobile */}
                                <div className="table-responsive d-none d-md-block">
                                    <table className="table table-hover border">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Date</th>
                                                <th>Items</th>
                                                <th>Total Price</th>
                                                <th>Location</th>
                                                <th>Status</th>
                                                <th>Payment</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {trackingOrders.map(order => {
                                                const totalPrice = order.items.reduce((sum, item) => sum + parseFloat(item.price), 0);
                                                return (
                                                    <tr key={order._id}>
                                                        <td>#{order._id.slice(-6)}</td>
                                                        <td>{order.date_time}</td>
                                                        <td>
                                                            <ul className="list-unstyled mb-0">
                                                                {order.items.map((item, index) => (
                                                                    <li key={index}>
                                                                        {item.product_name} ({item.quantity}) - ₹{item.price}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td>₹{totalPrice.toFixed(2)}</td>
                                                        <td>{order.location}</td>
                                                        <td>
                                                            <span className={`badge ${order.order_status === 'Pending' ? 'bg-warning' :
                                                                order.order_status === 'Processing' ? 'bg-info' :
                                                                    order.order_status === 'Shipped' ? 'bg-primary' :
                                                                        order.order_status === 'Delivered' ? 'bg-success' :
                                                                            'bg-secondary'}`}>
                                                                {order.order_status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${order.is_paid === 'YES' ? 'bg-success' : 'bg-danger'}`}>
                                                                {order.is_paid === 'YES' ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile cards view */}
                                <div className="d-md-none">
                                    {trackingOrders.map((order) => {
                                        const totalPrice = order.items.reduce((sum, item) => sum + parseFloat(item.price), 0);
                                        return (
                                            <div key={order._id} className="card mb-3 border">
                                                <div className="card-body p-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h6 className="mb-0">#{order._id.slice(-6)}</h6>
                                                        <span className={`badge ${order.order_status === 'Pending' ? 'bg-warning' :
                                                            order.order_status === 'Processing' ? 'bg-info' :
                                                                order.order_status === 'Shipped' ? 'bg-primary' :
                                                                    order.order_status === 'Delivered' ? 'bg-success' :
                                                                        'bg-secondary'}`}>
                                                            {order.order_status}
                                                        </span>
                                                    </div>
                                                    <div className="small text-muted mb-2">{order.date_time}</div>
                                                    <div className="mb-2">
                                                        <strong>Items:</strong>
                                                        <ul className="list-unstyled mb-0 mt-1">
                                                            {order.items.map((item, index) => (
                                                                <li key={index}>
                                                                    {item.product_name} ({item.quantity}) - ₹{item.price}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="mt-2">
                                                            <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="mb-2"><strong>Location:</strong> {order.location}</div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span><strong>Payment:</strong></span>
                                                        <span className={`badge ${order.is_paid === 'YES' ? 'bg-success' : 'bg-danger'}`}>
                                                            {order.is_paid === 'YES' ? 'Paid' : 'Unpaid'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>


                                {trackingOrders.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="mb-0">No orders found with {selectedStatus} status</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderTracking;