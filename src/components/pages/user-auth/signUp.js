import { useEffect, useState, useContext } from "react"
import axios from 'axios';
import { AuthContext } from "../../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Signup = () =>{

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(-1);
    const [errorMsg, setErrorMsg] = useState('');

    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone_number: ''});
    // console.log(formData);

    useEffect(() => {

        if (user) {
            navigate('/dashboard/my-profile');
        }

        const timer = setTimeout(() => {
          setLoading(false); 
        }, 100);
    
        return () => clearTimeout(timer);
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/signup', formData);
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
                
                {/* <!-- Signup Form --> */}
                <div class="tab-pane fade" id="pills-signup" role="tabpanel" aria-labelledby="pills-signup-tab">
                    <div class="card">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4">Signup</h3>
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
                            <label for="name" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter your name" onChange={(e) => setFormData({ ...formData, name: e.target.value })}  required />
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="email" placeholder="Enter your email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        <div class="mb-3">
                            <label for="phone_number" class="form-label">Phone Number</label>
                            <input type="text" class="form-control" id="phone_number" placeholder="Enter your Phone Number" onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} required />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Enter your password"  onChange={(e) => setFormData({ ...formData, password: e.target.value })}  required />
                        </div>
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-success">Signup</button>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
        </>
    )
}

export default Signup;