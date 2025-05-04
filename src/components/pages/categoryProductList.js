import { useEffect, useState } from "react";
import Header from "../include/header";
import Footer from "../include/footer";
import Spinner from "../include/spinner";
import { Helmet } from "react-helmet";
import SearchModel from "../include/searchModel";
import {  useParams } from "react-router-dom";
import FeaturedProducts from "./order/featuredProducts";
import CategoriesGroup from "./order/categoriesGroup";
import CategoryProductListComponent from "./order/categoryProductList";
import Banner from "./order/banner";

const CategoryProductList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [loading, setLoading] = useState(true);
    let { id } = useParams();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);


    return (
        <>
            <Helmet>
                <title>Products List | India Food Shop</title>
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
                <link href="/external-assets/css/style.css" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
            </Helmet>
            {
                loading ? <Spinner /> : ''
            }

            <Header />
            <SearchModel />

            <div class="container-fluid page-header py-5">
                <h1 class="text-center text-white display-6">Products</h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><a href={'/'}>Home</a></li>
                    <li class="breadcrumb-item"><a href={'/products'}>Products</a></li>
                    <li class="breadcrumb-item active text-white">Shop</li>
                </ol>
            </div>


            <div class="container-fluid fruite py-5">
                <div class="container py-5">
                    <div class="row g-4">
                        <div class="col-lg-12">
                            <div class="row g-4 mb-5">
                                <div className="col-lg-12 d-flex justify-content-between align-items-center flex-wrap">
                                    <h1 className="mb-0">Category Products</h1>
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
                            <div class="row g-4">
                                {/* Products List Start */}
                                <div class="col-lg-9">
                                    <div class="row g-4 justify-content-center">


                                        <CategoryProductListComponent
                                            categoryId={id}
                                            searchTerm={searchTerm}
                                            sortOption={sortOption}
                                        />
                                    </div>
                                </div>
                                {/* Products List End */}

                                <div className="col-lg-3" style={{ maxWidth: '300px' }}>
                                    <div class="row g-4">
                                        <div className="col-12 ms-auto">
                                            <div class="bg-light ps-3 py-3 rounded d-flex justify-content-between align-items-center mb-4">
                                                <label for="fruits">Sort By:</label>
                                                <select form="fruitform"
                                                    id="fruits"
                                                    name="fruitlist"
                                                    className="border-0 form-select-sm bg-light me-3"
                                                    value={sortOption}
                                                    onChange={(e) => setSortOption(e.target.value)}>
                                                    <option value="default">Default</option>
                                                    <option value="az">A-Z</option>
                                                    <option value="za">Z-A</option>
                                                    <option value="priceLowHigh">Price: Low to High</option>
                                                    <option value="priceHighLow">Price: High to Low</option>
                                                </select>
                                            </div>

                                        </div>
                                        {/* CategoriesGroup */}
                                        <CategoriesGroup />

                                        {/* <div class="col-lg-12">
                                            <div class="mb-3">
                                                <h4>Additional</h4>
                                                <div class="mb-2">
                                                    <input type="radio" class="me-2" id="Categories-1" name="Categories-1" value="Beverages" />
                                                    <label for="Categories-1"> Organic</label>
                                                </div>
                                                <div class="mb-2">
                                                    <input type="radio" class="me-2" id="Categories-2" name="Categories-1" value="Beverages" />
                                                    <label for="Categories-2"> Fresh</label>
                                                </div>
                                                <div class="mb-2">
                                                    <input type="radio" class="me-2" id="Categories-3" name="Categories-1" value="Beverages" />
                                                    <label for="Categories-3"> Sales</label>
                                                </div>
                                                <div class="mb-2">
                                                    <input type="radio" class="me-2" id="Categories-4" name="Categories-1" value="Beverages" />
                                                    <label for="Categories-4"> Discount</label>
                                                </div>
                                                <div class="mb-2">
                                                    <input type="radio" class="me-2" id="Categories-5" name="Categories-1" value="Beverages" />
                                                    <label for="Categories-5"> Expired</label>
                                                </div>
                                            </div>
                                        </div> */}
                                        <FeaturedProducts />
                                        {/* Banner */}
                                        <Banner />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
            <Footer />
        </>
    );
}

export default CategoryProductList;