import { Helmet } from "react-helmet";
import Footer from "../include/footer";
import Header from "../include/header";
import Spinner from "../include/spinner";
import { useEffect, useState } from "react";
import SearchModel from "../include/searchModel";
import { useCart } from "../../context/CartContext";
import { useCountry } from "../../context/CountryContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const { cart, setCart, removeFromCart, addToCart, updateCartItem, clearCart } = useCart(); // ✅ now using ALL
  const user = JSON.parse(localStorage.getItem("user"));
    const { selectedCountryId } = useCountry();
    const navigate=useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.price || 0); // Handle price as a number
    return total + price * (Number(item.quantity) || 1); // Calculate total price for each item
  }, 0);

  const shipping = cart.length ? 33.90 : 0;
  const total = subtotal + shipping;

  const handleIncrease = (item) => {
    const currentQty = Number(item.quantity || 1);
    updateCartItem(item._id, currentQty + 1);
  };

  const handleDecrease = (item) => {
    const currentQty = Number(item.quantity || 1);
    const newQuantity = currentQty - 1;
    if (newQuantity >= 1) {
      updateCartItem(item._id, newQuantity);
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
                  <th scope="col">Products</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">Your cart is empty</td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr key={item._id}>
                      <th scope="row">
                        <div className="d-flex align-items-center">
                          <img
                            src={`https://api.indiafoodshop.com${item.product_id.image}`} // Access the image from product_id
                            className="img-fluid me-5 rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                            alt={item.product_id.name} // Access the name from product_id
                          />
                        </div>
                      </th>
                      <td>
                        <p className="mb-0 mt-4">{item.product_id.name}</p> {/* Access the name from product_id */}
                      </td>
                      <td>
                        <p className="mb-0 mt-4">₹{item.price || 'N/A'}</p>
                      </td>
                      <td>
                        <div className="input-group quantity mt-4" style={{ width: '120px' }}>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDecrease(item)}>-</button>
                          <input type="text" className="form-control form-control-sm text-center border-0" value={item.quantity || 1} readOnly />
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleIncrease(item)}>+</button>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">₹{(Number(item.price) * (Number(item.quantity) || 1)).toFixed(2)}</p>
                      </td>
                      <td>
                        <button className="btn btn-md rounded-circle bg-light border mt-4" onClick={() => removeFromCart(item._id)}>
                          <i className="fa fa-times text-danger"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {cart.length > 0 && (
            <>
              <div className="mt-5">
                <button onClick={clearCart} className="btn btn-danger mb-4">Clear Cart</button>
              </div>

              <div className="row g-4 justify-content-end">
                <div className="col-8"></div>
                <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
                  <div className="bg-light rounded">
                    <div className="p-4">
                      <h1 className="display-6 mb-4">Cart <span className="fw-normal">Total</span></h1>
                      <div className="d-flex justify-content-between mb-4">
                        <h5 className="mb-0 me-4">Subtotal:</h5>
                        <p className="mb-0">₹{subtotal.toFixed(2)}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-0 me-4">Shipping</h5>
                        <div className="">
                          <p className="mb-0">Flat rate: ₹{shipping.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="mb-0 text-end">Shipping to your address.</p>
                    </div>
                    <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                      <h5 className="mb-0 ps-4 me-4">Total</h5>
                      <p className="mb-0 pe-4">₹{total.toFixed(2)}</p>
                    </div>
                    <button className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4" type="button" onClick={()=>navigate("/checkout")}>
                      Proceed to Checkout
                    </button>
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
