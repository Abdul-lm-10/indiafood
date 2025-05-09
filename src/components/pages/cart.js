import { Helmet } from "react-helmet";
import Footer from "../include/footer";
import Spinner from "../include/spinner";
import { useEffect, useState } from "react";
import SearchModel from "../include/searchModel";
import { useCart } from "../../context/CartContext";
import { useCountry } from "../../context/CountryContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import defultImage from "../../external-assets/img/ifs-logo-3.png"

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const { cart, setCart, removeFromCart, addToCart, updateCartItem, clearCart, syncGuestCartToUserCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));
  const { selectedCountryId, currencySymbol } = useCountry();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  let { slug } = useParams();


  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCountryId) {
        // console.error('No country ID selected');
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`https://api.indiafoodshop.com/admin/products-by-country?country_id=${selectedCountryId}`);
        if (!response || !response.data) {
          // console.error('Invalid response format');
          return;
        }
        const productsData = response.data;
        if (!Array.isArray(productsData)) {
          // console.error('Products data is not an array:', productsData);
          return;
        }
        setProducts(productsData);
        // console.log('Products fetched successfully:', productsData);
      } catch (error) {
        console.error('Failed to fetch products:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCountryId]);

  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.price || 0);
    return total + price * (Number(item.pieces) || 1);
  }, 0);

  const shipping = cart.length ? 33.90 : 0;
  const total = subtotal + shipping;

  const handleIncreasePieces = (item) => {
    const updatedPieces = item.pieces + 1;
    updateCartItem(item._id, updatedPieces);
  };

  const handleDecreasePieces = (item) => {
    if (item.pieces > 1) {
      const updatedPieces = item.pieces - 1;
      updateCartItem(item._id, updatedPieces);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Carts | India Food Shop</title>
        <link href="/external-assets/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
        <link href="/external-assets/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
        <link href="/external-assets/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/external-assets/css/style.css" rel="stylesheet" />
      </Helmet>

      {loading ? <Spinner /> : ""}
      <SearchModel />

      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Cart</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item"><a href="#">Pages</a></li>
          <li className="breadcrumb-item active text-white">Cart</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Pieces</th>
                  <th scope="col">Status</th>
                  <th scope="col">Total</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">Your cart is empty</td>
                  </tr>
                ) : (
                  cart.map((item) => {
                    const quantityNumber = parseFloat(item.pieces) || 1;
                    const priceNumber = parseFloat(item.price) || 0;
                    const total = (quantityNumber * priceNumber).toFixed(2);

                    return (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={`https://api.indiafoodshop.com${item.product_details.image}` || `https://api.indiafoodshop.com${item.product_id.image}` }
                              className="img-fluid me-5 rounded-circle"
                              style={{ width: '80px', height: '80px' }}
                              alt={item.product_id.name}
                            />

                          </div>
                        </td>
                        <td className="align-middle">{item.product_details.name || item.product_id.name}</td>
                        <td className="align-middle">{currencySymbol}{priceNumber}</td>
                        <td className="align-middle">{item.quantity}</td>
                        <td className="align-middle">
                          <div className="input-group quantity" style={{ width: '120px' }}>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleDecreasePieces(item)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="form-control form-control-sm text-center border-0"
                              value={item.pieces}
                              readOnly
                            />
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleIncreasePieces(item)}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="align-middle">{item.status}</td>
                        <td className="align-middle">{currencySymbol}{total}</td>
                        <td className="align-middle">
                          <button
                            className="btn btn-md rounded-circle bg-light border"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <i className="fa fa-times text-danger"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>


          {cart.length > 0 && (
            <>
              <div className="mt-4 mt-lg-5">
                <button onClick={clearCart} className="btn btn-danger mb-3 mb-lg-4">Clear Cart</button>
              </div>

              <div className="row g-4">
                <div className="col-12 col-lg-8 order-2 order-lg-1">
                  {/* Explore More Products Section */}
                  <div className="container px-0">
                    <div className="text-center mb-4 mb-lg-5">
                      <h2 className="section-title px-3 px-lg-5">
                        <span className="px-2">Explore More Products</span>
                      </h2>
                    </div>
                    <div className="row g-4">
                      {Array.isArray(products) && products
                        .filter(product => !cart.some(cartItem => cartItem.product_id?._id === product._id))
                        .slice(0, 4)
                        .map((product) => (
                          <div key={product._id} className="col-12 col-sm-6">
                            <div
                              className="rounded position-relative fruite-item shadow-sm h-fit"
                              // onClick={() => navigate(`/product-details/${product.slug}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="fruite-img position-relative overflow-hidden" style={{ height: '250px' }}>
                                <img
                                  src={product.image ? `https://api.indiafoodshop.com${product.image}` : '/path/to/default-image.jpg'} // Fallback image
                                  className="img-fluid w-100 h-100 rounded-top"
                                  alt={product.name}
                                />
                                <div className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                                  style={{ top: '10px', right: '10px' }}>
                                  {product.category}
                                </div>
                              </div>
                              <div className="p-4 border border-secondary border-top-0 rounded-bottom d-flex flex-column h-100">
                                <h4 className="mb-3">{product.name}</h4>
                                <p className="mb-4 flex-grow-1">{product.description.length > 50
                                  ? `${product.description.trim().substring(0, 50)}...`
                                  : product.description.trim()}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="text-dark mb-0">
                                    {product.prices && product.prices.map((price, idx) => (
                                      <p key={idx} className="text-dark fs-5 fw-bold mb-0">
                                        {currencySymbol}{price.price} / {price.quantity}
                                      </p>
                                    ))}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addToCart(product, selectedCountryId);
                                    }}
                                    className="btn border border-secondary rounded-pill px-3 text-primary"
                                  >
                                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4 order-1 order-lg-2 mb-4 mb-lg-0">
                  <div className="bg-light rounded shadow-sm sticky-lg-top" style={{ top: '20px' }}>
                    <div className="p-4">
                      <h1 className="display-6 mb-4">Cart <span className="fw-normal">Total</span></h1>
                      <div className="d-flex justify-content-between mb-4">
                        <h5 className="mb-0 me-4">Subtotal:</h5>
                        <p className="mb-0">{currencySymbol}{subtotal.toFixed(2)}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-0 me-4">Shipping</h5>
                        <div className="">
                          <p className="mb-0">Flat rate: {currencySymbol}{shipping.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="mb-0 text-end">Shipping to your address.</p>
                    </div>
                    <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                      <h5 className="mb-0 ps-4 me-4">Total</h5>
                      <p className="mb-0 pe-4">{currencySymbol}{total.toFixed(2)}</p>
                    </div>
                    <div className="px-4 pb-4">
                      <button
                        className="btn border-secondary rounded-pill py-3 w-100 text-primary text-uppercase"
                        onClick={() => {navigate("/checkout");}}>
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
