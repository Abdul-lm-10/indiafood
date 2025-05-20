import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ReviewForm = ({ productId }) => {
  const { slug } = useParams(); // assuming you're using slug to fetch product
  const [form, setForm] = useState({ name: '', email: '', review: '', rating: 0 });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
   const user = JSON.parse(localStorage.getItem("user"));

  const handleRating = (rating) => setForm({ ...form, rating });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('https://api.indiafoodshop.com/api/auth/v1/review', {
         product_id: productId,
        user_id: user._id,
        name: form.name,
        email: form.email,
        review: form.review,
        rating: form.rating
      });
      setMessage('Review submitted successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-5 fw-bold">Leave a Review</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="border-bottom rounded">
            <input type="text" name="name" className="form-control border-0 me-4" placeholder="Your Name *" onChange={handleChange} />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="border-bottom rounded">
            <input type="email" name="email" className="form-control border-0" placeholder="Your Email *" onChange={handleChange} />
          </div>
        </div>
        <div className="col-lg-12">
          <div className="border-bottom rounded my-4">
            <textarea name="review" className="form-control border-0" rows="5" placeholder="Your Review *" onChange={handleChange}></textarea>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="d-flex justify-content-between py-3 mb-5">
            <div className="d-flex align-items-center">
              <p className="mb-0 me-3">Please rate:</p>
              {[1,2,3,4,5].map((star) => (
                <i key={star} className={`fa fa-star ${form.rating >= star ? 'text-warning' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => handleRating(star)}></i>
              ))}
            </div>
            <button type="submit" className="btn border border-secondary text-primary rounded-pill px-4 py-3" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
