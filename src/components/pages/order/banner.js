
const Banner = () => {
    return (
        <>
            {/* Banner */}
            < div className="col-lg-12" >
                <div className="position-relative">
                    <img
                        src="img/banner-fruits.jpg"
                        className="img-fluid w-100 rounded"
                        alt=""
                    />
                    <div
                        className="position-absolute"
                        style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                    >
                        <h3 className="text-white fw-bold rounded bg-success px-2 py-2">Fresh Banner</h3>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Banner;