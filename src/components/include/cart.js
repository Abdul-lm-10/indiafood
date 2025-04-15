import { NavLink } from "react-router-dom";

const Cart = () =>{
    return(
            <NavLink to={'/cart'} className="position-relative me-4 my-auto">
                <i className="fa fa-shopping-bag fa-2x"></i>
                <span className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1" style={{top: '-5px', left: '15px', height: '20px', minWidth: '20px'}}>3</span>
            </NavLink>
    )
}

export default Cart;