import { useEffect, useState } from "react";
import Header from "../include/header";
import Footer from "../include/footer";
import Spinner from "../include/spinner";
import { Helmet } from "react-helmet";
import SearchModel from "../include/searchModel";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import FeaturedProducts from "./order/featuredProducts";
import CategoriesGroup from "./order/categoriesGroup";
import ReviewForm from "./order/reviewForm";
import Reviews from "./order/reviews";
import { useAuth } from "../../context/AuthContext";

const ProductDetails = () =>{

    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState(null);
    let {slug} = useParams();
    const {user} =useAuth();

    const pageData = async ()=>{
        let response = await axios.get('https://api.indiafoodshop.com/admin/get-product/'+slug);
        console.log(response.data[0]);        
        setProductDetails(response.data[0]);
        setLoading(false); 

    }

    useEffect(() => {
      pageData();    
        
    }, []);

    return (
        <>  
            { productDetails ? 
            <>
                         <Helmet>
                <title>{productDetails.meta_title} | India Food Shop</title>                
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>
                {
                    loading? <Spinner /> : ''
                }
            <Header />
            <SearchModel />


                {/* Single Page Header start */}
                <div class="container-fluid page-header py-5">
                    <h1 class="text-center text-white display-6">{productDetails.name}</h1>
                    <ol class="breadcrumb justify-content-center mb-0">
                        <li class="breadcrumb-item"><Link to={'/'}>Home</Link></li>
                        <li class="breadcrumb-item"><Link to={'/products'}>Products</Link></li>
                        {/* <li class="breadcrumb-item active text-white">{productDetails.name}</li> */}
                    </ol>
                </div>
                {/* Single Page Header End */}


                {/* Single Product Start */}
                <div class="container-fluid py-5 mt-1">
                    <div class="container py-5">
                        <div class="row g-4 mb-5">
                            <div class="col-lg-8 col-xl-9">
                                <div class="row g-4">
                                    <div class="col-lg-6">
                                        <div class="rounded">                                        
                                            <img src={'https://api.indiafoodshop.com'+productDetails.image} class="border img-fluid rounded" alt="Image" />                                           
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <h4 class="fw-bold mb-3">{productDetails.name}</h4>
                                        <p class="mb-3">Category: {productDetails.category}</p>
                                        <h5 class="fw-bold mb-3">3,35 $</h5>
                                        <div class="d-flex mb-4">
                                            <i class="fa fa-star text-secondary"></i>
                                            <i class="fa fa-star text-secondary"></i>
                                            <i class="fa fa-star text-secondary"></i>
                                            <i class="fa fa-star text-secondary"></i>
                                            <i class="fa fa-star"></i>
                                        </div>
                                        {/* <p class="mb-4">{productDetails.description}</p>                                         */}
                                        <div class="input-group quantity mb-5" style={{width: '100px'}}>
                                            <div class="input-group-btn">
                                                <button class="btn btn-sm btn-minus rounded-circle bg-light border" >
                                                    <i class="fa fa-minus"></i>
                                                </button>
                                            </div>
                                            <input type="text" class="form-control form-control-sm text-center border-0" value="1" />
                                            <div class="input-group-btn">
                                                <button class="btn btn-sm btn-plus rounded-circle bg-light border">
                                                    <i class="fa fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <a href="#" class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                    </div>
                                    <div class="col-lg-12">
                                        <nav>
                                            <div class="nav nav-tabs mb-3">
                                                <button class="nav-link active border-white border-bottom-0" type="button" role="tab"
                                                    id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about"
                                                    aria-controls="nav-about" aria-selected="true">Description</button>
                                                <button class="nav-link border-white border-bottom-0" type="button" role="tab"
                                                    id="nav-mission-tab" data-bs-toggle="tab" data-bs-target="#nav-mission"
                                                    aria-controls="nav-mission" aria-selected="false">Reviews</button>
                                            </div>
                                        </nav>
                                        <div class="tab-content mb-5">
                                            <div class="tab-pane active" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                                                <p>{productDetails.description}</p>                                               
                                                <div class="px-2">
                                                    <div class="row g-4">
                                                        <div class="col-6">
                                                            <div class="row bg-light align-items-center text-center justify-content-center py-2">
                                                                <div class="col-6">
                                                                    <p class="mb-0">Weight</p>
                                                                </div>
                                                                <div class="col-6">
                                                                    <p class="mb-0">1 kg</p>
                                                                </div>
                                                            </div>
                                                            <div class="row text-center align-items-center justify-content-center py-2">
                                                                <div class="col-6">
                                                                    <p class="mb-0">Country of Origin</p>
                                                                </div>
                                                                <div class="col-6">
                                                                    <p class="mb-0">Agro Farm</p>
                                                                </div>
                                                            </div>
                                                            <div class="row bg-light text-center align-items-center justify-content-center py-2">
                                                                <div class="col-6">
                                                                    <p class="mb-0">Quality</p>
                                                                </div>
                                                                <div class="col-6">
                                                                    <p class="mb-0">Organic</p>
                                                                </div>
                                                            </div>
                                                            <div class="row text-center align-items-center justify-content-center py-2">
                                                                <div class="col-6">
                                                                    <p class="mb-0">Сheck</p>
                                                                </div>
                                                                <div class="col-6">
                                                                    <p class="mb-0">Healthy</p>
                                                                </div>
                                                            </div>
                                                            <div class="row bg-light text-center align-items-center justify-content-center py-2">
                                                                <div class="col-6">
                                                                    <p class="mb-0">Min Weight</p>
                                                                </div>
                                                                <div class="col-6">
                                                                    <p class="mb-0">250 Kg</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                                                
                                                <Reviews />
                                        
                                            </div>
                                            <div class="tab-pane" id="nav-vision" role="tabpanel">
                                                <p class="text-dark">Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam
                                                    amet diam et eos labore. 3</p>
                                                <p class="mb-0">Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore.
                                                    Clita erat ipsum et lorem et sit</p>
                                            </div>
                                        </div>
                                    </div>
                                    {user ? (
                                         <ReviewForm />
                                                  ) : (
                                                     <p className="text-center mt-10">Please log in to leave a review.</p>
                                          )}
                                </div>
                            </div>
                            <div class="col-lg-4 col-xl-3">
                                <div class="row g-4 fruite">
                                    <div class="col-lg-12">
                                        {/* <div class="input-group w-100 mx-auto d-flex mb-4">
                                            <input type="search" class="form-control p-3" placeholder="keywords" aria-describedby="search-icon-1" />
                                            <span id="search-icon-1" class="input-group-text p-3"><i class="fa fa-search"></i></span>
                                        </div> */}
                                        <div class="mb-4">
                                            <h4>Categories</h4>
                                            <CategoriesGroup/>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <h4 class="mb-4">Featured products</h4>

                                        <FeaturedProducts />

                                    </div>
                                    <div class="col-lg-12">
                                        <div class="position-relative">
                                            <img src="/img/banner-fruits.jpg" class="img-fluid w-100 rounded" alt="" />
                                            <div class="position-absolute" style={{top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
                                                <h3 class="text-secondary fw-bold">Fresh </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <h1 class="fw-bold mb-0">Related products</h1> */}
                        {/* <div class="vesitable">
                            <div class="owl-carousel vegetable-carousel justify-content-center">
                                <div class="border border-primary rounded position-relative vesitable-item">
                                    <div class="vesitable-img">
                                        <img src="img/vegetable-item-6.jpg" class="img-fluid w-100 rounded-top" alt="" />
                                    </div>
                                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>Vegetable</div>
                                    <div class="p-4 pb-0 rounded-bottom">
                                        <h4>Parsely</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                        <div class="d-flex justify-content-between flex-lg-wrap">
                                            <p class="text-dark fs-5 fw-bold">$4.99 / kg</p>
                                            <a href="#" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="border border-primary rounded position-relative vesitable-item">
                                    <div class="vesitable-img">
                                        <img src="img/vegetable-item-1.jpg" class="img-fluid w-100 rounded-top" alt="" />
                                    </div>
                                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>Vegetable</div>
                                    <div class="p-4 pb-0 rounded-bottom">
                                        <h4>Parsely</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                        <div class="d-flex justify-content-between flex-lg-wrap">
                                            <p class="text-dark fs-5 fw-bold">$4.99 / kg</p>
                                            <a href="#" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="border border-primary rounded position-relative vesitable-item">
                                    <div class="vesitable-img">
                                        <img src="img/vegetable-item-3.png" class="img-fluid w-100 rounded-top bg-light" alt="" />
                                    </div>
                                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>Vegetable</div>
                                    <div class="p-4 pb-0 rounded-bottom">
                                        <h4>Banana</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                        <div class="d-flex justify-content-between flex-lg-wrap">
                                            <p class="text-dark fs-5 fw-bold">$7.99 / kg</p>
                                            <a href="#" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="border border-primary rounded position-relative vesitable-item">
                                    <div class="vesitable-img">
                                        <img src="img/vegetable-item-4.jpg" class="img-fluid w-100 rounded-top" alt="" />
                                    </div>
                                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>Vegetable</div>
                                    <div class="p-4 pb-0 rounded-bottom">
                                        <h4>Bell Papper</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                        <div class="d-flex justify-content-between flex-lg-wrap">
                                            <p class="text-dark fs-5 fw-bold">$7.99 / kg</p>
                                            <a href="#" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="border border-primary rounded position-relative vesitable-item">
                                    <div class="vesitable-img">
                                        <img src="img/vegetable-item-5.jpg" class="img-fluid w-100 rounded-top" alt="" />
                                    </div>
                                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>Vegetable</div>
                                    <div class="p-4 pb-0 rounded-bottom">
                                        <h4>Potatoes</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                        <div class="d-flex justify-content-between flex-lg-wrap">
                                            <p class="text-dark fs-5 fw-bold">$7.99 / kg</p>
                                            <a href="#" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="border border-primary rounded position-relative vesitable-item">
                                    <div class="vesitable-img">
                                        <img src="img/vegetable-item-6.jpg" class="img-fluid w-100 rounded-top" alt="" />
                                    </div>
                                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>Vegetable</div>
                                    <div class="p-4 pb-0 rounded-bottom">
                                        <h4>Parsely</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                        <div class="d-flex justify-content-between flex-lg-wrap">
                                            <p class="text-dark fs-5 fw-bold">$7.99 / kg</p>
                                            <a href="#" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="border border-primary rounded position-relative vesitable-item">
                                    <div class="vesitable-img">
                                        <img src="img/vegetable-item-5.jpg" class="img-fluid w-100 rounded-top" alt="" />
                                    </div>
                                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>Vegetable</div>
                                    <div class="p-4 pb-0 rounded-bottom">
                                        <h4>Potatoes</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                        <div class="d-flex justify-content-between flex-lg-wrap">
                                            <p class="text-dark fs-5 fw-bold">$7.99 / kg</p>
                                            <a href="#" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="border border-primary rounded position-relative vesitable-item">
                                    <div class="vesitable-img">
                                        <img src="img/vegetable-item-6.jpg" class="img-fluid w-100 rounded-top" alt="" />
                                    </div>
                                    <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>Vegetable</div>
                                    <div class="p-4 pb-0 rounded-bottom">
                                        <h4>Parsely</h4>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                        <div class="d-flex justify-content-between flex-lg-wrap">
                                            <p class="text-dark fs-5 fw-bold">$7.99 / kg</p>
                                            <a href="#" class="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
                {/* Single Product End */}
            <Footer />
            </> 
            
            : 

            <>
                <Spinner />
            </>
            }

        </>
    )
}

export default ProductDetails;