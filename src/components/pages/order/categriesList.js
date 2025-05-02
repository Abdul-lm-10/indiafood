import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CategoriesListComponent = ({ filteredCategories }) => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://api.indiafoodshop.com/admin/get-categories');
                console.log(response.data.data);

                setCategories(response.data.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            {filteredCategories.map((category) => (
                <div class="col-md-6 col-lg-6 col-xl-4">
                    <div class="rounded position-relative fruite-item">
                        <div class="fruite-img">
                            <Link to={'/category/' + category._id}>
                                <img src={'https://api.indiafoodshop.com' + category.image} class="img-fluid w-100 rounded-top" alt="" />
                            </Link>
                        </div>
                        <div class="text-white bg-success px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px' }}>{category.category}</div>
                        <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                            <Link to={'/category/' + category._id}>{category.name}</Link>
                        </div>
                    </div>
                </div>

            ))}

        </>
    )
}

export default CategoriesListComponent;