import { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";
import { useCountry } from "../../../context/CountryContext";

const FeaturedProducts = () => {
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { selectedCountryId } = useCountry();


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://api.indiafoodshop.com/admin/products-by-country?country_id=${selectedCountryId}`);
                const data = await res.json();
                console.log("Fetched Products:", data);
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCountryId]);

    return (
        <div class="col-lg-12">
        <h4 class="mb-3">Featured products</h4>
        {Array.isArray(products) &&  products.slice(0, 4).map((product) => (
            <div class="d-flex align-items-center justify-content-start">
                <div class="rounded me-4" style={{ width: '100px', height: '100px' }}>
                    <img src={`https://api.indiafoodshop.com${product.image}`} class="img-fluid rounded" alt="" />
                </div>
                <div>
                    <h6 class="mb-2">{product.name}</h6>
                    <div class="d-flex mb-2">
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star"></i>
                    </div>
                    <div class="d-flex mb-2">
                        <h5 class="fw-bold me-2">{product.prices.map((item, idx) => (
                            <p key={idx} className="text-dark fs-6 mb-0">
                                ₹{item.price} / {item.quantity}
                            </p>
                        ))}</h5>
                        {/* <h5 class="text-danger text-decoration-line-through">4.11 $</h5> */}
                    </div>
                </div>
            </div>
        ))}
        <div class="d-flex justify-content-center my-4">
            <a href="#" class="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100">View More</a>
        </div>
    </div>
    )
}

export default FeaturedProducts;