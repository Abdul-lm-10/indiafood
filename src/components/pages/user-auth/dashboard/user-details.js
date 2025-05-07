import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Footer from '../../../include/footer';
import Spinner from '../../../include/spinner';
import SearchModel from '../../../include/searchModel';

const UserDetails = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserDetails();
        const hasReloaded = sessionStorage.getItem('hasReloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('hasReloaded', 'true');
            window.location.reload();
        }
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/user-details`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>User Details | User Dashboard</title>
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>

            {loading && <Spinner />}
            <SearchModel />

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">User Details</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
                    <li className="breadcrumb-item active text-white">User Details</li>
                </ol>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-4 p-md-5">
                                <div className="d-flex align-items-center mb-4 pb-2">
                                    <div className="position-relative">
                                        <img
                                            src="/img/avatar.png"
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="ms-4">
                                        <h3 className="mb-1">{user?.name}</h3>
                                        <p className="text-muted mb-0">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-2">Name</h6>
                                            <p className="mb-0 fs-5">{user?.name || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-2">Email</h6>
                                            <p className="mb-0 fs-5">{user?.email || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-2">Phone Number</h6>
                                            <p className="mb-0 fs-5">{user?.phone_number || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-2">Address</h6>
                                            <p className="mb-0 fs-5">{user?.address || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-2">City</h6>
                                            <p className="mb-0 fs-5">{user?.city || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-2">State</h6>
                                            <p className="mb-0 fs-5">{user?.state || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-2">Pincode</h6>
                                            <p className="mb-0 fs-5">{user?.pincode || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-end">
                                    <Link to="/edit-profile" className="btn btn-primary px-5 py-2">
                                        Edit Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default UserDetails;