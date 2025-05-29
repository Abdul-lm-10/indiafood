import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const FloatCart = () => {
    const { cart } = useCart();

    return (
        // <NavLink to={'/cart'} className="position-relative me-4 my-auto">
        //     <i className="fa fa-shopping-bag fa-2x"></i>
        //     <span className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1" style={{ top: '-5px', left: '15px', height: '20px', minWidth: '20px' }}>{cart.length}</span>
        // </NavLink>
           <div
            style={{
                position: "fixed",
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                zIndex: 1050,
            }}
        >
            <NavLink to="/cart" className="position-relative d-inline-block">
                <i className="fa fa-shopping-bag fa-2x "></i>
                <span
                    className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                    style={{
                        top: "-5px",
                        left: "15px",
                        height: "20px",
                        minWidth: "20px",
                        fontSize: "12px",
                    }}
                >
                    {cart.length}
                </span>
            </NavLink>
        </div>
    )
}

export default FloatCart;