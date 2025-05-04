import { useEffect, useState } from "react";
import Footer from "../include/footer";
import Spinner from "../include/spinner";
import { Helmet } from "react-helmet";
import SearchModel from "../include/searchModel";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import FeaturedProducts from "./order/featuredProducts";
import CategoriesGroup from "./order/categoriesGroup";
import ReviewForm from "./order/reviewForm";
import Reviews from "./order/reviews";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCountry } from "../../context/CountryContext";

const ProductDetails = () => {
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    let { slug } = useParams();
    const { user } = useAuth();
    const { selectedCountryId } = useCountry();

    const handleQuantityChange = (action) => {
        if (action === 'minus' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (action === 'plus') {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        addToCart(productDetails, selectedCountryId, quantity);
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.indiafoodshop.com/admin/get-product/${slug}`);
                if (response.data) {
                    setProductDetails(response.data);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to load product details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [slug]);

    if (loading) return <Spinner />;
    if (error) return <div className="text-center py-5">{error}</div>;
    if (!productDetails) return <div className="text-center py-5">Product Hell not found</div>;

    return (
        <>
            <Helmet>
                <title>{productDetails.meta_title} | India Food Shop</title>
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
            </Helmet>

            <SearchModel />

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">{productDetails.name}</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
                </ol>
            </div>

            <div className="container-fluid py-5 mt-1">
                <div className="container py-5">
                    <div className="row g-4 mb-5">
                        <div className="col-lg-8 col-xl-9">
                            <div className="row g-4">
                                <div className="col-lg-6">
                                    <div className="rounded">
                                        <img
                                            src={`https://api.indiafoodshop.com${productDetails.image}`}
                                            className="border img-fluid rounded"
                                            alt={productDetails.name}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <h4 className="fw-bold mb-3">{productDetails.name}</h4>
                                    <p className="mb-3">Category: {productDetails.category}</p>

                                    {productDetails.prices &&
                                        productDetails.prices
                                            .filter(price => price.country_id === selectedCountryId)
                                            .map((price, index) => (
                                                <div key={index} className="mb-2">
                                                    <h5 className="fw-bold">₹{price.price} / {price.quantity}</h5>
                                                </div>
                                            ))}

                                    <div className="input-group quantity mb-5" style={{ width: '100px' }}>
                                        <div className="input-group-btn">
                                            <button
                                                className="btn btn-sm btn-minus rounded-circle bg-light border"
                                                onClick={() => handleQuantityChange('minus')}
                                            >
                                                <i className="fa fa-minus"></i>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm text-center border-0"
                                            value={quantity}
                                            readOnly
                                        />
                                        <div className="input-group-btn">
                                            <button
                                                className="btn btn-sm btn-plus rounded-circle bg-light border"
                                                onClick={() => handleQuantityChange('plus')}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                                        onClick={handleAddToCart}
                                    >
                                        <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                    </button>
                                </div>

                                <div className="col-lg-12">
                                    <nav>
                                        <div className="nav nav-tabs mb-3">
                                            <button
                                                className={`nav-link ${activeTab === 'description' ? 'active' : ''} border-white border-bottom-0`}
                                                onClick={() => setActiveTab('description')}
                                            >
                                                Description
                                            </button>
                                            <button
                                                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''} border-white border-bottom-0`}
                                                onClick={() => setActiveTab('reviews')}
                                            >
                                                Reviews
                                            </button>
                                        </div>
                                    </nav>

                                    <div className="tab-content mb-5">
                                        {activeTab === 'description' && (
                                            <div className="tab-pane active">
                                                <p>{productDetails.description}</p>
                                                {/* Product specifications */}
                                            </div>
                                        )}

                                        {activeTab === 'reviews' && (
                                            <div className="tab-pane active">
                                                <Reviews />
                                                {user ? (
                                                    <ReviewForm productId={productDetails._id} />
                                                ) : (
                                                    <p className="text-center mt-4">Please log in to leave a review.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-xl-3">
                            <div className="row g-4 fruite">
                                <div className="col-lg-12">
                                    <div className="mb-4">
                                        <CategoriesGroup />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <FeaturedProducts />
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

export default ProductDetails;