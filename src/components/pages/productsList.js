import { useEffect, useState } from "react";
import Footer from "../include/footer";
import Spinner from "../include/spinner";
import { Helmet } from "react-helmet";
import SearchModel from "../include/searchModel";
import ProductListComponent from "./order/productList";
import FeaturedProducts from "./order/featuredProducts";
import CategoriesGroup from "./order/categoriesGroup";
import { useCountry } from "../../context/CountryContext";

const ProductList = () =>{

    const [loading, setLoading] = useState(true);
    const { selectedCountryId } = useCountry();

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
            </Helmet>
            {
               loading? <Spinner /> : ''
            }
            
            <SearchModel />     

            <div class="container-fluid page-header py-5">
                <h1 class="text-center text-white display-6">Products</h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><a href={'/'}>Home</a></li>                    
                    <li class="breadcrumb-item active text-white">Products</li>
                </ol>
            </div>


            <div class="container-fluid fruite py-5">
                <div class="container py-5">
                    <h1 class="mb-4">All Products</h1>
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
                                {/* Products List Start */}
                                <div class="col-lg-9">
                                    <div class="row g-4 justify-content-center">
                                        <ProductListComponent selectedCountryId={selectedCountryId}/>
                                    </div>
                                </div>
                                {/* Products List End */}

                                <div class="col-lg-3">
                                    <div class="row g-4">
                                        <div class="col-lg-12">
                                            <div class="mb-3">
                                                <h4>Categories</h4>
                                                <CategoriesGroup/>
                                            </div>
                                        </div>
                                        {/* <div class="col-lg-12">
                                            <div class="mb-3">
                                                <h4 class="mb-2">Price</h4>
                                                <input type="range" class="form-range w-100" id="rangeInput" name="rangeInput" min="0" max="500" value="0" oninput="amount.value=rangeInput.value" />
                                                <output id="amount" name="amount" min-velue="0" max-value="500" for="rangeInput">0</output>
                                            </div>
                                        </div> */}
                                        <div class="col-lg-12">
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
                                        </div>
                                        <FeaturedProducts/>
                                        <div class="col-lg-12">
                                            <div class="position-relative">
                                                <img src="img/banner-fruits.jpg" class="img-fluid w-100 rounded" alt="" />
                                                <div class="position-absolute" style={{top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
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
    );
}

export default ProductList;