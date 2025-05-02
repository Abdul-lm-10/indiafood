import React from 'react';
import { Helmet } from "react-helmet";
import img from "../../external-assets/img/download.jpeg"
import Footer from '../include/footer';
const About = () => {
    return (
        <>
            <Helmet>
                <title>About Us - India Food Shop</title>
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>

            {/* Page Header Start */}
            <div className="container-fluid page-header py-3 py-lg-5">
                <div className="container text-center py-3 py-lg-5">
                    <h1 className="display-2 text-white mb-3 mb-md-4" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>About Us</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">About</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* About Start */}
            <div className="container-fluid py-3 py-lg-5">
                <div className="container">
                    <div className="row g-4 g-lg-5 align-items-center">
                        <div className="col-12 col-lg-6">
                            <div className="about-img text-center">
                                <img 
                                    className="img-fluid rounded" 
                                    src={img} 
                                    alt="About Us"
                                    style={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        height: 'auto',
                                        minHeight: '300px',
                                        objectFit: 'cover'
                                    }} 
                                />
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <h1 className="mb-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>Welcome to India Food Shop</h1>
                            <p className="mb-4">We are passionate about bringing authentic Indian groceries and food products to your doorstep. Our mission is to connect you with the rich flavors and traditions of Indian cuisine.</p>
                            <div className="row g-3 mb-4">
                                <div className="col-12 col-sm-6">
                                    <h5 className="mb-3 fs-6 fs-sm-5"><i className="fa fa-check-circle text-primary me-2"></i>Quality Products</h5>
                                    <h5 className="mb-3 fs-6 fs-sm-5"><i className="fa fa-check-circle text-primary me-2"></i>Fast Delivery</h5>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <h5 className="mb-3 fs-6 fs-sm-5"><i className="fa fa-check-circle text-primary me-2"></i>24/7 Support</h5>
                                    <h5 className="mb-3 fs-6 fs-sm-5"><i className="fa fa-check-circle text-primary me-2"></i>Best Prices</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Start */}
            <div className="container-fluid bg-light py-3 py-lg-5">
                <div className="container">
                    <div className="row g-4">
                        {[
                            { icon: 'fa-truck', title: 'Fast Delivery', desc: 'Quick and reliable delivery service across multiple locations' },
                            { icon: 'fa-star', title: 'Quality Products', desc: 'Authentic Indian products with highest quality standards' },
                            { icon: 'fa-headset', title: 'Customer Support', desc: 'Dedicated support team to assist you with your queries' }
                        ].map((feature, index) => (
                            <div key={index} className="col-12 col-md-6 col-lg-4">
                                <div className="text-center p-3 p-lg-4 h-100">
                                    <div className="feature-icon bg-primary text-white rounded-circle mb-4"
                                        style={{
                                            width: 'clamp(80px, 10vw, 100px)',
                                            height: 'clamp(80px, 10vw, 100px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto'
                                        }}>
                                        <i className={`fas ${feature.icon} fa-2x fa-lg-3x`}></i>
                                    </div>
                                    <h4 className="fs-5 fs-lg-4">{feature.title}</h4>
                                    <p className="mb-0">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;