import React from 'react'

function Loding() {
  return (
    <div>
        <div id="preloader-active">
        <div className="preloader d-flex align-items-center justify-content-center">
          <div className="preloader-inner position-relative">
            <div className="text-center">
              {/* <img src="assets/imgs/theme/loading.gif" alt="Loding..."/> */}
              <img src="https://cdn.dribbble.com/users/31776/screenshots/754788/loading_cart.gif" alt="Loding..."/>
              {/* <img src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/25702a69321565.5b7d0cbe75e1a.gif" alt="Loding..."/> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loding;
