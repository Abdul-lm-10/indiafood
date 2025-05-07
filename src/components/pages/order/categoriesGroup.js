import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCountry } from "../../../context/CountryContext";


const CategoriesGroup = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { selectedCountryId, currencySymbol } = useCountry();
    const [categories, setCategories] = useState([]);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://api.indiafoodshop.com/admin/get-categories');
                console.log(response.data.data);

                setCategories(response.data.data);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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

    // Products length based on the categories
    const productCountByCategory = products.reduce((acc, product) => {
        if (product.category_id) {
            acc[product.category_id] = (acc[product.category_id] || 0) + 1;
        }
        return acc;
    }, {});


    return (
        <div className="col-lg-12">
            <div className="mb-3">
                <h4>Categories</h4>
                <ul className="list-unstyled fruite-categorie">
                    {categories.map((category) => (
                        <li key={category._id}>
                            <div className="d-flex justify-content-between fruite-name">
                                <Link to={'/category/' + category._id}>
                                    <i class="fa-solid fa-layer-group me-2"></i>
                                    {category.name}
                                </Link>
                                <span>({productCountByCategory[category._id] || 0})</span>                                                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default CategoriesGroup;