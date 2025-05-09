import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
// import { useCart } from "../../../context/cartContext";

const ProductListComponent = () =>{

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {

        const fetchProducts = async () => {
            try {
              const response = await axios.get('https://api.indiafoodshop.com/admin/get-products'); 
              console.log(response.data.data);
              
              setProducts(response.data.data);
              setLoading(false);
            } catch (error) {
              setError('Failed to fetch products');
              setLoading(false);
            }
        };
      
        fetchProducts();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>{error}</p>;

    return(
        <>
            {products.map((product) => (
            <div class="col-md-6 col-lg-6 col-xl-4">
                <div class="rounded position-relative fruite-item">
                    <div class="fruite-img">
                        <Link to={'/product/'+product.slug}>
                            <img src={'https://api.indiafoodshop.com'+product.image} class="img-fluid w-100 rounded-top" alt="" />
                        </Link>
                    </div>
                    <div class="text-white bg-success px-3 py-1 rounded position-absolute" style={{top: '10px', left: '10px'}}>{product.category}</div>
                    <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                        <Link to={'/product/'+product.slug}>{product.name}</Link>
                        {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p> */}
                        <div class="d-flex justify-content-between flex-lg-wrap">
                            <p class="text-dark fs-5 fw-bold mb-0">$4.99 / kg</p>
                            <a  class="btn border border-secondary rounded-pill px-3 text-primary" onClick={() => addToCart(product)}><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                        </div>
                    </div>
                </div>
            </div>
            ))}   
                           
        </>
    )    
}

export default ProductListComponent;