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

                <section className="container my-5">
                    <div className="row">
                        <div className="col-md-12">
                            <h5>Introduction</h5>
                            <p>We publish this privacy policy to help our customers understand what information we collect, how we use them, and how we protect their privacy. This policy also defines how they can object to the use of their personal information. Any visitor to our website is subject to this policy, therefore users are asked to read this well before using.</p>
                            
                            <h5>Account Information and Security</h5>
                            <p>You, the user will receive a genuine user name and password while you are done registering with us. You are solely responsible for the confidentiality of your account details and are fully responsible for the services used under the concerned account. If there is any unauthorized use of your account for accessing our services immediately notify indiafoodshop.com, kindly ensure that you exit from your account at the end of each session.</p>

                            <h5>Payment and Order Information</h5>
                            <p>The orders placed on the Website are subjecting to being charged with, taxes, custom duties, related package handling fees and/or any other relevant charges required by the corresponding designated country and/or the organization(s) that handle(s) the shipment / delivery of the orders. None of these charges are included in the price that you pay on the Website.</p>
                            <p>Items cannot be sent as gifts, and your purchase may or may not have these charges, depending on the policies of the designated country and/or the organization(s) that handle(s) the package. If any of the said charges apply, you may need to pay for them to the respective collection authority in advance of receiving your purchase. You should check with any related authority of your country (or the designated country of the order) for any charges required to receive the goods you order from IndiaFoodShop.</p>
                            <p>IndiaFoodShop is not responsible for any of these charges, and would not refund on item(s) returned to us due to unaccepted / undelivered and/or any other reasons unless otherwise agreed with IndiaFoodShop in advance.</p>

                            <h5>Return and Refund Policy</h5>
                            <p>Since products from IndiaFoodShop are highly customized and tailor-made for individual customers, products cannot be returned for refund. If you are not satisfied by defects on the products (such as scratched cases or printing), please contact our customer services team for assistance and the team will investigate the problem and arrange an exchange of the product with a new one if necessary.</p>

                            <h5>Contact Us</h5>
                            <p>If you have any questions about our Privacy Policy, please contact us at <a href="mailto:support@indiafoodshop.com">support@indiafoodshop.com</a>.</p>
                        </div>
                    </div>
                </section>

            <Footer />
        </>
    )
}

export default TermsAndConditions;