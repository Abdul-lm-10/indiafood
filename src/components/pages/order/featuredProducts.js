import { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";
import { useCountry } from "../../../context/CountryContext";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { selectedCountryId, currencySymbol } = useCountry();


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
        <div className="col-lg-12">
            <h4 className="mb-3">Featured products</h4>
            {Array.isArray(products) &&
                products
                    .reduce((acc, curr) => {
                        if (!acc.find(item => item.category === curr.category)) {
                            acc.push(curr);
                        }
                        return acc;
                    }, [])
                    .map((product) => (
                        <Link to={'/product/' + product.slug}>
                            <div
                                key={product._id}
                                className="d-flex align-items-center justify-content-start mb-3"
                            >
                                <div
                                    className="rounded me-4"
                                    style={{ width: '100px', height: '100px' }}
                                >
                                    <img
                                        src={`https://api.indiafoodshop.com${product.image}`}
                                        className="img-fluid rounded"
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <h6 className="mb-2">{product.name}</h6>
                                    <div className="d-flex mb-2">
                                        {[1, 2, 3, 4].map((_, i) => (
                                            <i key={i} className="fa fa-star text-secondary"></i>
                                        ))}
                                        <i className="fa fa-star" style={{color: "#747D88"}}></i>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <div className="text-dark fs-5 fw-bold mb-0">
                                            {product.prices && (
                                                product.prices
                                                    .filter((item) => item.quantity === "1kg")
                                                    .map((item, idx) => (
                                                        <div key={idx} className="text-dark fs-6 mb-1">
                                                            {currencySymbol}{item.price} / {item.quantity}
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                    ))}
            <div className="d-flex justify-content-center my-4">
                <a
                    href="/products"
                    className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100"
                >
                    View More
                </a>
            </div>
        </div>
    )
}

export default FeaturedProducts;