import { Helmet } from "react-helmet"
import Footer from "../include/footer"
import Spinner from "../include/spinner"
import { useEffect, useState } from "react"
import SearchModel from "../include/searchModel"
import { Link } from "react-router-dom"

const NotFound = ()=>{

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false); 
      }, 100);
  
      return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Helmet>
                <title>404 Not Found | India Food Shop</title>                
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>
                {
                    loading? <Spinner /> : ''
                }

                {/* <!-- Single Page Header start --> */}
                <div class="container-fluid page-header py-5">
                    <h1 class="text-center text-white display-6">404 Error</h1>
                    <ol class="breadcrumb justify-content-center mb-0">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item"><a href="#">Pages</a></li>
                        <li class="breadcrumb-item active text-white">404</li>
                    </ol>
                </div>
                {/* <!-- Single Page Header End --> */}

                {/* <!-- 404 Start --> */}
                <div class="container-fluid py-5">
                    <div class="container py-5 text-center">
                        <div class="row justify-content-center">
                            <div class="col-lg-6">
                                <i class="bi bi-exclamation-triangle display-1 text-secondary"></i>
                                <h1 class="display-1">404</h1>
                                <h1 class="mb-4">Page Not Found</h1>
                                <p class="mb-4">We're sorry, the page you have looked for does not exist in our website! Maybe go to our home page or try to use a search?</p>
                                <Link class="btn border-secondary rounded-pill py-3 px-5" to={'/'}>Go Back To Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- 404 End --> */}

            <Footer />
        </>
    )
}

export default NotFound;