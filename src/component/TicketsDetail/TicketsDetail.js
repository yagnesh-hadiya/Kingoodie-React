import React, { useState,useEffect } from 'react'
import CommonService from "../../services/commonService";
import urlConstant from "../../constants/urlConstant";
import { ToasterSuccess, ToasterWarning, ToasterError } from "../../common/toaster";
import { ToastContainer } from "react-toastify";
import { useAppContext } from '../../context/index';
import axios from 'axios';

function TicketsDetail() {
    let common = new CommonService();
    const { user_id } = useAppContext();
    const queryParameters = new URLSearchParams(window.location.search);
    const id = queryParameters.get("id");

    const [TicketId, SetTicketId] = useState("");
    const [TicketCode, SetTicketCode] = useState("");
    const [TicketDetails, SetTicketDetails] = useState("");
    const [TicketReplies, SetTicketReplies] = useState([]);
    const [details, Setdetails] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const SubmitHandler = async (e) => {
        e.preventDefault();
        if (!TicketId || !details) {
            ToasterWarning('Please enter all the details')
            return
        }
        try {
            const data = { TicketId, details, user_id };
            const TicketReplies = `${urlConstant.User.TicketReply}`;
            await axios.post(TicketReplies, data).then(() => {
                ToasterSuccess("Success...!!");
                Setdetails('');
                convartions();
                setIsLoading(false);
            })
        }
        catch (error) {
            ToasterError("Error")
            setIsLoading(false)
        }

    }


    function convartions() {
        try {
          const Data = { id:`${id}` }
          const supportUrl = `${urlConstant.User.supportTicketUrl}/${id}`;
          common.httpGet(supportUrl, Data).then((res) => {
            SetTicketId(res.data.data.id);
            SetTicketCode(res.data.data.code);
            SetTicketDetails(res.data.data);
            SetTicketReplies(res.data.data.replies);
          })
    
        }
        catch (error) {
          ToasterError("Error")
        }
    }


    useEffect(() => {
        convartions();
    }, [])
    return (
        <div>
            <ToastContainer />
            {/* <Header /> */}
            <main className="main pages">
                <div className="page-header breadcrumb-wrap">
                    <div className="container">
                        <div className="breadcrumb">
                            <a  rel="nofollow"><i className="fi-rs-home mr-5" />Home</a>
                            <span /> Pages <span />Ticket Detail
                        </div>
                    </div>
                </div>
                <div className="page-content pt-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 mb-40">
                                <h1 className="heading-2 mb-10 mr-30">#{TicketCode}</h1>
                                <h5>Subject: {TicketDetails.subject}</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8 m-auto">
                                <section className="mb-50">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="Ticket-replies">
                                                <div class="message-right">
                                                    <div class="me">
                                                        <label>You</label>
                                                        {/* <span class="symbol-label  bg-light-danger text-danger fs-6 fw-bolder ">{Array.from(UserName)[0]}</span> */}
                                                    </div>
                                                    <h5 className="userChat" style={{ textAlign: 'right' }}>{TicketDetails.details}</h5>
                                                </div>
                                                {
                                                    TicketReplies.map((item, i) => {
                                                        const person = item.user_id;
                                                        if(person == 1) {
                                                            return (
                                                                <>
                                                                    <div class="message-left">
                                                                        <div class="me">
                                                                            <span class="symbol-label  bg-light-danger text-danger fs-6 fw-bolder ">K</span>
                                                                            <label>Kingoodie</label>
                                                                        </div>
                                                                        <h5 className="adminChat" style={{ textAlign: 'left' }}>{item.details.replace(/(<([^>]+)>)/ig, '')}</h5>
                                                                    </div>
                                                                </>
                                                            )
                                                        } else {
                                                            return (
                                                                <>
                                                                    <div class="message-right">
                                                                        <div class="me">
                                                                            <label>You</label>
                                                                            {/* <span class="symbol-label  bg-light-danger text-danger fs-6 fw-bolder ">{Array.from(UserName)[0]}</span> */}
                                                                        </div>
                                                                        <h5 className="userChat" style={{ textAlign: 'right' }}>{item.details.replace(/(<([^>]+)>)/ig, '')}</h5>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    })
                                                }
                                            </div>
                                            <div className="contact-from-area padding-20-row-col mt-50">
                                                <form className="contact-form-style mt-30" id="contact-form" action="#" method="post">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-12">
                                                            <div className="textarea-style mb-30">
                                                                <textarea style={{ minHeight: '100px' }} name="details" placeholder="Reply" defaultValue={""} value={details || ""} onChange={(e) => { Setdetails(e.target.value) }} />
                                                            </div>
                                                            <button className="submit submit-auto-width" onClick={SubmitHandler}>Submit</button>
                                                        </div>
                                                    </div>
                                                </form>
                                                <p className="form-messege" />
                                            </div>
                                        </div>
                                    </div><br /><br />
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* <Footer/> */}
        </div>
    )
}

export default TicketsDetail
