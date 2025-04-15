const Reviews = () =>{
    return(
        <div class="d-flex">
            <img src="img/avatar.jpg" class="img-fluid rounded-circle p-3" style={{width: '100px', height: '100px'}} alt="" />
            <div class="">
                <p class="mb-2" style={{fontSize: '14px'}}>April 12, 2024</p>
                <div class="d-flex justify-content-between">
                    <h5>Jason Smith</h5>
                    <div class="d-flex mb-3">
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star text-secondary"></i>
                        <i class="fa fa-star"></i>
                    </div>
                </div>
                <p>The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic 
                    words etc. Susp endisse ultricies nisi vel quam suscipit </p>
            </div>
        </div>
    )
}

export default Reviews;