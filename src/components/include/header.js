import { Link, NavLink } from "react-router-dom";
import Cart from "./cart";
import LoginOrAvatar from "./loginOrAvatar";
import Flag from "react-world-flags";
import { useCountry } from "../../context/CountryContext"; // Import the context hook

const Header = ({ onCountryChange }) => {
    const { selectedCountryId, handleCountryChange } = useCountry(); // Access country context
    const countriesWithFlags = [
        { name: "India", flag: "🇮🇳", code: "IN", country_id: "67f5728b4722503b112dbd2b" },
        { name: "USA", flag: "🇺🇸", code: "US", country_id: "67f5730cedfb59d6772ed0d5" },
        { name: "UK", flag: "🇬🇧", code: "GB", country_id: "67f5731cedfb59d6772ed0db" },
        { name: "Australia", flag: "🇦🇺", code: "AU", country_id: "67f57335edfb59d6772ed0e1" },
        { name: "UAE", flag: "🇦🇪", code: "AE", country_id: "67f57356edfb59d6772ed0eb" },
        { name: "Singapore", flag: "🇸🇬", code: "SG", country_id: "67f57347edfb59d6772ed0e5" },
    ];

    // Handle country change
    const handleCountrySelect = (country) => {
        handleCountryChange(country.country_id); // Update country in context
        if (onCountryChange) {
            onCountryChange(country.country_id); // Optionally pass to parent component
        }
    };

    // Find the selected country object based on selectedCountryId from context
    const selectedCountry = countriesWithFlags.find(country => country.country_id === selectedCountryId);

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
                        <Link to={'/terms-and-conditions'} className="text-white"><small className="text-white mx-2">Terms and Conditions</small></Link>
                    </div>
                </div>
            </div>
            <div className="container px-0">
                <nav className="navbar navbar-light bg-white navbar-expand-xl">
                    <NavLink to={'/'} className="navbar-brand">
                        <img src="/img/ifs-logo-1.png" alt="" className="display-6" style={{ width: '270px' }} />
                    </NavLink>

                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-primary"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <NavLink to={'/'} className="nav-item nav-link active">
                                Home
                            </NavLink>
                            <NavLink to={'/aboutus'} className="nav-item nav-link active">
                                About Us
                            </NavLink>
                            <NavLink to={'/categories'} className="nav-item nav-link">
                                Categories
                            </NavLink>
                            <NavLink to={'/products'} className="nav-item nav-link">
                                Products
                            </NavLink>
                            <NavLink to={'/contact'} className="nav-item nav-link">Contact</NavLink>
                        </div>
                        <div className="d-flex align-items-center">
                            {/* Custom Country Dropdown */}
                            <div className="dropdown me-3">
                                <button
                                    className="btn dropdown-toggle d-flex align-items-center"
                                    type="button"
                                    id="countryDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <Flag code={selectedCountry.code} style={{ width: '24px', height: '18px' }} />
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="countryDropdown">
                                    {countriesWithFlags.map((country) => (
                                        <li key={country.code}>
                                            <button
                                                className="dropdown-item d-flex align-items-center"
                                                onClick={() => handleCountrySelect(country)} // Update selected country
                                            >
                                                <Flag code={country.code} style={{ width: '20px', height: '15px', marginRight: '8px' }} />
                                                {country.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="d-flex m-3 me-0">
                            <Cart />
                            <LoginOrAvatar />
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;
