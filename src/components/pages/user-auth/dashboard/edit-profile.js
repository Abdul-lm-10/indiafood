import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Footer from '../../../include/footer';
import Spinner from '../../../include/spinner';
import SearchModel from '../../../include/searchModel';

const EditProfile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        zip_code: ''
    });

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/user-details`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
            console.log(response.data);
            
            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone_number: response.data.phone_number || '',
                address: response.data.address || '',
                city: response.data.city || '',
                state: response.data.state || '',
                zip_code: response.data.zip_code || ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userId = user?._id;
            if (!userId) throw new Error("User ID not available");
    
            await axios.put(`https://api.indiafoodshop.com/api/auth/v1/user/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
        setLoading(false);
    };

    return (
        <>
            <Helmet>
                <title>Edit Profile | User Dashboard</title>
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>

            {loading && <Spinner />}
            <SearchModel />

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">My Profile</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
                    <li className="breadcrumb-item active text-white">Edit Profile</li>
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
                                        <button className="btn btn-sm btn-primary position-absolute bottom-0 end-0">
                                            <i className="fas fa-camera"></i>
                                        </button>
                                    </div>
                                    <div className="ms-4">
                                        <h3 className="mb-1">{user?.name}</h3>
                                        <p className="text-muted mb-0">{user?.email}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Address</label>
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">State</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">PinCode</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="zip_code"
                                                value={formData.zip_code}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 text-end">
                                        <button type="submit" className="btn btn-primary px-5 py-2" disabled={loading}>
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default EditProfile;