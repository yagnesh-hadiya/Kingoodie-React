import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SupportTicket() {
  const [supportTicket, setSupportTicketId] = useState("");
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
              <span /> Support Ticket
            </div>
          </div>
        </div>
        <div className="page-content pt-100 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 ">
                <div className="row">
                  <div className="card-body contact-from-area">
                    <h3 className="mb-2">Support Ticket</h3>
                    <p>
                      To track your support Ticket please enter your TicketID in
                      the box below and press "Track" button. This was given to
                      you on your receipt and in the confirmation email you
                      should have received.
                    </p>
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="contact-form-style mt-30 mb-50">
                          <div className="input-style mb-20">
                            <label>Ticket ID</label>
                            <input
                              name="order-id"
                              placeholder="Found in your Ticket ID"
                              type="text"
                              value={supportTicket}
                              onChange={(e) => {
                                setSupportTicketId(e.target.value);
                              }}
                            />
                          </div>

                          <Link to={`/TicketsDetail?id=${supportTicket}`}>
                            <button
                              className="submit submit-auto-width"
                              disabled={!supportTicket}
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

export default SupportTicket;
