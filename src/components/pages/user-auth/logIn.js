import { useEffect, useState, useContext } from "react"
import axios from 'axios';
import { AuthContext } from "../../../context/AuthContext"
import { useNavigate } from "react-router-dom"
const Login = () =>{

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(-1);
    const [errorMsg, setErrorMsg] = useState('');

    const { user,login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: ''});

    // console.log(formData);
    useEffect(() => {

        if (user) {
            navigate('/dashboard/my-profile');
        }
        
        const timer = setTimeout(() => {
          setLoading(false); 
        }, 500);
    
        return () => clearTimeout(timer);
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/login', formData);
            // console.log(res);
            setError(-1)
            setErrorMsg('');
            login(res.data.token, res.data.user);
            navigate('/dashboard/my-profile');
        } catch (err) { 
            if(err.response.data.message && err.response.data.message!=''){
                setError(1);
                setErrorMsg(err.response.data.message);
                console.error(err);
            }else{
                setError(1);
                setErrorMsg("Something Went Wrong");
            }         
        }
    };

    return (
        <>

            {/* <!-- Login Form --> */}
            <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
                <div class="card">
                <div class="card-body">
                    <h3 class="card-title text-center mb-4">Login</h3>
                    {
                            error==1 ? 
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Error!</strong> {errorMsg}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                            :
                            ''
                        }
                    <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="loginEmail" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="loginEmail" placeholder="Enter your email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="loginPassword" placeholder="Enter your password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn-success btn">Login</button>
                    </div>
                    </form>
                </div>
                </div>
            </div>

        </>
    )
}

export default Login;