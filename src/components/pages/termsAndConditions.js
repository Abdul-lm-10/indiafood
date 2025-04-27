import { Helmet } from "react-helmet"
import Footer from "../include/footer"
import Spinner from "../include/spinner"
import { useEffect, useState } from "react"
import SearchModel from "../include/searchModel"

const TermsAndConditions =()=>{

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
                <title>Terms and Conditions | India Food Shop</title>                
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
                    <h1 class="text-center text-white display-6">Terms and Conditions</h1>
                    <ol class="breadcrumb justify-content-center mb-0">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>                        
                        <li class="breadcrumb-item active text-white">Terms and Conditions</li>
                    </ol>
                </div>
                {/* <!-- Single Page Header End --> */}

                <section class="container my-5">
                    <div class="row">
                        <div class="col-md-12">
                            <h2>1. Introduction</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel tincidunt nibh, et auctor mi. Nulla facilisi. Donec lacinia convallis ex a aliquet.</p>
                            
                            <h2>2. Intellectual Property Rights</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat volutpat. In congue leo vel bibendum malesuada. Vivamus ac risus neque. Nunc in neque fringilla, dictum libero id, tincidunt odio.</p>

                            <h2>3. Restrictions</h2>
                            <ul>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                <li>Proin vel tincidunt nibh, et auctor mi.</li>
                                <li>Donec lacinia convallis ex a aliquet.</li>
                            </ul>

                            <h2>4. Limitation of Liability</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget felis lacinia, ultrices ligula eget, facilisis urna. Aliquam vitae dolor sit amet odio vehicula vehicula ut in sapien.</p>

                            <h2>5. Governing Law</h2>
                            <p>Proin vel tincidunt nibh, et auctor mi. Nulla facilisi. Donec lacinia convallis ex a aliquet.</p>

                            <h2>6. Changes to Terms</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel tincidunt nibh, et auctor mi. Nulla facilisi. Donec lacinia convallis ex a aliquet.</p>

                            <h2>7. Contact Us</h2>
                            <p>If you have any questions, feel free to contact us at <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>.</p>
                        </div>
                    </div>
                </section>

            <Footer />
        </>
    )
}

export default TermsAndConditions;