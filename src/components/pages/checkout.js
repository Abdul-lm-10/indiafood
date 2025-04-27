import { Helmet } from "react-helmet"
import Footer from "../include/footer"
import Spinner from "../include/spinner"
import { useEffect, useState } from "react"
import SearchModel from "../include/searchModel"
import { Link } from "react-router-dom"

const Checkout = ()=>{

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
                <title>Contact us | India Food Shop</title>                
                <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
                <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />                
                <link href="/external-assets/css/style.css" rel="stylesheet" />
            </Helmet>
                {
                    loading? <Spinner /> : ''
                }
                
            <Footer />
        </>
    )
}

export default Checkout;