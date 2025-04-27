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
                    <h1 class="mb-4">Choose by Categories</h1>
                    <div class="row g-4">
                        <div class="col-lg-12">
                            <div class="row g-4">
                                <div class="col-xl-3">
                                    <div class="input-group w-100 mx-auto d-flex">
                                        <input type="search" class="form-control p-3" placeholder="keywords" aria-describedby="search-icon-1" />
                                        <span id="search-icon-1" class="input-group-text p-3"><i class="fa fa-search"></i></span>
                                    </div>
                                </div>
                                <div class="col-6"></div>
                                <div class="col-xl-3">
                                    <div class="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                        <label for="fruits">Default Sorting:</label>
                                        <select id="fruits" name="fruitlist" class="border-0 form-select-sm bg-light me-3" form="fruitform">
                                            <option value="volvo">Nothing</option>
                                            <option value="saab">Popularity</option>
                                            <option value="opel">Organic</option>
                                            <option value="audi">Fantastic</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-4">
                                <div class="col-lg-9">
                                    <div class="row g-4 justify-content-center">

                                        <CategoriesListComponent />

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
                                </div>
                                <div class="col-lg-3">
                                    <div class="row g-4">
                                        <div class="col-lg-12">
                                            <div class="mb-3">
                                                <h4>Categories</h4>
                                                <ul class="list-unstyled fruite-categorie">
                                                    {categories.map((category) => (
                                                        <li>
                                                            <div class="d-flex justify-content-between fruite-name">
                                                                <a href="#"><i class="fas fa-apple-alt me-2"></i>{category.name}</a>
                                                                <span>(3)</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div class="col-lg-12">
                                            <h4 class="mb-3">Featured products</h4>
                                            {Array.isArray(products) &&  products.slice(0, 4).map((product) => (
                                                <div class="d-flex align-items-center justify-content-start">
                                                    <div class="rounded me-4" style={{ width: '100px', height: '100px' }}>
                                                        <img src={`https://api.indiafoodshop.com${product.image}`} class="img-fluid rounded" alt="" />
                                                    </div>
                                                    <div>
                                                        <h6 class="mb-2">{product.name}</h6>
                                                        <div class="d-flex mb-2">
                                                            <i class="fa fa-star text-secondary"></i>
                                                            <i class="fa fa-star text-secondary"></i>
                                                            <i class="fa fa-star text-secondary"></i>
                                                            <i class="fa fa-star text-secondary"></i>
                                                            <i class="fa fa-star"></i>
                                                        </div>
                                                        <div class="d-flex mb-2">
                                                            <h5 class="fw-bold me-2">{product.prices.map((item, idx) => (
                                                                <p key={idx} className="text-dark fs-6 mb-0">
                                                                    ₹{item.price} / {item.quantity}
                                                                </p>
                                                            ))}</h5>
                                                            {/* <h5 class="text-danger text-decoration-line-through">4.11 $</h5> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div class="d-flex justify-content-center my-4">
                                                <a href="#" class="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100">View More</a>
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="position-relative">
                                                <img src="img/banner-fruits.jpg" class="img-fluid w-100 rounded" alt="" />
                                                <div class="position-absolute" style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
                                                    <h3 class="text-secondary fw-bold">Fresh Banner</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export default Categories;