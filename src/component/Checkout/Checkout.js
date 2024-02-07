import React, { useState, useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Link } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import CommonService from "../../services/commonService";
import urlConstant from "../../constants/urlConstant";
import { ToasterSuccess, ToasterWarning, ToasterError } from "../../common/toaster";
import { ToastContainer } from "react-toastify";
import StripeCheckout from 'react-stripe-checkout';
import { useAppContext } from '../../context/index';
import axios from 'axios';
import { config } from '../../constants/config';
import { useShippingContext } from '../../context/shippingContext';
import Select2 from "react-select2-wrapper";

function Checkout() {
    let common = new CommonService();
    const { Loding, user_id, Logo, UserEmail ,setTotalCount} = useAppContext();
    const { CreateOrder } = useShippingContext();

    const [CouponCode, SetCouponCode] = useState('');
    const [Name, SetName] = useState("");
    const [Address, SetAddress] = useState("");
    const [state, Setstate] = useState(null);
    const [city, Setcity] = useState("");
    const [Country, SetCountry] = useState("");
    const [PostCode, SetPostCode] = useState("");
    const [PhoneNumber, SetPhoneNumber] = useState("");
    const [Email, SetEmail] = useState("");
    const [AdditionalInfomation, SetAdditionalInfomation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [ListStates, setListStates] = useState([]);
    const [ListCountries, setListCountries] = useState([]);
    const [ListCity, setListCity] = useState([]);
    const [PaymentTypesList, setPaymentTypesList] = useState([]);
    const [PaymentTypes, setPaymentTypes] = useState('cash_on_delivery');
    const [Paymentsuccess, setPaymentsuccess] = useState("");
    const [PaymentStatus, setPaymentStatus] = useState('unpaid');
    const [payment_method, setpayment_method] = useState('cod');
    const [PaypalPaymentId, setPaypalPaymentId] = useState(null);
    const [GetCart, SetGetCart] = useState([]);
    const [CouponResult, SetCouponResult] = useState(localStorage.getItem('discount'));
    const [AddressList, setAddressList] = useState([]);
    const [PinMessage, setPinMessage] = useState(null);
    const [Showcodbtn, setshowcodbtn] = useState(0);
    const [PaymentOrderId, setPaymentOrderId] = useState(null);
    const [onlineDescount, setonlineDescount] = useState(0);
    const [onlineSubTotalPrice, setonlineSubTotalPrice] = useState(0);

    //PayPal
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderID, setOrderID] = useState(false);
    // Stripe
    const [showStripe, setShowStripe] = useState(false);
    const [name, setname] = useState(100);

    var Sub_Total_price = GetCart.map(item => item.price * item.quantity).reduce((total, value) => total + value, 0);
    var main_Sub_Total_price = Sub_Total_price - (Sub_Total_price * 5 / 100);
    console.log('main sub check pay:', main_Sub_Total_price); 

    const SubmitHandler = async (e) => {
        e.preventDefault();

        const login_type = payment_method == 'cod' ? 1 : 2;

        if (login_type == 2) {
            if (!PaymentTypes) {
                ToasterWarning('Please select payment method')
                return
            }
        }
        
        if(!city){
            ToasterWarning('Please select another address')
            return
        }
        if (!Name || !Address || !state || !city || !PostCode || !PhoneNumber || !Email || !payment_method) {
            
            ToasterWarning('Please select or add the address')
            return
        }

        if(payment_method != 'cod'){
            const onlineDescount = (Sub_Total_price * 5 / 100);
            const SubTotalPrice = Sub_Total_price - onlineDescount;
            setonlineDescount(onlineDescount);
            setonlineSubTotalPrice(SubTotalPrice);
        } 
        
        
        
        if (PaymentTypes == "Razorpay") {
            openPayModal()
            setPaymentTypes('Razorpay');
            document.getElementById('Stripe').style.display = "none";
            document.getElementById('Paypal').style.display = "none";
        } else
            if (PaymentTypes == "Stripe") {
                setShowStripe(true);
                setPaymentTypes('Stripe');
                document.getElementById('Razorpay').style.display = "none";
                document.getElementById('Paypal').style.display = "none";
            } else {
                if (PaymentTypes == "Paypal") {
                    // alert("Paypal");
                    setShow(true);
                    setPaymentTypes('Paypal');
                    document.getElementById('Razorpay').style.display = "none";
                    document.getElementById('Stripe').style.display = "none";
                }
            }
        try {
            setIsLoading(true)
            const Data = { CouponCode, name: Name, address: Address, state_id: state, country_id: Country, city_id: city, postal_code: PostCode, phone: PhoneNumber, email: Email, AdditionalInfomation, user_id, payment_method: login_type, total_amount: Math.round(Sub_Total_price), address_same_type: 1, payment_status: PaymentStatus, payment_type: PaymentTypes};

            const ContactData = `${urlConstant.Checkout.PostCheckout}`;
            axios.post(ContactData, Data).then((res) => {
                if (res.data.status == true) {
                    ToasterSuccess("Order Successfully placed...!!");
                    window.location.href = '/Dashboard';
                } else {
                    ToasterError(res.data.message)
                }
                setIsLoading(false);
            }).catch((res) => {
                console.log("error");
            })
        }
        catch (error) {
            // ToasterError("Error")
            setIsLoading(false)
        }
    }

    const pay = (e) => {
        setPaymentTypes(e.target.alt)
    }

    
    function GetAllCart() {
        const tempid = localStorage.getItem('tempid');
        const cartid = `?tempuserid=${tempid}`;
        const GetAllCart = `${urlConstant.Cart.GetCart}${cartid}`;
        common.httpGet(GetAllCart).then(function (res) {
            if(res?.data?.data[0]?.cart_items){
                SetGetCart(res.data.data[0].cart_items);
                setTotalCount(res?.data?.data[0]?.cart_items)
            }else{
                setTotalCount([])
                SetGetCart([])
            }
        }).catch(function (error) {
            // ToasterError("Error");
        });
    }

    function GetPaymentTypes() {
        const PaymentTypes = `${urlConstant.Checkout.GetPaymentTypes}`;
        common.httpGet(PaymentTypes).then(function (res) {
            setPaymentTypesList(res.data);
            setIsLoading(false)
        }).catch(function (error) {
            // ToasterError("Error");
        });
    }

    function handleCountryChange(e) {
        SetCountry(e.target.value);
        StatesGet(e.target.value);
    };

    function handleStateChange(e) {
        Setstate(e.target.value);
        CityGet(e.target.value);
    };

    const handleCityChange = (e) => {
        Setcity(e.target.value);
    };

    function CountriesGet() {
        const listOfCountry = [{
            id : '',
            text : "Select Country",
        }];
        const GetCountries = `${urlConstant.Checkout.Countries}`;
        common.httpGet(GetCountries).then(function (res) {
            const countryList = res.data.data;
            countryList.forEach(function countriesList(item, index){
                const myArray = {
                    id : item.id,
                    text : item.name,
                }
                listOfCountry.push(myArray);
            })
            setListCountries(listOfCountry);
        }).catch(function (error) {
            // ToasterError("Error");
        });
    }

    function CityGet(state_id = null) {
        if(state_id == null) {
            setIsLoading(false)
        }
        const Getcity = `${urlConstant.Checkout.city}/`+state_id;
        common.httpGet(Getcity).then(function (res) {
            let listOfCity = [{
                id : '',
                text : "Select City",
            }];
            const cityList = res.data.data;
            cityList.forEach(function citiesList(item, index){
                const myArray = {
                    id : item.id,
                    text : item.name,
                }
                listOfCity.push(myArray);
            })
            setListCity(listOfCity);
        }).catch(function (error) {
                // ToasterError("Error");
        });
    }

    function StatesGet(country_id = null) {
        if(country_id == null) {
            setIsLoading(false)
        }
        const StatesData = `${urlConstant.Checkout.States}/`+country_id;
        common.httpGet(StatesData).then(function (res) {
            const listOfState = [{
                id : '',
                text : "Select State",
            }];
            const stateList = res.data.data;
            stateList.forEach(function statesList(item, index){
                const myArray = {
                    id : item.id,
                    text : item.name,
                }
                listOfState.push(myArray);
            })
            setListStates(listOfState);
        }).catch(function (error) {
                // ToasterError("Error");
        });
    }

    
    function ApplyCoupon(CouponCode) {
        if (!CouponCode) {
            ToasterWarning('Please Enter Coupon Code')
            return
        }
        try {
            setIsLoading(true)
            const Data = { coupon_code: CouponCode, user_id: parseInt(user_id) }
            const CouponData = `${urlConstant.ApplyCoupon.PostApplyCoupon}`;
            axios.post(CouponData, Data).then((res) => {
                // ToasterSuccess("Success...!!");
                ToasterSuccess(res.data.message);
                SetCouponResult(res.data.discount);
                localStorage.setItem('discount', res.data.discount);
                setIsLoading(false)
            })
        }
        catch (error) {
            // ToasterError("Error")
        }
    }

    function CouponRemove(CouponCode) {
        try {
            setIsLoading(true)
            const Data = { user_id: parseInt(user_id) }
            const CouponData = `${urlConstant.ApplyCoupon.RemoveCoupon}`;
            axios.post(CouponData, Data).then((res) => {
                ToasterSuccess(res.data.message);
                SetCouponResult(0);
                localStorage.removeItem('discount');
                SetCouponCode('');
                setIsLoading(false)
                // window.location.href = window.location.href
            })
        }
        catch (error) {
            // ToasterError("Error")
        }
    }

    //RazorPay
    const options = {
        key: config.RazorPayKey,
        amount: (Math.round(main_Sub_Total_price) - CouponResult) * 100,
        // amount: (Sub_Total_price - CouponResult) * 100,
        name: 'colebrook',
        description: 'some description',
        image: 'https://colebrooknow.com/admin/public/uploads/all/Frame.svg',
        handler: function (response) {
            setPaymentsuccess(response.razorpay_payment_id)
            if(response.razorpay_payment_id) {
                setTimeout(() => {
                    setPaymentOrderId(response.razorpay_payment_id);
                    setPaymentStatus('paid');
                }, 500);
                setTimeout(() => {
                    placeOrder(response.razorpay_payment_id);
                }, 1700);
                
            }

        },
        prefill: {
            name: Name,
            contact: PhoneNumber,
            email: Email
        },
        notes: {
            address: Address
        },
        theme: {
            color: 'blue',
            hide_topbar: false
        }
    };

    const openPayModal = () => {
        console.log('check pay:', onlineSubTotalPrice - CouponResult);
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    };
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    //PayPal
    var paypalPrice = (main_Sub_Total_price - CouponResult) / 81;
    // var paypalPrice = (Sub_Total_price - CouponResult) / 81;
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "Kingoodie - Order",
                    amount: {
                        currency_code: "USD",
                        value: paypalPrice.toFixed(2),
                        // value: Sub_Total_price - CouponResult,
                    },
                },
            ],
        }).then((orderID) => {
            setOrderID(orderID);
            return orderID;
        });
    };
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            setSuccess(true);
            console.log(details);
            setPaypalPaymentId(details.purchase_units[0].payments.captures[0].id);
        });
    };
    useEffect(() => {
        if (success) {
            placeOrder(PaypalPaymentId);
        }
    }, [success]);


    //Stripe
    const priceForStripe = (main_Sub_Total_price - CouponResult) * 100;
    // const priceForStripe = (Sub_Total_price - CouponResult) * 100;
    const publishableKey = config.StripeKey;

    const onToken = async (token, payment_methods) => {
        try {
            console.log(token);
            console.log(token.id);
            const Data = { token_id: token.id, amount: priceForStripe };
            const stripeChargeUrl = `${urlConstant.Checkout.stripeCharge}`;
            axios.post(stripeChargeUrl, Data).then((res) => {
                console.log(res);
                if(res.data.success == false) {
                    ToasterError("Please try with different payment gateway");
                    setShowStripe(false);
                } else {
                    ToasterSuccess("Order Placed Successfully...!!");
                    // window.location.href = '/Dashboard';
                }
                setIsLoading(false);
            }).catch(
                console.log("error")
            )
          } catch (error) {
            console.error(error);
          }
    };

    function placeOrder(payment_id = null) {
        setIsLoading(true)
        const Data = { CouponCode, name: Name, address: Address, state_id: state, country_id: Country, city_id: city, postal_code: PostCode, phone: PhoneNumber, email: Email, AdditionalInfomation, user_id, payment_method: PaymentTypes, total_amount: Math.round(main_Sub_Total_price), address_same_type: 1, payment_status: PaymentStatus, payment_type: PaymentTypes, payment_id};
        const PlaceOrderUrl = `${urlConstant.Checkout.PlaceOrder}`;
        axios.post(PlaceOrderUrl, Data).then(() => {
            ToasterSuccess("Order Placed Successfully...!!");
            setIsLoading(false);
            window.location.href = '/Dashboard';
        }).catch(
            console.log("error")
        )
    }

    function GetaddressList() {
        const addressData = `${urlConstant.User.UserAddresses}/`+parseInt(user_id);
        common.httpGet(addressData).then(function (res) {
                const addList = res.data.data;
                setAddressList(res.data.data);
        }).catch(function (error) {
            // ToasterError("Error");
        });
    }
    
    const setShippingAddress = async (address_id) => {
        setIsLoading(true)
        const GetAddress = `${urlConstant.User.UserUpdateAddresses}/`+address_id;
        await common.httpGet(GetAddress).then(function (res) {
            SetName(res.data.data.name);
            SetEmail(`${UserEmail}`);
            SetPhoneNumber(res.data.data.phone);
            SetAddress(res.data.data.address);
            SetPostCode(res.data.data.postal_code);
            StatesGet(res.data.data.country_id);
            CityGet(res.data.data.state_id);
            setTimeout(() => {
                SetCountry(res.data.data.country_id);
                Setstate(res.data.data.state_id);
                Setcity(res.data.data.city_id);
                setIsLoading(false);
            }, 3000);

        }).catch(function (error) {
            // ToasterWarning(error.message)
            console.log(error);
        });
    }

    function GetPinCode(PinCode) {
        const GetPinCode1 = `${urlConstant.ShippingApi.Pincode}`;
        const Data = {
          "data": {
            "pincode": PinCode,
            "access_token": config.access_token,
            "secret_key": config.secret_key
          }
        }
        console.log(PinCode);
        axios.post(GetPinCode1, Data).then(function (res) {
          const delhiveryArray = Object.values(res.data.data[PinCode].delhivery);
          setPinMessage(null);
          setshowcodbtn(0);
          if (delhiveryArray[0] == 'Y' || delhiveryArray[1] == 'Y') {
            setPinMessage('This product is available for courier delivery at '+PinCode+' location.');
          } else if(delhiveryArray[0] == 'Y' && delhiveryArray[1] == 'N'){
            setshowcodbtn(1);
            setPinMessage('This product is not available for cash on drlivary.');
          } else {
            setPinMessage('This product is not available for courier delivery.');
          } 
          console.log(delhiveryArray);
        })
        .catch(function (error) {
          ToasterError("Error");
        });
      }

    useEffect(() => {
        GetPaymentTypes();
        CountriesGet();
        GetaddressList();
        GetAllCart();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
         // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get("success")) {
            alert("Order placed! You will receive an email confirmation.");
        }
        if (query.get("canceled")) {
            alert("Order canceled -- continue to shop around and checkout when you're ready.");
        }
    }, [Country, state])

    return (
        <div>
            {isLoading ? <Loding /> : Checkout}
            {/* <Header /> */}
            <ToastContainer />
            {/* <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css"></link> */}
            <main className="main">
                <div className="page-header breadcrumb-wrap">
                    <div className="container">
                        <div className="breadcrumb">
                            <a rel="nofollow"><i className="fi-rs-home mr-5" />Home</a>
                            <span /> Shop
                            <span /> Checkout
                        </div>
                    </div>
                </div>
                <div className="container mb-80 mt-50">
                    <div className="row">
                        <div className="col-lg-10 mb-40">
                            <h1 className="heading-2 mb-10">Checkout</h1>
                            <div className="d-flex justify-content-between">
                                <h6 className="text-body">There are <span className="text-brand">{GetCart.length}</span> products in your cart</h6>
                            </div>
                        </div>
                        <div className="col-lg-2 mb-40" style={{ textAlign: "end" }}>
                            <Link to="/ShopProduct" className="btn btn-fill-out btn-block mt-30">←  Continue Shopping</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="row mb-50">
                                {/* <div className="col-lg-6 mb-sm-15 mb-lg-0 mb-md-3">
                                    <div className="toggle_info">
                                        <span><i className="fi-rs-user mr-10" /><span className="text-muted font-lg">Already have an account?</span> <Link to="/Login" className="collapsed font-lg" >Click here to login</Link></span>
                                    </div>
                                </div> */}
                                <div className="col-lg-6 apply-coupon">
                                    <input type="text" placeholder="Enter Coupon Code..." value={CouponCode} onChange={(e) => { SetCouponCode(e.target.value) }} />
                                    <button className="btn btn-md button-size" onClick={() => { ApplyCoupon(CouponCode) }}>Apply Coupon</button>
                                </div>
                            </div>
                            <div className="row">
                                <h4 className="mb-30">My Address</h4>
                                <div className={AddressList.length == 0 ? 'addresses hideAddress' : 'addresses'}>
                                    {/* <div className="row product-grid-4"> */}
                                    <div class="grid userAddresses">
                                        {
                                            AddressList.map((item, i) => {
                                                return (
                                                    <>
                                                        {<label class="card">
                                                            <input name="plan" class="radio" type="radio" onClick={() => { GetPinCode(item.postal_code) }} value={item.id} onChange={(e) => { setShippingAddress(e.target.value) }}/>
                                                            <span class="plan-details">
                                                                <h2>{item.name}</h2><br/>
                                                                <span>{item.address}, {item.city_name}, {item.state_name}, {item.country_name} - {item.postal_code}</span><br/>
                                                                <h3>Mobile: <b>{item.phone}</b></h3>
                                                            </span>
                                                        </label>
                                                        }
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                {PinMessage && <div style={{ fontSize: "14px", color: "red" }}>{PinMessage}</div>}
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <div className="chek-form">
                                        <div className="custome-checkbox">
                                            <input className="form-check-input" type="checkbox" name="checkbox" id="addaddress" />
                                            <label className="form-check-label label_info" data-bs-toggle="collapse" data-target="#newAddress" href="#newAddress" aria-controls="newAddress" htmlFor="addaddress"><span>Add New Address</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div id="newAddress" className="different_address collapse in">
                                    <form method="post">
                                        <div className="row">
                                            <div className="form-group col-lg-6">
                                                <input type="text" required name="name" placeholder="Full name *" value={Name || ""} onChange={(e) => { SetName(e.target.value) }} />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="text" name="billing_address" required placeholder="Address*" value={Address || ""} onChange={(e) => { SetAddress(e.target.value) }} />
                                            </div>
                                        </div>
                                        <div className="row shipping_calculator">
                                            <div className="form-group col-lg-6">
                                                <div className="custom_select">
                                                    {
                                                        <Select2 className="form-control select-active" defaultValue={Country} data = {ListCountries} onChange={handleCountryChange}/>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <div className="custom_select">
                                                    {
                                                        <Select2 className="form-control select-active" defaultValue={state} data = {ListStates} onChange={handleStateChange}/>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-lg-6">
                                                <div className="custom_select cityDropdown ">
                                                    {
                                                        <Select2 className="form-control select-active" defaultValue={city} data = {ListCity} onChange={handleCityChange}/>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group col-lg-6">
                                                {PinMessage && <div style={{ fontSize: "14px", color: "red" }}>{PinMessage}</div>}
                                                <input required type="text" name="zipcode" onBlur={() => { GetPinCode(PostCode) }} placeholder="Postcode / ZIP *" value={PostCode || ""} onChange={(e) => { SetPostCode(e.target.value) }} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-lg-6">
                                                <input required type="phone" maxLength={10} name="phone" placeholder="Phone *" value={PhoneNumber || ""} onChange={(e) => { SetPhoneNumber(e.target.value.replace(/\D/g, '')) }} />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input required type="text" name="email" placeholder="Email address *" value={Email || ""} onChange={(e) => { SetEmail(e.target.value) }} />
                                            </div>
                                        </div>
                                        <div className="form-group mb-30">
                                            <textarea rows={5} placeholder="Additional information" defaultValue={""} value={AdditionalInfomation || ""} onChange={(e) => { SetAdditionalInfomation(e.target.value) }} />
                                        </div>
                                        <div className="ship_detail">
                                            <div className="form-group">
                                                <div className="chek-form">
                                                    <div className="custome-checkbox">
                                                        <input className="form-check-input" type="checkbox" name="checkbox" id="differentaddress" />
                                                        <label className="form-check-label label_info" data-bs-toggle="collapse" data-target="#collapseAddress" href="#collapseAddress" aria-controls="collapseAddress" htmlFor="differentaddress"><span>Ship to a different address?</span></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="collapseAddress" className="different_address collapse in">
                                                <div className="row">
                                                    <div className="form-group col-lg-6">
                                                        <input type="text" required name="name" placeholder="Full name *" value={Name || ""} onChange={(e) => { SetName(e.target.value) }} />
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <input type="text" name="billing_address" required placeholder="Address*" value={Address || ""} onChange={(e) => { SetAddress(e.target.value) }} />
                                                    </div>
                                                </div>
                                                <div className="row shipping_calculator">
                                                    <div className="form-group col-lg-6">
                                                        <div className="custom_select">
                                                            {
                                                                <Select2 className="form-control select-active" defaultValue="" data = {ListCountries} onChange={handleCountryChange}/>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <div className="custom_select">
                                                            {
                                                                <Select2 className="form-control select-active" defaultValue="" data = {ListStates} onChange={handleStateChange}/>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group col-lg-6">
                                                        {/* <input required type="text" name="city" placeholder="City / Town *" value={city || ""} onChange={(e) => { Setcity(e.target.value) }} /> */}
                                                        <div className="custom_select cityDropdown">
                                                            {
                                                                <Select2 className="form-control select-active" defaultValue="" data = {ListCity} onChange={handleCityChange}/>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        {PinMessage && <div style={{ fontSize: "14px", color: "red" }}>{PinMessage}</div>}
                                                        <input required type="text" name="zipcode" onBlur={() => { GetPinCode(PostCode) }} placeholder="Postcode / ZIP *" value={PostCode || ""} onChange={(e) => { SetPostCode(e.target.value) }} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group col-lg-6">
                                                        <input required type="phone" maxLength={10} name="phone" placeholder="Phone *" value={PhoneNumber || ""} onChange={(e) => { SetPhoneNumber(e.target.value.replace(/\D/g, '')) }} />
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <input required type="text" name="email" placeholder="Email address *" value={Email || ""} onChange={(e) => { SetEmail(e.target.value) }} />
                                                    </div>
                                                </div>
                                                <div className="form-group mb-30">
                                                    <textarea rows={5} placeholder="Additional information" defaultValue={""} value={AdditionalInfomation || ""} onChange={(e) => { SetAdditionalInfomation(e.target.value) }} />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="border p-40 cart-totals ml-30 mb-50">
                                <div className="d-flex align-items-end justify-content-between mb-30">
                                    <h4>Your Order</h4>
                                    <h6 className="text-muted">Subtotal</h6>
                                </div>
                                <div className="divider-2 mb-30" />
                                <div className="table-responsive order_table checkout">
                                    <table className="table no-border">
                                        <tbody>
                                            {
                                                GetCart.map((item, i) => {
                                                    const { product_thumbnail_image, price, variation, product_name, currency_symbol, quantity } = item;
                                                    return (
                                                        <>
                                                            <tr key={i}>
                                                                <td className="image product-thumbnail"><img src={product_thumbnail_image} alt={product_thumbnail_image} /></td>
                                                                <td>
                                                                    <h6 className="w-160 mb-5"><a className="text-heading">{product_name}</a></h6>
                                                                    <div className="product-rate-cover">
                                                                        <div className="product-rate d-inline-block">
                                                                            <div className="product-rating" style={{ width: '90%' }}>
                                                                            </div>
                                                                        </div>
                                                                        <span className="font-small ml-5 text-muted"> (4.0)</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <h6 className="text-muted pl-20 pr-20">x {quantity}</h6>
                                                                </td>
                                                                <td>
                                                                    <h4 className="text-brand">{currency_symbol + price * quantity}</h4>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <table className="table no-border cart-subtotal-box">
                                        <tbody>
                                            <tr>
                                                <td scope="col" colSpan={2}>
                                                    <div className="divider-2 mt-10 mb-10" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="cart_total_label">
                                                    <h6 className="text-muted">Subtotal</h6>
                                                </td>
                                                <td className="cart_total_amount">
                                                    <h4 className="text-brand text-end">₹{Sub_Total_price}</h4>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="cart_total_label">
                                                    <h6 className="text-muted">Shipping</h6>
                                                </td>
                                                <td className="cart_total_amount">
                                                    <h5 className="text-heading text-end">Free </h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="cart_total_label">
                                                    <h6 className="text-muted">Coupon Discount</h6>
                                                </td>
                                                <td className="cart_total_amount">
                                                    <h5 className="text-heading text-end">- {CouponResult == null ? "₹0" : "₹" + CouponResult}</h5>
                                                </td>
                                            </tr>
                                            {
                                                onlineDescount == 0 || payment_method === 'cod'? null :
                                                <tr>
                                                    <td className="cart_total_label">
                                                        <h6 className="text-muted">Discount on MRP (5%)</h6>
                                                    </td>
                                                    <td className="cart_total_amount">
                                                        <h5 className="text-heading text-end">- ₹{Math.round(onlineDescount)}</h5>
                                                    </td>
                                                </tr>
                                            }
                                            <tr>
                                                <td className="cart_total_label">
                                                    <h6 className="text-muted"></h6>
                                                </td>
                                                <td className="cart_total_amount">
                                                    <a><p className="text-danger text-end" onClick={CouponRemove}>{CouponResult ? "Remove Coupon" : ""}</p></a>
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
                                                    {
                                                        onlineDescount == 0 || payment_method == "cod"? 
                                                        <h4 className="text-brand text-end">₹{Math.round(Sub_Total_price) - CouponResult}</h4>:
                                                        <h4 className="text-heading text-end">₹{Math.round(onlineSubTotalPrice) - CouponResult}</h4>
                                                    }
                                                </td>
                                            </tr> 
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="payment ml-30">
                                <h4 className="mb-30">Payment</h4>
                                <label style={{ color: 'red' }}>Please use <b>Razorpay</b> Payment gateway if you are from india.</label>
                                <div className="payment_option">
                                    {/* <div className="custome-radio">
                                        <input className="form-check-input" required type="radio" name="payment_option" id="exampleRadios3" defaultChecked />
                                        <label className="form-check-label" htmlFor="exampleRadios3" data-bs-toggle="collapse" data-target="#bankTranfer" aria-controls="bankTranfer">Direct Bank Transfer</label>
                                    </div> Showcodbtn */}
                                    {
                                        Showcodbtn == 0 ? 
                                        <div className="custome-radio" style={{ display: show == true || showStripe == true ? "none" : "" }}>
                                            <input className="form-check-input" required type="radio" name="payment_option" id="cod" value="cod" checked={payment_method === 'cod'} onChange={(e) => { setpayment_method(e.target.value) }} />
                                            <label className="form-check-label" htmlFor="cod" data-bs-toggle="collapse" data-target="#checkPayment" aria-controls="checkPayment">Cash on delivery</label>
                                        </div> 
                                        : null
                                    }
                                    
                                    <div className="custome-radio">
                                        <input className="form-check-input" required type="radio" name="payment_option" id="online" value="online" checked={payment_method === 'online'} onChange={(e) => { setpayment_method(e.target.value) }} />
                                        <label className="form-check-label" htmlFor="online" data-bs-toggle="collapse" data-target="#paypal" aria-controls="paypal">Online Getway <span style={{color:"green"}}>(Instant 5% less on online payment.)</span></label>
                                    </div>
                                </div>
                                {
                                    payment_method == "online" ? <div className="payment-logo d-flex">
                                        {PaymentTypesList.map((item, i) => {
                                            return (
                                                <>
                                                    <div style={{ padding: "0px" }} key={i} id={item.name}>
                                                        <a>
                                                            <img className="mr-15" src={item.image} alt={item.name} title={PaymentTypes} width="90px" onClick={(e) => { pay(e) }} style={{ border: PaymentTypes == item.name ? "3px solid black" : "", padding: "2px" }} />
                                                        </a>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </div> : null
                                }
                                <PayPalScriptProvider options={{ "client-id": config.PayPal_client_Id }} >
                                    {show ? (
                                        <PayPalButtons
                                            style={{ layout: "vertical" }}
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                        />
                                    ) : null}
                                </PayPalScriptProvider>

                                {showStripe ? (
                                    <StripeCheckout
                                        label='Pay Now'
                                        name='Colebrooknow'
                                        billingAddress
                                        shippingAddress
                                        image={Logo}
                                        description={'Your total is $'+`${priceForStripe}`}
                                        amount={priceForStripe}
                                        currency='USD'
                                        panelLabel='stripe'
                                        token={onToken}
                                        stripeKey={publishableKey}  
                                    />
                                ) : null}

                                <a className="btn btn-fill-out btn-block mt-30" style={{ display: show == true || showStripe == true ? "none" : "" }} onClick={SubmitHandler}>Place an Order<i className="fi-rs-sign-out ml-15" /></a>                                                                        

                                {/* <a className="btn btn-fill-out btn-block mt-30">

                                    <StripeCheckout
                                        label='Pay Now'
                                        name='Colebrooknow'
                                        billingAddress
                                        shippingAddress
                                        image={Logo}
                                        description={`Your total is  ₹${Sub_Total_price - CouponResult}`}
                                        amount={priceForStripe}
                                        panelLabel='stripe'
                                        token={onToken}
                                        stripeKey={publishableKey}
                                    />
                                    <i className="fi-rs-sign-out ml-15" />
                                </a> */}

                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* <Footer/> */}

        </div>

    )
}

export default Checkout;