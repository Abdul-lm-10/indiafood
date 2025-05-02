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

const Categories = () => {

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { selectedCountryId } = useCountry();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 1;

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
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);


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

                                        {/* <CategoriesListComponent filteredCategories={filteredCategories} /> */}
                                        {/* <div class="col-12">
                                            <div class="pagination d-flex justify-content-center mt-5">
                                                <a href="#" class="rounded">&laquo;</a>
                                                <a href="#" class="active rounded">1</a>
                                                <a href="#" class="rounded">2</a>
                                                <a href="#" class="rounded">3</a>
                                                <a href="#" class="rounded">4</a>
                                                <a href="#" class="rounded">5</a>
                                                <a href="#" class="rounded">6</a>
                                                <a href="#" class="rounded">&raquo;</a>
                                            </div>
                                        </div> */}
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
                                        {/* Sorting Dropdown (Now in Sidebar) */}
                                        <div className="col-lg-12">
                                            <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between align-items-center">
                                                <label htmlFor="fruits" className="mb-0">Sort:</label>
                                                <select
                                                    id="fruits"
                                                    name="fruitlist"
                                                    className="border-0 form-select-sm bg-light me-3"
                                                    form="fruitform"
                                                >
                                                    <option value="volvo">Nothing</option>
                                                    <option value="saab">Popularity</option>
                                                    <option value="opel">Organic</option>
                                                    <option value="audi">Fantastic</option>
                                                </select>
                                            </div>
                                        </div>


                                        {/* Categories List */}
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                <h4>Categories</h4>
                                                <ul className="list-unstyled fruite-categorie">
                                                    {categories.map((category) => (
                                                        <li key={category._id}>
                                                            <div className="d-flex justify-content-between fruite-name">
                                                                <a href="#">
                                                                    <i className="fas fa-apple-alt me-2"></i>
                                                                    {category.name}
                                                                </a>
                                                                <span>(3)</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>


                                        {/* Featured Products */}
                                        <div className="col-lg-12">
                                            <h4 className="mb-3">Featured products</h4>
                                            {Array.isArray(products) && products.slice(0, 4).map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="d-flex align-items-center justify-content-start mb-3"
                                                >
                                                    <div
                                                        className="rounded me-4"
                                                        style={{ width: '100px', height: '100px' }}
                                                    >
                                                        <img
                                                            src={`https://api.indiafoodshop.com${product.image}`}
                                                            className="img-fluid rounded"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-2">{product.name}</h6>
                                                        <div className="d-flex mb-2">
                                                            {[1, 2, 3, 4].map((_, i) => (
                                                                <i key={i} className="fa fa-star text-secondary"></i>
                                                            ))}
                                                            <i className="fa fa-star"></i>
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            {product.prices.map((item, idx) => (
                                                                <p key={idx} className="text-dark fs-6 mb-0">
                                                                    ₹{item.price} / {item.quantity}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="d-flex justify-content-center my-4">
                                                <a
                                                    href="#"
                                                    className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100"
                                                >
                                                    View More
                                                </a>
                                            </div>
                                        </div>

                                        {/* Banner */}
                                        <div className="col-lg-12">
                                            <div className="position-relative">
                                                <img
                                                    src="img/banner-fruits.jpg"
                                                    className="img-fluid w-100 rounded"
                                                    alt=""
                                                />
                                                <div
                                                    className="position-absolute"
                                                    style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                                                >
                                                    <h3 className="text-secondary fw-bold">Fresh Banner</h3>
                                                </div>
                                            </div>
                                        </div>
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