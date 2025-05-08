import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
            <div className="container py-5">
                <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(226, 175, 24, 0.5)' }}>
                    <div className="row g-4">
                        <div className="col-lg-3">
                            <a href="/">
                                <img src="/img/ifs-logo-1.png" alt="" className="display-6" style={{ width: '210px' }} />
                            </a>
                        </div>
                        <div className="col-lg-6">
                            {/* <div className="position-relative mx-auto">
                                <input className="form-control border-0 w-100 py-3 px-4 rounded-pill" type="number" placeholder="Your Email" />
                                <button type="submit" className="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white" style={{ top: '0', right: '0' }}>Subscribe Now</button>
                            </div> */}
                        </div>
                        <div className="col-lg-3">
                            <div className="d-flex justify-content-end pt-3">
                                <a className="btn  btn-outline-secondary me-2 btn-md-square rounded-circle" target='_blank' href="https://x.com/"><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" target='_blank' href="https://facebook.com"><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" target='_blank' href="https://youtube.com"><i className="fab fa-youtube"></i></a>
                                <a className="btn btn-outline-secondary btn-md-square rounded-circle" target='_blank' href="https://linkedin.com"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-item">
                            <h4 className="text-light mb-3">Why People Like us!</h4>
                            <p className="mb-4">typesetting, remaining essentially unchanged. It was
                                popularised in the 1960s with the like Aldus PageMaker including of Lorem Ipsum.</p>
                            <a href="" className="btn border-secondary py-2 px-4 rounded-pill text-primary">Read More</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex flex-column text-start footer-item">
                            <h4 className="text-light mb-3">Shop Info</h4>
                            <a className="btn-link" href="">About Us</a>
                            <Link to={'/contact'} className="btn-link">Contact Us</Link>
                            <Link to={'/privacy-policy'} className="btn-link">Privacy Policy</Link>
                            <Link to={'/terms-and-conditions'} className="btn-link">Terms & Condition</Link>
                            <a className="btn-link" href="">Return Policy</a>
                            <a className="btn-link" href="">FAQs & Help</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex flex-column text-start footer-item">
                            <h4 className="text-light mb-3">Account</h4>
                            <Link to={'/dashboard/my-profile'} className="btn-link">My Account</Link>
                            <Link to={'/orders'} className="btn-link">Shop details</Link>
                            <Link to={'/cart'} className="btn-link">Shopping Cart</Link>
                            <a className="btn-link" href="">Wishlist</a>
                            <Link to={'/orders'} className="btn-link">Order History</Link>
                            <a className="btn-link" href="">International Orders</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-item">
                            <h4 className="text-light mb-3">Contact</h4>
                            <a className='btn-link' href="">Address: 1429 Netus Rd, NY 48247</a> <br />
                            <a className='btn-link' href="mailto:user@example.com">Email: Example@gmail.com</a> <br />
                            <a className='btn-link' href="tel:+1234567890">Phone: +0123 4567 8910</a> <br />
                            <a className='btn-link'>Payment Accepted</a> <br />
                            <img src="img/payment.png" className="img-fluid" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;