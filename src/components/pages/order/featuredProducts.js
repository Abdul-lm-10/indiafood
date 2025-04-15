

const FeaturedProducts = () =>{
    return(
            <div className="d-flex align-items-center justify-content-start">
                <div className="rounded" style={{width: '100px', height: '100px'}}>
                    <img src="img/featur-1.jpg" className="img-fluid rounded" alt="Image" />
                </div>
                <div>
                    <h6 className="mb-2">Big Banana</h6>
                    <div className="d-flex mb-2">
                        <i className="fa fa-star text-secondary"></i>
                        <i className="fa fa-star text-secondary"></i>
                        <i className="fa fa-star text-secondary"></i>
                        <i className="fa fa-star text-secondary"></i>
                        <i className="fa fa-star"></i>
                    </div>
                    <div className="d-flex mb-2">
                        <h5 className="fw-bold me-2">2.99 $</h5>
                        <h5 className="text-danger text-decoration-line-through">4.11 $</h5>
                    </div>
                </div>
            </div>
    )
}

export default FeaturedProducts;