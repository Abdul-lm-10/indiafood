import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Footer from '../../../include/footer';
import Spinner from '../../../include/spinner';
import SearchModel from '../../../include/searchModel';
import { useCountry } from '../../../../context/CountryContext';

const EditProfile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const { countryCode } = useCountry();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [addressList, setAddressList] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        isDefault: false
    });

    const handleSetActive = async (index) => {
        const selectedAddress = addressList[index];
        const shouldBeDefault = !selectedAddress.isDefault; 

        try {
            await axios.put(
                `https://api.indiafoodshop.com/api/auth/v1/delivery-address/${selectedAddress._id}`,
                {
                    userId: user._id,
                    isDefault: shouldBeDefault
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await fetchAddresses(user._id);
        } catch (err) {
            console.error("Failed to update default address:", err);
            alert("Error updating default address.");
        }
    };

    const handleEditAddress = async (index) => {
        const addressToEdit = addressList[index];
        setNewAddress({ ...addressToEdit });
        setEditingId(addressToEdit._id); 
        setShowAddressForm(true);
    };

    const handleUpdateAddress = async () => {
        if (editingId) {
            try {
                const res = await axios.put(`https://api.indiafoodshop.com/api/auth/v1/delivery-address/${editingId}`, {
                    ...newAddress,
                    userId: user._id
                });
                setEditingId(null);
                setShowAddressForm(false);
                fetchAddresses(user._id);
            } catch (err) {
                console.error("Failed to update address:", err);
            }
        }
    };

    const handleDeleteAddress = async (index) => {
        const address = addressList[index];
        try {
            await axios.delete(`https://api.indiafoodshop.com/api/auth/v1/delivery-address/${address._id}`, {
                data: { userId: user._id }
            });
            setAddressList(prev => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Failed to delete address:", err);
        }
    };

    const handleAddAddress = async () => {
        const { address, city, state, zip_code, country } = newAddress;
        if (address && city && state && zip_code && country) {
            try {
                const res = await axios.post(`https://api.indiafoodshop.com/api/auth/v1/delivery-address`, {
                    ...newAddress,
                    userId: user._id
                });
                setAddressList(prev => [...prev, res.data.address]);
                setNewAddress({ address: '', city: '', state: '', zip_code: '', country: '', isDefault: false });
                setShowAddressForm(false);
            } catch (err) {
                console.error("Failed to add address:", err);
            }
        }
    };

    const toggleAddressForm = () => {
        setShowAddressForm(!showAddressForm);
        setNewAddress({
            address: '',
            city: '',
            state: '',
            zip_code: '',
            country: '',
            isDefault: false
        });
    };

    useEffect(() => {
        fetchUserDetails();
        const hasReloaded = sessionStorage.getItem('hasReloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('hasReloaded', 'true');
            window.location.reload();
        }

    }, []);


    const fetchAddresses = async (userId) => {
        try {
            const res = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/delivery-address`, {
                params: { userId }
            });
            setAddressList(res.data.addresses);
        } catch (err) {
            console.error("Error fetching addresses:", err);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`https://api.indiafoodshop.com/api/auth/v1/user-details`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
            // Add country code to phone number if it doesn't already have one
            const phoneNumber = response.data.phone_number || '';
            const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `${countryCode} ${phoneNumber}`;

            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone_number: formattedPhoneNumber,
            });
            setLoading(false);
            fetchAddresses(response.data._id);

        } catch (error) {
            console.error('Error fetching user details:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone_number') {
            // Remove any existing country code or non-digit characters
            const cleanNumber = value.replace(/^\+\d+\s*|[^\d]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: countryCode + ' ' + cleanNumber
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
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
                                                placeholder={`${countryCode} Phone Number`}
                                            />
                                        </div>

                                    </div>

                                    <div className="mt-4 text-end">
                                        <button type="submit" className="btn btn-primary px-5 py-2 text-white" disabled={loading}>
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5>Saved Addresses</h5>
                                <button
                                    className="btn btn-primary btn-sm text-white p-2"
                                    onClick={toggleAddressForm}
                                >
                                    {showAddressForm ? 'Cancel' : '+ Add Delivery Address'}
                                </button>
                            </div>

                            {addressList.length === 0 && !showAddressForm ? (
                                <div className="alert alert-info">No saved addresses found.</div>
                            ) : (
                                <div className="row">
                                    {addressList.map((addr, i) => (
                                        <div key={i} className="col-md-6 mb-4">
                                            <div className={`card h-100 ${addr.isDefault ? 'border-primary' : ''}`}>
                                                <div className="card-body">
                                                    {addr.isDefault && (
                                                        <span className="badge bg-primary position-absolute top-0 end-0 m-2">Active</span>
                                                    )}
                                                    <h6 className="card-title">Address {i + 1}</h6>
                                                    <div className="card-text">
                                                        <p className="mb-1"><strong>Street:</strong> {addr.address}</p>
                                                        <p className="mb-1"><strong>City:</strong> {addr.city}</p>
                                                        <p className="mb-1"><strong>State:</strong> {addr.state}</p>
                                                        <p className="mb-1"><strong>Zip:</strong> {addr.zip_code}</p>
                                                        <p className="mb-0"><strong>Country:</strong> {addr.country}</p>
                                                    </div>
                                                </div>
                                                <div className="card-footer bg-transparent border-top-0">
                                                    <div className="d-flex justify-content-between">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary" style={{ hover: {  color: '#ffffff' } }}
                                                            onClick={() => handleSetActive(i)}
                                                            // disabled={addr.isDefault}
                                                        >
                                                            {addr.isDefault ? 'Active' : 'Set as Active'}
                                                        </button>
                                                        <div>
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary me-2"
                                                                onClick={() => handleEditAddress(i)}
                                                            >
                                                                <i className="bi bi-pencil"></i> Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeleteAddress(i)}
                                                            >
                                                                <i className="bi bi-trash"></i> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showAddressForm && (
                                <div className="col-12 mt-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Add New Delivery Address</h5>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="address" className="form-label">Street Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="address"
                                                        placeholder="123 Main St"
                                                        value={newAddress.address}
                                                        onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="city" className="form-label">City</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="city"
                                                        placeholder="City"
                                                        value={newAddress.city}
                                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="state" className="form-label">State/Province</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="state"
                                                        placeholder="State"
                                                        value={newAddress.state}
                                                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="zip" className="form-label">Zip/Postal Code</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="zip"
                                                        placeholder="Zip Code"
                                                        value={newAddress.zip_code}
                                                        onChange={e => setNewAddress({ ...newAddress, zip_code: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="country" className="form-label">Country</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="country"
                                                        placeholder="Country"
                                                        value={newAddress.country}
                                                        onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-12 text-end">
                                                    <button onClick={editingId ? handleUpdateAddress : handleAddAddress} className="btn btn-primary text-white p-2">
                                                        {editingId ? "Update Address" : "Add Address"}
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={toggleAddressForm}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default EditProfile;