import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LoginOrAvatar = ()=>{
    const { user } = useContext(AuthContext);
    return(
        <>
        {
            user ?(
                <>
                    {/* <NavLink to={'/dashboard/my-profile'} className="my-auto">                                
                        <img className="fa-2x" alt="user Image" src="/img/avatar.png" style={{width: '40px',height: '40px', borderRadius: '50%'}} />                                
                    </NavLink> */}

                    <div className="nav-item dropdown">
                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            <img className="fa-2x" alt="user Image" src={user.avatar || '/img/avatar.png'} style={{width: '40px',height: '40px', borderRadius: '50%'}} />                                    
                        </a>
                        <div className="dropdown-menu m-0 bg-secondary rounded-0">
                            <Link to={'/dashboard/my-profile'} className="dropdown-item">Edit Profile</ Link>
                            <Link to={'/orders'} className="dropdown-item">Orders</Link>
                            <Link to={'/order-tracking'} className="dropdown-item">Order Tracking</Link>
                            <Link to={"/logout"} className="dropdown-item">Logout</Link>
                        </div>
                    </div>
                </>                
            ):(
                <NavLink to={'/login'} className="my-auto">                                                     
                    Login
                </NavLink>
            )
        }
        
        </>
    );
}

export default LoginOrAvatar;