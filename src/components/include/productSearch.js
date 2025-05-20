import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductSearch = ({ products }) => {
    const [query, setQuery] = useState('');
    const [matchedProducts, setMatchedProducts] = useState([]);
    const [notFound, setNotFound] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const term = query.toLowerCase().trim();
        if (term === '') {
            setMatchedProducts([]);
            setNotFound(false);
            return;
        }

        const results = products.filter(p =>
            p.name?.toLowerCase().includes(term)
        );

        if (results.length > 0) {
            setMatchedProducts(results);
            setNotFound(false);
        } else {
            setMatchedProducts([]);
            setNotFound(true);
        }
    }, [query, products]);

    const handleSelect = (slug) => {
        navigate(`/product/${slug}`);
    };

    const fallbackSuggestions = products.slice(0, 3);

    return (
        <div >
            <div className="position-relative mx-auto ">
                <input
                    className="form-control border-2 w-75 border-secondary py-3 px-4 rounded-pill"
                    type="text"
                    placeholder="Search for a product..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {/* Suggestions Dropdown */}
                {(matchedProducts.length > 0 || notFound) && (
                    <div className="position-absolute bg-white border rounded shadow mt-1 w-75 z-3">
                        {matchedProducts.map((product) => (
                            <button
                                key={product._id}
                                className="list-group-item list-group-item-action border-0"
                                onClick={() => handleSelect(product.slug)}
                            >
                                {product.name}
                            </button>
                        ))}

                        {notFound && (
                            <>
                                <div className="p-2 text-danger border-bottom">Product not available.</div>
                                <div className="px-2 pt-1"><strong>You may like:</strong></div>
                                {fallbackSuggestions.map((product) => (
                                    <button
                                        key={product._id}
                                        className="list-group-item list-group-item-action border-0"
                                        onClick={() => handleSelect(product._id)}
                                    >
                                        {product.name}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
};

export default ProductSearch;
