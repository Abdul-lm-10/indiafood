import { useEffect, useState, useContext } from "react"
import axios from 'axios';
import { AuthContext } from "../../../context/AuthContext"
import { useCountry } from "../../../context/CountryContext";
import { useNavigate, useLocation } from "react-router-dom"

const Signup = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(-1);
    const [errorMsg, setErrorMsg] = useState('');
    const { countryCode } = useCountry();
    const location = useLocation();
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone_number: '' });
    // console.log(formData);

    useEffect(() => {

        if (user) {
            navigate('/dashboard/my-profile');
        }


        if (location.state) {
            setFormData(prev => ({
                ...prev,
                ...location.state 
            }));
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
            setError(-1);
            setErrorMsg('');
            navigate('/otp', { state: { email: formData.email } });
        } catch (err) {
            setError(1);
            setErrorMsg(err.response?.data?.message || "Something Went Wrong");
        }
    };
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Remove any existing country code or non-digit characters
        const cleanNumber = value.replace(/^\+\d+\s*|[^\d]/g, '');
        // Only add country code if there's a number
        setFormData({
            ...formData,
            phone_number: cleanNumber ? `${countryCode} ${cleanNumber}` : ''
        });
    };

    return (
        <>

            {/* <!-- Signup Form --> */}
            <div class="tab-pane fade" id="pills-signup" role="tabpanel" aria-labelledby="pills-signup-tab">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4">Signup</h3>
                        {
                            error == 1 ?
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
                                <input type="text" class="form-control" id="name" placeholder="Enter your name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" placeholder="Enter your email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div class="mb-3">
                                <label htmlFor="phone_number" className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phone_number"
                                    placeholder="Enter your phone number"
                                    value={formData.phone_number}
                                    onChange={handlePhoneChange}
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter your password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
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