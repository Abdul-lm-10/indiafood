import { Link, NavLink } from "react-router-dom";
import Cart from "./cart";
import LoginOrAvatar from "./loginOrAvatar";

const Header = ()=>{
    return (
        <div className="container-fluid fixed-top">
            <div className="container topbar bg-primary d-none d-lg-block">
                <div className="d-flex justify-content-between">
                    <div className="top-info ps-2">
                        <small className="me-3"><i className="fa fa-phone-alt me-2 text-secondary"></i> <a href="tel:+91 9767834349" className="text-white">+91 9767834349</a></small>
                        <small className="me-3"><i className="fas fa-envelope me-2 text-secondary"></i><a href="mailto:support@indiafoodshop.com" className="text-white">support@indiafoodshop.com</a></small>
                    </div>
                    <div className="top-link pe-2">
                        <Link to={'/privacy-policy'} className="text-white"><small className="text-white mx-2">Privacy Policy</small>/</Link>
                        <Link to={'/terms-and-conditions'}className="text-white"><small className="text-white mx-2">Terms and Conditions</small></Link>
                        {/* <a href="#" className="text-white"><small className="text-white ms-2">Sales and Refunds</small></a> */}
                    </div>
                </div>
            </div>
            <div className="container px-0">
                <nav className="navbar navbar-light bg-white navbar-expand-xl">
                    {/* <a href="index.html" className="navbar-brand">                        
                        <h1 className="text-primary display-6">Fruitables</h1>
                    </a> */}
                    <NavLink to={'/'} className="navbar-brand">
                        <img src="/img/ifs-logo-1.png" alt="" class="display-6" style={{width:'270px'}} />
                    </NavLink>

                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-primary"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <NavLink to={'/'} className="nav-item nav-link active"> 
                                Home
                            </NavLink>
                            {/* <a href="shop.html" className="nav-item nav-link">Shop</a> */}
                            <NavLink to={'/categories'} className="nav-item nav-link"> 
                                Categories
                            </NavLink>
                            <NavLink to={'/products'} className="nav-item nav-link"> 
                                Products
                            </NavLink>
                            <a href="shop-detail.html" className="nav-item nav-link">Shop Detail</a>

                            {/* <div className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                                <div className="dropdown-menu m-0 bg-secondary rounded-0">
                                    <a href="cart.html" className="dropdown-item">Cart</a>
                                    <a href="chackout.html" className="dropdown-item">Chackout</a>
                                    <a href="testimonial.html" className="dropdown-item">Testimonial</a>
                                    <a href="404.html" className="dropdown-item">404 Page</a>
                                </div>
                            </div> */}

                            <NavLink to={'/contact'} className="nav-item nav-link">Contact</NavLink>
                        </div>
                        <div className="d-flex m-3 me-0">                           
                            <Cart />
                            <LoginOrAvatar />
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Header;