import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useCart } from '../../context/CartContext';
import { useCountry } from '../../context/CountryContext';
import Footer from '../include/footer';
import Spinner from '../include/spinner';
import SearchModel from '../include/searchModel';

const AboutProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const { addToCart } = useCart();
    const { selectedCountryId } = useCountry();
    let { slug } = useParams();
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://api.indiafoodshop.com/admin/get-product/${slug}`);
                setProduct(response.data);
                if (response.data.prices && response.data.prices.length > 0) {
                    setSelectedPrice(response.data.prices[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) { // Check for slug instead of id
            fetchProduct();
        }
    }, [slug]);

    const handleAddToCart = () => {
        if (product && selectedPrice) {
            const cartItem = {
                ...product,
                quantity: selectedQuantity,
                price: selectedPrice.price
            };
            addToCart(cartItem, selectedCountryId);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <>
            <Helmet>
                <title>{product.name} | India Food Shop</title>
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>
            {loading ? <Spinner /> : ""}
            <SearchModel />

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">{product.name}</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item"><a href="/products">Products</a></li>
                    <li className="breadcrumb-item active text-white">{product.name}</li>
                </ol>
            </div>

            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="product-img position-relative overflow-hidden">
                                <img
                                    src={`https://api.indiafoodshop.com${product.image}`}
                                    className="img-fluid w-100 rounded"
                                    alt={product.name}
                                />
                                <div className="product-action">
                                    <a className="btn btn-primary rounded-pill py-3 px-5" href="">
                                        {product.category}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <h1 className="h2 mb-4">{product.name}</h1>
                            <p className="mb-4">{product.description}</p>

                            <div className="mb-4">
                                <h5 className="mb-3">Available Quantities:</h5>
                                <div className="d-flex gap-3 flex-wrap">
                                    {product.prices && product.prices.map((price, index) => (
                                        <button
                                            key={index}
                                            className={`btn ${selectedPrice === price ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-4`}
                                            onClick={() => setSelectedPrice(price)}
                                        >
                                            {price.quantity}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="mb-3">Price:</h5>
                                <h3 className="text-primary mb-0">
                                    ₹{selectedPrice ? selectedPrice.price : product.prices?.[0]?.price}
                                </h3>
                            </div>

                            <div className="mb-4">
                                <h5 className="mb-3">Quantity:</h5>
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm text-center mx-2"
                                        style={{ width: '60px' }}
                                        value={selectedQuantity}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary rounded-pill py-3 px-5"
                            >
                                <i className="fa fa-shopping-bag me-2"></i> Add to Cart
                            </button>

                            <div className="mt-5">
                                <h5 className="mb-3">Product Details:</h5>
                                <ul className="list-unstyled">
                                    <li><i className="fa fa-check text-primary me-3"></i>Category: {product.category}</li>
                                    <li><i className="fa fa-check text-primary me-3"></i>Fresh and High Quality</li>
                                    <li><i className="fa fa-check text-primary me-3"></i>Direct from Farmers</li>
                                    <li><i className="fa fa-check text-primary me-3"></i>Free Shipping Available</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default AboutProduct;