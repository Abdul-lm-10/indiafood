import Copyright from "../include/copyright";
import Footer from "../include/footer";
import Header from "../include/header";
import Spinner from "../include/spinner";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useState } from "react";
import SearchModel from "../include/searchModel";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useCountry } from "../../context/CountryContext";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { selectedCountryId } = useCountry();
    const filteredProducts = activeTab === 'All'
        ? products
        : products.filter(product => product.category === activeTab);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://api.indiafoodshop.com/admin/products-by-country?country_id=${selectedCountryId}`);
                const data = await res.json();
                console.log("Fetched Products:", data);
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCountryId]);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://api.indiafoodshop.com/admin/get-categories');
                console.log(response.data.data);

                setCategories(response.data.data);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <>
            <Helmet>
                <title>India Food Shop</title>
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>
            {
                loading ? <Spinner /> : ''
            }


            {/* <Header onCountryChange={handleCountryChange} /> */}
            <SearchModel />


            {/*  Hero Start  */}
            <div className="container-fluid py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-md-12 col-lg-7">
                            <h4 className="mb-3 text-secondary">100% Organic Foods</h4>
                            <h1 className="mb-5 display-3 text-primary">Organic Veggies & Fruits Foods</h1>
                            <div className="position-relative mx-auto">
                                <input className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill" type="number" placeholder="Search" />
                                <button type="submit" className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100" style={{ top: '0', right: '25%' }}>Submit Now</button>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-5">
                            <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img src="img/hero-img-1.png" className="img-fluid w-100 h-100 bg-secondary rounded" alt="First slide" />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Fruites</a>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img src="img/hero-img-2.jpg" className="img-fluid w-100 h-100 rounded" alt="Second slide" />
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Vegetables</a>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Hero End  */}


            {/*  Featurs Section Start  */}
            <div className="container-fluid featurs py-5">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-car-side fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5>Free Shipping</h5>
                                    <p className="mb-0">Free on order over $300</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-user-shield fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5>Security Payment</h5>
                                    <p className="mb-0">100% security payment</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fas fa-exchange-alt fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5>30 Day Return</h5>
                                    <p className="mb-0">30 day money guarantee</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="featurs-item text-center rounded bg-light p-4">
                                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                    <i className="fa fa-phone-alt fa-3x text-white"></i>
                                </div>
                                <div className="featurs-content text-center">
                                    <h5>24/7 Support</h5>
                                    <p className="mb-0">Support every time fast</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Featurs Section End  */}


            {/*  Fruits Shop Start */}
            <div className="container-fluid fruite py-5">
                <div className="container py-5">
                    <div className="tab-className text-center">
                        <div className="row g-4">
                            <div className="col-lg-4 text-start">
                                <h1>Our Organic Products</h1>
                            </div>
                            <div className="col-lg-8 text-end">
                                <ul className="nav nav-pills d-inline-flex text-center mb-5">
                                    {/* All Products tab */}
                                    <li className="nav-item">
                                        <button
                                            className={`d-flex m-2 py-2 bg-light rounded-pill ${activeTab === 'All' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('All')}
                                            style={{ border: 'none', background: 'none' }}
                                        >
                                            <span className="text-dark" style={{ width: '130px' }}>All Products</span>
                                        </button>
                                    </li>

                                    {/* Dynamically generate category tabs */}
                                    {categories.map((category) => (
                                        <li key={category._id} className="nav-item">
                                            <button
                                                className={`d-flex m-2 py-2 bg-light rounded-pill ${activeTab === category.name ? 'active' : ''}`}
                                                onClick={() => handleTabClick(category.name)}
                                                style={{ border: 'none', background: 'none' }}
                                            >
                                                <span className="text-dark" style={{ width: '130px' }}>{category.name}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                        <div className="tab-content">
                            <div className="tab-pane fade show active p-0">
                                <div className="row g-4">
                                    <div className="col-lg-12">
                                        <div className="row g-4">
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : error ? (
                                                <p>{error}</p>
                                            ) : filteredProducts.length > 0 && (
                                                filteredProducts.map((product) => (
                                                    <div key={product._id} className="col-md-6 col-lg-4 col-xl-3">
                                                        <div className="rounded position-relative fruite-item">
                                                            <div className="fruite-img" style={{ height: '250px', overflow: 'hidden' }}>
                                                                <img
                                                                    src={`https://api.indiafoodshop.com${product.image}`}
                                                                    className="img-fluid w-100 h-100 rounded-top object-fit-cover"
                                                                    alt={product.name}
                                                                />
                                                            </div>
                                                            <div className="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px' }}>
                                                                {product.category}
                                                            </div>
                                                            <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                                                                <h4>{product.name.trim()}</h4>
                                                                <p>{product.description.trim()}</p>
                                                                <div className="d-flex justify-content-between flex-lg-wrap">
                                                                    <div>
                                                                        {product.prices.map((item, idx) => (
                                                                            <p key={idx} className="text-dark fs-6 mb-0">
                                                                                ₹{item.price} / {item.quantity}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => addToCart(product, selectedCountryId)}
                                                                        className="btn border border-secondary rounded-pill px-3 text-primary"
                                                                    >
                                                                        <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Fruits Shop End */}


            {/*  Featurs Start */}
            <div className="container-fluid service py-5">
                <div className="container py-5">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <a href="#">
                                <div className="service-item bg-secondary rounded border border-secondary">
                                    <img src="img/featur-1.jpg" className="img-fluid rounded-top w-100" alt="" />
                                    <div className="px-4 rounded-bottom">
                                        <div className="service-content bg-primary text-center p-4 rounded">
                                            <h5 className="text-white">Fresh Apples</h5>
                                            <h3 className="mb-0">20% OFF</h3>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <a href="#">
                                <div className="service-item bg-dark rounded border border-dark">
                                    <img src="img/featur-2.jpg" className="img-fluid rounded-top w-100" alt="" />
                                    <div className="px-4 rounded-bottom">
                                        <div className="service-content bg-light text-center p-4 rounded">
                                            <h5 className="text-primary">Tasty Fruits</h5>
                                            <h3 className="mb-0">Free delivery</h3>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <a href="#">
                                <div className="service-item bg-primary rounded border border-primary">
                                    <img src="img/featur-3.jpg" className="img-fluid rounded-top w-100" alt="" />
                                    <div className="px-4 rounded-bottom">
                                        <div className="service-content bg-secondary text-center p-4 rounded">
                                            <h5 className="text-white">Exotic Vegitable</h5>
                                            <h3 className="mb-0">Discount 30$</h3>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Featurs End  */}


            {/* Vesitable Shop Start */}
            <div className="container-fluid vesitable py-5">
                <div className="container py-5">
                    <h1 className="mb-0">Fresh Organic Vegetables</h1>
                    <div className="owl-carousel vegetable-carousel justify-content-center">
                        <div className="border border-primary rounded position-relative vesitable-item">
                            <div className="vesitable-img">
                                <img src="img/vegetable-item-6.jpg" className="img-fluid w-100 rounded-top" alt="" />
                            </div>
                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                            <div className="p-4 rounded-bottom">
                                <h4>Parsely</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">$4.99 / kg</p>
                                    <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                            </div>
                        </div>
                        <div className="border border-primary rounded position-relative vesitable-item">
                            <div className="vesitable-img">
                                <img src="img/vegetable-item-1.jpg" className="img-fluid w-100 rounded-top" alt="" />
                            </div>
                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                            <div className="p-4 rounded-bottom">
                                <h4>Parsely</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">$4.99 / kg</p>
                                    <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                            </div>
                        </div>
                        <div className="border border-primary rounded position-relative vesitable-item">
                            <div className="vesitable-img">
                                <img src="img/vegetable-item-3.png" className="img-fluid w-100 rounded-top bg-light" alt="" />
                            </div>
                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                            <div className="p-4 rounded-bottom">
                                <h4>Banana</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">$7.99 / kg</p>
                                    <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                            </div>
                        </div>
                        <div className="border border-primary rounded position-relative vesitable-item">
                            <div className="vesitable-img">
                                <img src="img/vegetable-item-4.jpg" className="img-fluid w-100 rounded-top" alt="" />
                            </div>
                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                            <div className="p-4 rounded-bottom">
                                <h4>Bell Papper</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">$7.99 / kg</p>
                                    <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                            </div>
                        </div>
                        <div className="border border-primary rounded position-relative vesitable-item">
                            <div className="vesitable-img">
                                <img src="img/vegetable-item-5.jpg" className="img-fluid w-100 rounded-top" alt="" />
                            </div>
                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                            <div className="p-4 rounded-bottom">
                                <h4>Potatoes</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">$7.99 / kg</p>
                                    <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                            </div>
                        </div>
                        <div className="border border-primary rounded position-relative vesitable-item">
                            <div className="vesitable-img">
                                <img src="img/vegetable-item-6.jpg" className="img-fluid w-100 rounded-top" alt="" />
                            </div>
                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                            <div className="p-4 rounded-bottom">
                                <h4>Parsely</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">$7.99 / kg</p>
                                    <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                            </div>
                        </div>
                        <div className="border border-primary rounded position-relative vesitable-item">
                            <div className="vesitable-img">
                                <img src="img/vegetable-item-5.jpg" className="img-fluid w-100 rounded-top" alt="" />
                            </div>
                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                            <div className="p-4 rounded-bottom">
                                <h4>Potatoes</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">$7.99 / kg</p>
                                    <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                            </div>
                        </div>
                        <div className="border border-primary rounded position-relative vesitable-item">
                            <div className="vesitable-img">
                                <img src="img/vegetable-item-6.jpg" className="img-fluid w-100 rounded-top" alt="" />
                            </div>
                            <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px' }}>Vegetable</div>
                            <div className="p-4 rounded-bottom">
                                <h4>Parsely</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">$7.99 / kg</p>
                                    <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Vesitable Shop End  */}


            {/*  Banner Section Start */}
            <div className="container-fluid banner bg-secondary my-5">
                <div className="container py-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="py-4">
                                <h1 className="display-3 text-white">Fresh Exotic Fruits</h1>
                                <p className="fw-normal display-3 text-dark mb-4">in Our Store</p>
                                <p className="mb-4 text-dark">The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic words etc.</p>
                                <a href="#" className="banner-btn btn border-2 border-white rounded-pill text-dark py-3 px-5">BUY</a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative">
                                <img src="img/baner-1.png" className="img-fluid w-100 rounded" alt="" />
                                <div className="d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute" style={{ width: '140px', height: '140px', top: '0', left: '0' }}>
                                    <h1 style={{ fontSize: '100px' }}>1</h1>
                                    <div className="d-flex flex-column">
                                        <span className="h2 mb-0">50$</span>
                                        <span className="h4 text-muted mb-0">kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  Banner Section End  */}


            {/*  Bestsaler Product Start  */}
            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
                        <h1 className="display-4">Bestseller Products</h1>
                        <p>Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.</p>
                    </div>
                    <div className="row g-4">
                        {Array.isArray(products) && products.slice(0, 6).map((product) => (
                            <div className="col-lg-6 col-xl-4" key={product._id}>
                                <div className="p-4 rounded bg-light">
                                    <div className="row align-items-center">
                                        <div className="col-6" style={{ height: '200px', overflow: 'hidden' }}>
                                            <img
                                                src={`https://api.indiafoodshop.com${product.image}`}
                                                className="img-fluid rounded-circle w-100 h-100 object-fit-cover"
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <a href="#" className="h5">{product.name}</a>
                                            <div className="d-flex my-3">
                                                <i className="fas fa-star text-primary"></i>
                                                <i className="fas fa-star text-primary"></i>
                                                <i className="fas fa-star text-primary"></i>
                                                <i className="fas fa-star text-primary"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                            <h4 className="mb-3">{product.prices.map((item, idx) => (
                                                <p key={idx} className="text-dark fs-6 mb-0">
                                                    ₹{item.price} / {item.quantity}
                                                </p>
                                            ))}</h4>
                                            <a className="btn border border-secondary rounded-pill px-3 text-primary" onClick={() => addToCart(product, selectedCountryId)}>
                                                <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {Array.isArray(products) && products.slice(0, 4).map((product) => (
                            <div className="col-md-6 col-lg-6 col-xl-3" key={product._id}>
                                <div className="text-center">
                                    <div style={{ height: '250px', overflow: 'hidden' }}>
                                        <img
                                            src={`https://api.indiafoodshop.com${product.image}`}
                                            className="img-fluid rounded w-100 h-100 object-fit-cover"
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className="py-4">
                                        <a href="#" className="h5">{product.name}</a>
                                        <div className="d-flex my-3 justify-content-center">
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                        {/* <h4 className="mb-3">₹{product.price}</h4> */}
                                        <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary" onClick={() => addToCart(product, selectedCountryId)}>
                                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Bestsaler Product End */}


            {/*  Fact Start  */}
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="bg-light p-5 rounded">
                        <div className="row g-4 justify-content-center">
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded p-5">
                                    <i className="fa fa-users text-secondary"></i>
                                    <h4>satisfied customers</h4>
                                    <h1>1963</h1>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded p-5">
                                    <i className="fa fa-users text-secondary"></i>
                                    <h4>quality of service</h4>
                                    <h1>99%</h1>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded p-5">
                                    <i className="fa fa-users text-secondary"></i>
                                    <h4>quality certificates</h4>
                                    <h1>33</h1>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-3">
                                <div className="counter bg-white rounded p-5">
                                    <i className="fa fa-users text-secondary"></i>
                                    <h4>Available Products</h4>
                                    <h1>789</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Fact Start */}


            {/* Tastimonial Start */}
            {/* <div className="container-fluid testimonial py-5">
                <div className="container py-5">
                    <div className="testimonial-header text-center">
                        <h4 className="text-primary">Our Testimonial</h4>
                        <h1 className="display-5 mb-5 text-dark">Our Client Saying!</h1>
                    </div>
                    <div className="owl-carousel testimonial-carousel">
                        <div className="testimonial-item img-border-radius bg-light rounded p-4">
                            <div className="position-relative">
                                <i className="fa fa-quote-right fa-2x text-secondary position-absolute" style={{bottom: '30px', right: '0'}}></i>
                                <div className="mb-4 pb-4 border-bottom border-secondary">
                                    <p className="mb-0">Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s,
                                    </p>
                                </div>
                                <div className="d-flex align-items-center flex-nowrap">
                                    <div className="bg-secondary rounded">
                                        <img src="img/testimonial-1.jpg" className="img-fluid rounded" style={{width: '100px', height: '100px'}} alt="" />
                                    </div>
                                    <div className="ms-4 d-block">
                                        <h4 className="text-dark">Client Name</h4>
                                        <p className="m-0 pb-3">Profession</p>
                                        <div className="d-flex pe-5">
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-item img-border-radius bg-light rounded p-4">
                            <div className="position-relative">
                                <i className="fa fa-quote-right fa-2x text-secondary position-absolute" style={{bottom: '30px', right: '0'}}></i>
                                <div className="mb-4 pb-4 border-bottom border-secondary">
                                    <p className="mb-0">Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s,
                                    </p>
                                </div>
                                <div className="d-flex align-items-center flex-nowrap">
                                    <div className="bg-secondary rounded">
                                        <img src="img/testimonial-1.jpg" className="img-fluid rounded" style={{width: '100px', height: '100px'}} alt="" />
                                    </div>
                                    <div className="ms-4 d-block">
                                        <h4 className="text-dark">Client Name</h4>
                                        <p className="m-0 pb-3">Profession</p>
                                        <div className="d-flex pe-5">
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-item img-border-radius bg-light rounded p-4">
                            <div className="position-relative">
                                <i className="fa fa-quote-right fa-2x text-secondary position-absolute" style={{bottom: '30px', right: '0'}}></i>
                                <div className="mb-4 pb-4 border-bottom border-secondary">
                                    <p className="mb-0">Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s,
                                    </p>
                                </div>
                                <div className="d-flex align-items-center flex-nowrap">
                                    <div className="bg-secondary rounded">
                                        <img src="img/testimonial-1.jpg" className="img-fluid rounded" style={{width: '100px', height: '100px'}} alt="" />
                                    </div>
                                    <div className="ms-4 d-block">
                                        <h4 className="text-dark">Client Name</h4>
                                        <p className="m-0 pb-3">Profession</p>
                                        <div className="d-flex pe-5">
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* Tastimonial End */}
            <Footer />
            <Copyright />
        </>
    )
}

export default Home;