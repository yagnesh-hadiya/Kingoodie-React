import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function OrderTrack() {
  const [TrackOrderId, setTrackOrderId] = useState("");
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div>
      <main className="main pages">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/" rel="nofollow">
                <i className="fi-rs-home mr-5" />
                Home
              </Link>
              <span /> Order Tracking
            </div>
          </div>
        </div>
        <div className="page-content pt-100 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="row">
                    <div className="card-body contact-from-area">
                      <h3 className="mb-2">Order Tracking</h3>
                      <p>
                        To track your order please enter your OrderID in the box
                        below and press "Track" button. This was given to you on
                        your receipt and in the confirmation email you should
                        have received.
                      </p>
                      <div className="row">
                        <div className="col-lg-8">
                          <div className="contact-form-style mt-30 mb-50">
                            <div className="input-style mb-20">
                              <label>Order ID</label>
                              <input
                                name="order-id"
                                placeholder="Found in your order confirmation"
                                type="text"
                                value={TrackOrderId}
                                onChange={(e) => {
                                  setTrackOrderId(e.target.value);
                                }}
                                required
                              />
                            </div>

                            <Link to={`/OrderDetail?id=${TrackOrderId}`}>
                              <button
                                type="submit"
                                className="submit submit-auto-width"
                                disabled={!TrackOrderId}
                              >
                                Track
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderTrack;
