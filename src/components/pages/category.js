import { useEffect, useState } from "react";
import Footer from "../include/footer";
import Spinner from "../include/spinner";
import { Helmet } from "react-helmet";
import SearchModel from "../include/searchModel";
import { Link } from "react-router-dom";
import CategoriesListComponent from "./order/categriesList";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useCountry } from "../../context/CountryContext";
import FeaturedProducts from "./order/featuredProducts";
import CategoriesGroup from "./order/categoriesGroup";
import Banner from "./order/banner";


const Categories = () => {

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { selectedCountryId } = useCountry();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 6;

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
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://api.indiafoodshop.com/admin/products-by-country?country_id=${selectedCountryId}`);
                const data = await res.json();
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
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);


    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    //Pagination Logic
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>

            <Helmet>
                <title>Category List | India Food Shop</title>
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />

            </Helmet>
            {
                loading ? <Spinner /> : ''
            }

            <SearchModel />

            <div class="container-fluid page-header py-5">
                <h1 class="text-center text-white display-6">Categories</h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><Link to={'/'}>Home</Link></li>
                    <li class="breadcrumb-item active text-white">Categories</li>
                </ol>
            </div>

            <div class="container-fluid fruite py-5">
                <div class="container py-5">
                    <div className="row g-4">
                        <div className="col-lg-12">
                            <div className="row g-4">
                                <div className="row mb-4">
                                    <div className="col-12 d-flex justify-content-between align-items-center flex-wrap">
                                        <h1 className="mb-0">Choose by Categories</h1>
                                        <div className="input-group" style={{ maxWidth: '300px' }}>
                                            <input
                                                type="search"
                                                className="form-control p-3"
                                                placeholder="keywords"
                                                aria-describedby="search-icon-1"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <span id="search-icon-1" className="input-group-text p-3">
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6"></div>
                            </div>
                            <div class="row g-4">
                                <div class="col-lg-9">
                                    <div class="row g-4 justify-content-center">
                                        <CategoriesListComponent filteredCategories={currentCategories} />

                                    </div>

                                    {/* Pagination block OUTSIDE of category row */}
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="pagination d-flex justify-content-center mt-4">
                                                <nav>
                                                    <ul className="pagination d-flex flex-row g-5" style={{ gap: '10px' }}>
                                                        {pageNumbers.map((number) => (
                                                            <li
                                                                key={number}
                                                                className={`page-item ${currentPage === number ? 'active' : ''}`}
                                                            >
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => handlePageClick(number)}
                                                                >
                                                                    {number}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3" style={{ maxWidth: '300px' }}>
                                    <div className="row g-4">
                                        {/* Categories List */}
                                        <CategoriesGroup />
                                        {/* Featured Products */}
                                        <FeaturedProducts />

                                        {/* Banner */}
                                        <Banner/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div >
                </div >
            </div >
            <Footer />
        </>
    )
}


export default Categories;