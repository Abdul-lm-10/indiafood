import { Helmet } from "react-helmet"
import Footer from "../../include/footer"
import Spinner from "../../include/spinner"
import { useEffect, useState } from "react"
import SearchModel from "../../include/searchModel"
import { Link } from "react-router-dom"
import Signup from "./signUp"
import Login from "./logIn"

const AuthPage = () =>{

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
                <title>Login | India Food Shop</title>                
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>
                {
                    loading? <Spinner /> : ''
                }
           
            <SearchModel />
               
            {/* <!-- Single Page Header start --> */}
            <div class="container-fluid page-header py-5">
                <h1 class="text-center text-white display-6">Login</h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><Link to={'/'}>Home</Link></li>
                    {/* <li class="breadcrumb-item"><a href="#">Pages</a></li> */}
                    <li class="breadcrumb-item active text-white">Login</li>
                </ol>
            </div>
            {/* <!-- Single Page Header End --> */}

            <div class="container-fluid contact">
                    <div class="container py-5">
                        <div class="bg-light rounded">
                            <div class="row g-4">
                                <div class="col-md-6 col-lg-6 col-12" style={{margin: 'auto'}}>
                                <div class="container mt-3 mb-3">
                                    {/* <!-- Tabs for Login and Signup --> */}

                                    <ul class="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link active" id="pills-login-tab" data-bs-toggle="pill" data-bs-target="#pills-login" type="button" role="tab" aria-controls="pills-login" aria-selected="true">Login</button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="pills-signup-tab" data-bs-toggle="pill" data-bs-target="#pills-signup" type="button" role="tab" aria-controls="pills-signup" aria-selected="false">Signup</button>
                                    </li>
                                    </ul>

                                    {/* <!-- Tab Content for Login and Signup Forms --> */}
                                    <div class="tab-content" id="pills-tabContent">
                                        {/* <!-- Login Form --> */}
                                        <Login />

                                        {/* <!-- Signup Form --> */}
                                        <Signup />
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

export default AuthPage;