import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAppContext } from '../context';
import { ToastContainer } from "react-toastify";
import { ToasterWarning, ToasterSuccess, ToasterError } from "../common/toaster";
import axios from 'axios';
import CommonService from "../services/commonService";
import urlConstant from "../constants/urlConstant";
import Loding from "./Loding";


function Footer() {
    const { Logo } = useAppContext();
    const { HeaderLogo } = useAppContext();
    const { FooterLogo } = useAppContext();
    const { FacebookLink } = useAppContext();
    const { TwitterLink } = useAppContext();
    const { InstagramLink } = useAppContext();
    const { YoutubeLink } = useAppContext();
    const { LinkedinLink } = useAppContext();
    const { FooterAddress } = useAppContext();
    const { FooterPhone } = useAppContext();
    const { FooterEmail } = useAppContext();
    const { FooterDesc } = useAppContext(); 
    const { AllCategory } = useAppContext(); 
    let common = new CommonService();
    const [email, SetEmail] = useState();
    const [isLoading, setIsLoading] = useState(false);

    function OpenPage(path) {
        console.log("HELLO:- ", path);
    }
    
    const submit = (e) => {
        e.preventDefault();
        if (!email) {
            ToasterWarning('Please Enter Your Email..')
            return
        }

        try {
            const data = { email };
            const SubscribeData = `${urlConstant.Subscribe.SubscribePost}`;
            axios.post(SubscribeData, data).then(() => {
                ToasterSuccess("Success...!!");
                setIsLoading(false)
            })
        }
        catch (error) {
            ToasterError("Error")
            setIsLoading(false)
        }
    }
    return (
        <div>
            {isLoading ? <Loding /> : Footer}
            <ToastContainer />
            <footer className="main">
                <section className="newsletter mb-15 wow animate__animated animate__fadeIn">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="position-relative newsletter-inner">
                                    <div className="newsletter-content marginleft">
                                        {/* <div className="newsletter-content"> */}
                                        <h2 className="mb-20">
                                            Stay home &amp; get your daily <br />
                                            needs from our shop
                                        </h2>
                                        <p className="mb-45">Start You'r Daily Shopping with <span className="text-brand"> Colebrook Mart</span></p>
                                        <form className="form-subcriber d-flex">
                                            <input type="email" value={email} onChange={(e) => { SetEmail(e.target.value) }} placeholder="Your emaill address" />
                                            <button className="btn" type="submit" onClick={submit}>Subscribe</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="section-padding footer-mid">
                    <div className="container pt-15 pb-20">
                        <div className="row">
                            <div className="col">
                                <div className="widget-about font-md mb-md-3 mb-lg-3 mb-xl-0 wow animate__animated animate__fadeInUp mt-15" data-wow-delay={0}>
                                    <div className="logo mb-30">
                                        <a className="mb-15"><img src={Logo} alt="logo" /></a>
                                        <p className="font-lg text-heading">{FooterDesc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-link-widget col wow animate__animated animate__fadeInUp" data-wow-delay=".1s">
                                <h4 className="widget-title">Company</h4>
                                <ul className="footer-list mb-sm-5 mb-md-0">
                                    {/* <li><Link to={"#"}>About Us</Link></li> */}
                                    <li><Link to={"/Contact"}>Contact Us</Link></li>
                                    <li><Link to={"/Privacy-Policy"}>Privacy Policy</Link></li>
                                    <li><Link to={"/Terms-Service"}>Terms &amp; Conditions</Link></li>
                                    <li><Link to={"/Refund-Policy"}>Refund Policy</Link></li>
                                    <li><Link to={"/Return-Exchange-Policy"}>Return & Exchange Policy</Link></li>
                                    <li><Link to={"/Shipping-Delivery"}>Shipping & Delivery</Link></li>
                                </ul>
                            </div>
                            <div className="footer-link-widget col wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                                <h4 className="widget-title">Account</h4>
                                <ul className="footer-list mb-sm-5 mb-md-0">
                                    <li><Link to={"/OrderTrack"}>Order Tracking</Link></li>
                                    <li><Link to={"/SupportTicket"}>Support Ticket</Link></li>
                                    <li><Link to={"/Cart"}>View Cart</Link></li>
                                </ul>
                            </div>
                            <div className="footer-link-widget col wow animate__animated animate__fadeInUp" data-wow-delay=".4s">
                                <h4 className="widget-title">Popular</h4>
                                <ul className="footer-list popular mb-sm-5 mb-md-0">
                                    {
                                    AllCategory.map((item, i) => {
                                        return (
                                            <> <li> <Link to={"/ShopProduct/"+item.name}>{item.name}</Link> </li> </>
                                        )
                                    })
                                    }
                                </ul>
                            </div>
                            <div className="footer-link-widget widget-install-app col wow animate__animated animate__fadeInUp mt-15" data-wow-delay=".5s">
                                <ul className="contact-infor">
                                    <li><img src="../assets/imgs/theme/icons/icon-location.svg" alt="/" /><strong>Address: </strong> <span>{FooterAddress}</span></li>
                                    <li><img src="../assets/imgs/theme/icons/icon-contact.svg" alt="/" /><strong>Call Us:</strong><span>{FooterPhone}</span></li>
                                    <li><img src="../assets/imgs/theme/icons/icon-email-2.svg" alt="/" /><strong>Email:</strong><span>{FooterEmail}</span></li>
                                </ul>
                                <hr />
                                <h4 className="widget-title">Payment</h4>
                                <img className src="../assets/imgs/theme/payment-method.png" alt="/" />
                            </div>
                        </div>
                    </div>

                </section>
                <div className="container pb-30 wow animate__animated animate__fadeInUp" data-wow-delay={0}>
                    <div className="row align-items-center">
                        <div className="col-12 mb-30">
                            <div className="footer-bottom" />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6">
                            <p className="font-sm mb-0">© 2023, <strong className="text-brand"> Kingoodie</strong> - Ecommerce website </p>
                        </div>
                        <div className="col-xl-4 col-lg-6 text-center d-none d-xl-block">
                            <div className="hotline d-lg-inline-flex mr-30">

                            </div>
                            <div className="hotline d-lg-inline-flex">

                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 text-end d-none d-md-block">
                        <div class="mobile-social-icon">
                            <h6>Follow Us</h6>
                            {FacebookLink && <a href={FacebookLink}><img src="../assets/imgs/theme/icons/icon-facebook-white.svg" alt="" /></a>}
                            {TwitterLink && <a href={TwitterLink}><img src="../assets/imgs/theme/icons/icon-twitter-white.svg" alt="" /></a>}
                            {InstagramLink && <a href={InstagramLink}><img src="../assets/imgs/theme/icons/icon-instagram-white.svg" alt="" /></a>}
                            {LinkedinLink && <a href={LinkedinLink}><img src="../assets/imgs/theme/icons/icon-linkedin.svg" alt="" /></a>}
                            {YoutubeLink && <a href={YoutubeLink}><img src="../assets/imgs/theme/icons/icon-youtube-white.svg" alt="" /></a>}
                        </div>
                            <p className="font-sm">Designed by <a href="https://anant-solutions.com" target='_blank'>Anant Solutions </a>. All rights reserved </p>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Footer;