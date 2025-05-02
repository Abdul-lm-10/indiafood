import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
// import { useCart } from "../../../context/cartContext";

const ProductListComponent = ({ selectedCountryId, searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`https://api.indiafoodshop.com/admin/products-by-country?country_id=${selectedCountryId}`);
                const data = await res.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCountryId]);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>{error}</p>;

    // ✅ Filter products using searchTerm
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {filteredProducts.map((product) => (
                <div className="col-md-6 col-lg-6 col-xl-4" key={product._id}>
                    <div className="rounded position-relative fruite-item">
                        <div className="fruite-img">
                            <Link to={`/product/${product.slug}`}>
                                <img
                                    src={`https://api.indiafoodshop.com${product.image}`}
                                    className="img-fluid w-100 rounded-top"
                                    alt=""
                                />
                            </Link>
                        </div>
                        <div className="text-white bg-success px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px' }}>
                            {product.category}
                        </div>
                        <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <Link to={`/product/${product.slug}`}>{product.name}</Link>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                                <div className="text-dark fs-5 fw-bold mb-0">
                                    {product.prices && product.prices.map((item, idx) => (
                                        <div key={idx} className="text-dark fs-6 mb-1">
                                            ₹{item.price} / {item.quantity}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="btn border border-secondary rounded-pill px-3 text-primary"
                                    onClick={() => addToCart(product, selectedCountryId)}
                                >
                                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ProductListComponent;