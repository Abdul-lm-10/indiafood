import axios from "axios";
import { useEffect, useState } from "react";


const CategoriesGroup = () => {
    const [loading, setLoading] = useState(true);
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
    return (
        <ul class="list-unstyled fruite-categorie">

            {categories.map((category) => (
                <li>
                    <div class="d-flex justify-content-between fruite-name">
                        <a href="#"><i class="fas fa-apple-alt me-2"></i>{category.name}</a>
                        <span>(3)</span>
                    </div>
                </li>
            ))}

        </ul>
    )
}

export default CategoriesGroup;