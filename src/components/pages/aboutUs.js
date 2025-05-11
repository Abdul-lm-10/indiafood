import React from 'react';
import { Helmet } from "react-helmet";
import img from "../../external-assets/img/download.jpeg"
import Footer from '../include/footer';
import { Link } from 'react-router-dom';

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

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">About Us</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to={'/'}>Home</Link></li>
                    <li className="breadcrumb-item active text-white">About</li>
                </ol>
            </div>

            <div className="container-fluid py-3 py-lg-5">
                <div className="container">
                    <div className="row g-4 g-lg-5 align-items-center">
                        <div className="col-12 col-lg-6">
                            <div className="about-img text-center">
                                <img 
                                    className="img-fluid rounded shadow" 
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

            <div className="container-fluid bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10">
                            <h2 className="text-center mb-4">Our Story</h2>
                            <div className="bg-white p-4 p-lg-5 rounded shadow-sm">
                                <p className="mb-4">Born in the rural greens of the Nellai district of southern India, we (a small team of three) grew up with nature, eating what our soil produced. Nourished by the waters of Thamirabarani, our land yields crops pure and divine. As we grew older and moved to urban cities, this purity in food became alien to us. Sustaining health had become a difficulty in the urban conditions. We slowly started realising that our fellows in the rural had healthier options and better nutrition, but these did not reach the urban parts of the country without being adulterated. We wanted to fill in this gap and that's exactly what we are aiming to do. Hence this store!</p>
                                
                                <p className="mb-4">The term organic has been trivialized today. Producing organic foods has started to become unnatural in the cities. So we went back to our own land, and many other rural parts of the country, and collected products of higher quality from the farmers—the quality that is usually kept for exports. We then sent samples of these to lab tests to further assure the purity. As the results were promising, we proceeded to take them for sales.</p>
                                
                                <p className="mb-0">Till today, we are in the constant lookout for better food products and are continuing our process. This store is more than just a business to us, it is our passion, it is our love for food. We wanted hundreds and thousands to benefit from our efforts. There are no middle-men, we personally reach places and supervise the processes. We work to a standard, and not to a price.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid bg-white py-3 py-lg-5">
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