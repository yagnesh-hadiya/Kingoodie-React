import React from 'react'
import Footer from '../Footer'
import Header from '../Header'

function ReturnExchangePolicy() {
  return (
    <div>
        {/* <Header/> */}
        <main className="main pages">
        <div className="page-header breadcrumb-wrap">
            <div className="container">
                <div className="breadcrumb">
                    <a  rel="nofollow"><i className="fi-rs-home mr-5" />Home</a>
                    <span /> Pages <span /> Shipping & Delivery
                </div>
            </div>
        </div>
        <div className="page-content pt-50">
            <div className="container">
            <div className="row">
                <div className="col-xl-12 col-lg-12 m-auto">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="single-page pr-30 mb-lg-0 mb-sm-5">
                            <div className="single-header style-2">
                            <h2>Shipping & Delivery</h2>
                            </div>
                            <div className="single-content mb-50">
                                <h4>Delivery Time</h4>
                                <ul>
                                    <li>3 to 5 days in Metro Cities with Airport.</li>
                                    <li>5 to 7 days in 2nd Tier Cities with Airport.</li>
                                    <li>10 to 15 days in Rural Area.</li>
                                </ul>
                            </div>
                        </div>
                    </div>                    
                </div>
                </div>
            </div>
            </div>
        </div>
        </main>
        {/* <Footer/> */}
    </div>
  )
}

export default ReturnExchangePolicy