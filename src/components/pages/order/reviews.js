import { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = ({ product_id }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`https://api.indiafoodshop.com/api/auth/v1/review/product/${product_id}`).then(res => {
      setReviews(res.data.data || []);
    });
  }, [product_id]);

  return (
    <div>
      {reviews.map((r, idx) => (
        <div className="d-flex mb-4" key={idx}>
          <img src="/img/avatar.png" className="img-fluid rounded-circle p-3" style={{ width: '80px', height: '80px' }} alt="avatar" />
          <div>
            <p className="mb-2" style={{ fontSize: '14px' }}>{r.date_time}</p>
            <div className="d-flex justify-content-between">
              <h5>{r.name}</h5>
              <div className="d-flex mb-3">
                {[1,2,3,4,5].map((s) => (
                  <i key={s} className={`fa fa-star ${s <= r.rating ? 'text-warning' : 'text-muted'}`}></i>
                ))}
              </div>
            </div>
            <p>{r.review}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
