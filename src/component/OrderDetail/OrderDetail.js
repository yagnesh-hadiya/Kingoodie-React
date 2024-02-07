import React, { useState,useEffect } from 'react'
import CommonService from "../../services/commonService";
import urlConstant from "../../constants/urlConstant";
import { ToasterSuccess, ToasterWarning, ToasterError } from "../../common/toaster";
import { ToastContainer } from "react-toastify";
import axios from 'axios';

function OrderDetail() {
    let common = new CommonService();
    const queryParameters = new URLSearchParams(window.location.search);
    const id = queryParameters.get("id");
    const [subject, Setsubject] = useState();
    const [attachments, Setattachments] = useState('');
    const [file, SetFile] = useState([]);
    const [product_id, Setproduct_id] = useState("");
    const [order_id, SetOrder_id] = useState("");
    const [orderMainId, SetOrderMainId] = useState("");
    const [OrderDetails, SetOrderDetails] = useState([]);
    const [productDetails, SetProductDetails] = useState("");
    const [details, Setdetails] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [ShippingName, SetShippingName] = useState("");
    const [ShippingAddress, SetShippingAddress] = useState("");
    const [ShippingCity, SetShippingCity] = useState("");
    const [ShippingState, SetShippingState] = useState("");
    const [ShippingCountry, SetShippingCountry] = useState("");
    const [ShippingPostalCode, SetShippingPostalCode] = useState("");
    const [ShippingPhone, SetShippingPhone] = useState("");
    const [PaymentStatus, SetPaymentStatus] = useState("");

    const handleFileChange = (e) => {
        SetFile(e.target.files[0]);
        Setattachments(e.target.value);
    };

    const SubmitHandler = async (e) => {
        e.preventDefault();
        if (!subject || !file || !product_id || !details) {
            ToasterWarning('Please enter all the details')
            return
        }
        try {
            const data = { subject, attachments: file, product_id, details };
            const ContactData = `${urlConstant.Contact.PostContact}`;
            await axios.post(ContactData, data, {
                headers: { 
                    "Content-Type": "multipart/form-data"
                }
              }).then(() => {
                ToasterSuccess("Success...!!");
                Setsubject('');
                Setproduct_id('');
                Setdetails('');
                Setattachments(null);
                setIsLoading(false);
            })
        }
        catch (error) {
            ToasterError("Error")
            setIsLoading(false)
        }

    }

    function OrderDetail() {
        try {
            setIsLoading(true)
            const Data = { id:`${id}` }
            const GetOrderDetail = `${urlConstant.Dashboard.OrderDetail}/${id}`;
            common.httpGet(GetOrderDetail, Data).then((res) => {
                SetOrderDetails(res.data.data);
                SetOrder_id(res.data.data.code);
                SetOrderMainId(res.data.data.id);
                OrderSummery();
                setIsLoading(false);

                SetShippingName(res.data.data.shipping_address.name);
                SetShippingAddress(res.data.data.shipping_address.address+', ');
                SetShippingCity(res.data.data.shipping_address.city+', ');
                SetShippingState(res.data.data.shipping_address.state+', ');
                SetShippingCountry(res.data.data.shipping_address.country+' - ');
                SetShippingPostalCode(res.data.data.shipping_address.postal_code);
                SetShippingPhone(res.data.data.shipping_address.phone);
                SetPaymentStatus(res.data.data.payment_status);
            })    
        }
        catch (error) {
          ToasterError("Error")
        }
    }

    

    function OrderSummery() {
        try {
          const Data = { id:`${id}` }
          const GetOrderDetail = `${urlConstant.Dashboard.OrderSummary}/${id}`;
          common.httpGet(GetOrderDetail, Data).then((res) => {
            SetProductDetails(res.data.data);
          })
    
        }
        catch (error) {
          ToasterError("Error")
        }
    }


    

    useEffect(() => {
        OrderDetail();        
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
                            <span /> Pages <span />Order Detail
                        </div>
                    </div>
                </div>
                <div className="page-content pt-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9 mb-40 d-flex align-items-center">
                                <h1 className="heading-2 mb-10 mr-30">Order </h1><h5>#{order_id}</h5>
                            </div>
                            <div className="col-lg-3 mb-40 d-flex align-items-center justify-content-end">
                                <a className="btn btn-fill-out btn-block" onClick={() => Setproduct_id(orderMainId)} data-bs-toggle="collapse" data-target="#getSupport" href="#getSupport" aria-controls="getSupport" htmlFor="getSupport">
                                    Cancel Order
                                </a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 m-auto">
                                <section className="mb-50">
                                    <div className="row">
                                        <div className="col-xl-8">
                                            <div className="table-responsive shopping-summery">
                                                <table className="table table-wishlist">
                                                    <thead>
                                                        <tr className="main-heading">
                                                            <th className="custome-checkbox start pl-30"></th>
                                                            <th scope="col" colSpan={2}>Product</th>
                                                            <th scope="col"  style={{ textAlign: 'center' }}>Unit Price</th>
                                                            <th scope="col"  style={{ textAlign: 'center' }}>Quantity</th>
                                                            <th scope="col"  style={{ textAlign: 'center' }}>Subtotal</th>
                                                            {/* <th scope="col" className="end"  style={{ textAlign: 'center' }}>Support</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            productDetails == '' ?
                                                                <>
                                                                    <tr >
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td><h2>Oops, no Order in your list</h2></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr></> :
                                                                productDetails.map((item, i) => {
                                                                    const image = item.thumbnailImage == '' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9zuWJ0xU19Mgk0dNFnl2KIc8E9Ch0zhfCg&usqp=CAU' : item.thumbnailImage
                                                                    const total = item.price * item.quantity;
                                                                    return (
                                                                        <>
                                                                            <tr className="pt-30" key={i}>
                                                                                <td></td>
                                                                                <td className="image product-thumbnail pt-40"><img src={image} alt={image} /></td>
                                                                                <td className="product-des product-name">
                                                                                    <h6 className="mb-5">{item.name}</h6>
                                                                                    <div className="product-rate-cover">
                                                                                        <div className="product-rate d-inline-block">
                                                                                            <div className="product-rating" style={{ width: '90%' }}>
                                                                                            </div>
                                                                                        </div>
                                                                                        <span className="font-small ml-5 text-muted"> (4.0)</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="price text-center" data-title="Price">
                                                                                    <h4 className="text-body">₹ {item.price}</h4>
                                                                                </td>
                                                                                <td className="text-center detail-info" data-title="Stock">
                                                                                    <div className="detail-extralink mr-15">
                                                                                        <h4 className="text-body">{item.quantity}</h4>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="price text-center" data-title="Price">
                                                                                    <h4 className="text-brand">₹ {total}</h4>
                                                                                </td>
                                                                                {/* <td className="action text-center" data-title="Remove">
                                                                                    <a className="text-body" onClick={() => Setproduct_id(item.product_id)} data-bs-toggle="collapse" data-target="#getSupport" href="#getSupport" aria-controls="getSupport" htmlFor="getSupport"><img src={serviceImage} alt="Contact Support"  style={{ width: '25%', border: 'none' }}/></a>
                                                                                </td> */}
                                                                            </tr>
                                                                        </>
                                                                    )
                                                                })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div id="getSupport" className="contact-from-area padding-20-row-col collapse in">
                                                <h2 className="mb-10"> Support Ticket </h2>
                                                <form className="contact-form-style mt-30" id="contact-form" action="#" method="post">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-12">
                                                            <div className="input-style mb-20">
                                                            <h6 style={{ padding:"10px" }}>Subject :</h6>
                                                                <input name="subject" placeholder="Your subject*" type="text" value={subject || ""} onChange={(e) => { Setsubject(e.target.value) }} />
                                                            </div>
                                                        </div>                                                                                                                                                                   
                                                        <div className="col-lg-12 col-md-12">
                                                            <div className="input-style mb-20">
                                                                <h6 style={{ padding:"10px" }}>Attachments :</h6>
                                                                <input name="attachments" type="file" value={attachments || ""} onChange={handleFileChange} style={{padding:"18px" }} />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12">
                                                            <div className="textarea-style mb-30">
                                                                <h6 style={{ padding:"10px" }}>Details :</h6>
                                                                <textarea name="details" placeholder="Details*" defaultValue={""} value={details || ""} onChange={(e) => { Setdetails(e.target.value) }} />
                                                            </div>
                                                            <button className="submit submit-auto-width" onClick={SubmitHandler}>Submit</button>
                                                        </div>
                                                    </div>
                                                </form>
                                                <p className="form-messege" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 pl-50 d-lg-block d-none">
                                            <div className="border p-md-4 cart-totals ml-30">
                                                <div className="table-responsive">
                                                    <table className="table no-border">
                                                        <tbody>
                                                            <tr>
                                                                <td className="cart_total_label">
                                                                    <h6 className="text-muted">Shipping Information</h6>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="cart_total_amount">
                                                                    <h5 className="text-heading text-start mb-5">{ShippingName} </h5>
                                                                    <span>{ShippingAddress} {ShippingCity} {ShippingState} {ShippingCountry} {ShippingPostalCode}</span><br />
                                                                    <label><b>Phone: {ShippingPhone}</b></label>                         
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="col" colSpan={2}>
                                                                    <div className="divider-2 mt-10 mb-10" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="cart_total_label">
                                                                    <h6 className="text-muted">Payment Information</h6>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="cart_total_label">
                                                                    <h6 className="text-muted">Payment Method</h6>
                                                                </td>
                                                                <td className="cart_total_amount">
                                                                    <h6 className="text-brand text-end">{OrderDetails.payment_type}</h6>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="cart_total_label">
                                                                    <h6 className="text-muted">Payment Status</h6>
                                                                </td>
                                                                <td className="cart_total_amount">
                                                                    <h6 className="text-brand text-end">{PaymentStatus}</h6>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="col" colSpan={2}>
                                                                    <div className="divider-2 mt-10 mb-10" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="cart_total_label">
                                                                    <h6 className="text-muted">Total</h6>
                                                                </td>
                                                                <td className="cart_total_amount">
                                                                    <h4 className="text-brand text-end">₹{OrderDetails.grand_total}</h4>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div><br/>
                                            {/* <img className="border-radius-15 mt-50" src="assets/imgs/page/login-1.png" alt="/" /> */}
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

export default OrderDetail
