import { Helmet } from "react-helmet"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../../../include/footer"
import Header from "../../../include/header"
import Spinner from "../../../include/spinner"
import SearchModel from "../../../include/searchModel"

const EditProfile = () =>{

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
                <title>Edit Profile | User Dashboard</title>                
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
               
            {/* <!-- Single Page Header start --> */}
            <div class="container-fluid page-header py-5">
                <h1 class="text-center text-white display-6">Edit Profle</h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><Link to={'/'}>Home</Link></li>
                    {/* <li class="breadcrumb-item"><a href="#">Pages</a></li> */}
                    <li class="breadcrumb-item active text-white">Edit Profile</li>
                </ol>
            </div>
            {/* <!-- Single Page Header End --> */}


            <Footer />
        </>
    )
}

export default EditProfile;