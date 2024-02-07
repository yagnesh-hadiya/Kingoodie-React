import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import CommonService from "../../services/commonService";
import urlConstant from "../../constants/urlConstant";
import { ToasterWarning,ToasterSuccess,ToasterError } from "../../common/toaster";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useAppContext } from "../../context";
import { useShippingContext } from "../../context/shippingContext";
import BestSellers from "../BestSellers/BestSellers";
import {config} from '../../constants/config'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Product.css'
import { Rating } from 'react-simple-star-rating'
import Select2 from "react-select2-wrapper";
import { Helmet } from 'react-helmet';
import { Zoom } from 'reactjs-image-zoom';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';


function Product(props) {
  const id = useParams();
  let common = new CommonService();
  const { user_id, Loding, CartPost, ApplyCoupon } = useAppContext();
  // const { GetPinCode } = useShippingContext();


  const [List, setList] = useState([]);
  const [sizeList, setsizeList] = useState([]);
  const [size, setsize] = useState("");
  const [multipleimageList, setmultipleimageList] = useState([]);
  const [mainImage, setMainImage] = useState([0]);
  const [colors, setcolors] = useState("");
  const [colorsList, setcolorsList] = useState([]);
  const [reviewsList, setreviewsList] = useState([]);
  const [sizechartList, setsizechartList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [increment, SetIncrement] = useState(1);
  const [CouponCode, SetCouponCode] = useState('');
  const [PinCode, SetPinCode] = useState('');
  const [message, SetMessage] = useState('');
  const [PinMessage, setPinMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [Customizations, SetCustomizations] = useState("");
  const [Sleeves, Setsleeves] = useState("");
 
  function GetSingelProducts() {
    setIsLoading(true)
    const GetAllProducts = `${urlConstant.Products.PostSingelProducts}`;
    const Data = { slug: id.id, user_id }
    axios.post(GetAllProducts, Data).then(function (res) {
      console.log(res.data.data.multipleimage);
      setIsLoading(false);
      setList(res.data.data);
      setsizeList(res.data.data.multipleSize);
      setmultipleimageList(res.data.data.multipleimage);
      setcolorsList(res.data.data.colors);
      setreviewsList(res.data.data.reviews);
      setsizechartList(res.data.data.sizeData);
      if(res.data.data.sleeves_option) {
        Setsleeves("Full Sleeves");
      }
      if(res.data.data.colors.length <= 0){
        setcolors(null);
      }
      if(res.data.data.multipleSize.length <= 0){
        setsize(null);
      }
    })
      .catch(function (error) {
        setIsLoading(false);
        ToasterError("Error");
      });
  }

  const [rating, setRating] = useState(0)

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate)
  }

  const handleReset = () => {
    // Set the initial value
    setRating(0)
  }

  const SubmitReviews = async (e) => {
    e.preventDefault();

    if (!message) {
        ToasterWarning('Please All Enter Details')
        return
    }
    try {
        const data = { comment:message, rating: rating, user_id, product_id: List.id };
        const ContactData = `${urlConstant.Products.Reviews}`;
        await common.httpPost(ContactData, data).then(() => {
            ToasterSuccess("Success...!!");
            setIsLoading(false)
        })
    }
    catch (error) {
        ToasterError("Error")
        setIsLoading(false)
    }

}


  const openModel = (e) => {
    if(e == true) {
      setShowModal(e);
      document.querySelector(".body-overlay-1").style.opacity = '1'; 
      document.querySelector(".body-overlay-1").style.visibility = 'visible';
      document.querySelector(".body-overlay-1").style.cursor = 'auto';
      document.querySelector("body").style.overflow = 'hidden';
    } else if(e == false) {
      setShowModal(e);
      document.querySelector(".body-overlay-1").style.opacity = '0'; 
      document.querySelector(".body-overlay-1").style.visibility = 'hidden';
      document.querySelector("body").style.overflow = 'visible'; 
    }
  }

  const defaultImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9zuWJ0xU19Mgk0dNFnl2KIc8E9Ch0zhfCg&usqp=CAU';
  const image = List.thumbnail_img == '' ? defaultImg : List.thumbnail_img;

  const sizeFun = (e) => {
    setsize(e.target.value);
  }
  const colorFun = (e) => {
    setcolors(e.target.value);
  } 

  var settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1

        }
      }
    ]
  };
  function GetPinCode(PinCode) {
    const GetPinCode1 = `${urlConstant.ShippingApi.Pincode}`;
    const Data = {
      "data": {
        "pincode": PinCode,
        "access_token": config.access_token,
        "secret_key": config.secret_key
      }
    }
    axios.post(GetPinCode1, Data).then(function (res) {
      const delhiveryArray = Object.values(res.data.data[PinCode].delhivery);
      setPinMessage(null);
      if (delhiveryArray[0] == 'Y' || delhiveryArray[1] == 'Y') {
        setPinMessage('This product is available for courier delivery at '+PinCode+' location.');
      } else if(delhiveryArray[0] == 'Y' || delhiveryArray[1] == 'N'){
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

  const ListSleeves = ["Full Sleeves", "Half / Short Sleeves"];
  const handleSleevesChange = (e) => {
    console.log(e);
    Setsleeves(e.target.value);
};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    GetSingelProducts();
  }, [id]);
  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: '#Gallary',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <div>
      {isLoading ? <Loding /> : Product}
      <ToastContainer />
      {/* <Header /> */}
      { List.name ? 
        <Helmet>
          <title> {List.name}| kingoodie</title>
          <meta name="title" content={List.meta_title} />
          <meta property="og:title" content={List.meta_title} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content={multipleimageList[mainImage]} /> 
          <meta name="description" content={List.meta_description} />
          <meta name="keywords" content={List.tags} />
        </Helmet>
      : null 
      }
      <main className="main">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/" rel="nofollow"><i className="fi-rs-home mr-5" />Home</Link>
              <span /> <Link to="/">Product</Link>
            </div>
          </div>
        </div>
        
        <div className="container mb-30">
          <div className="row">
            <div className="col-xl-11 col-lg-12 m-auto">
              <div className="row">
                <div className="col-xl-8">
                  <div className="product-detail accordion-detail">
                    <div className="row mb-50 mt-30 align-items-start">
                      <div className="col-md-6 col-sm-12 col-xs-12 mb-md-0 mb-sm-5">
                        <div className="detail-gallery">
                          
                          {/* MAIN SLIDES */}
                          <div className="pswp-gallery product-image" id='Gallary'>
                          <Slider {...settings}>
                            {multipleimageList.map((image, index) => (
                              <a
                                href={image}
                                data-pswp-width='1875'
                                data-pswp-height='2500'
                                key={'Gallary'+index}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img src={image} alt="" />
                              </a>
                            ))}
                            </Slider>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-xs-12 detail-block">
                        <div className="detail-info pr-30 pl-30">
                          {
                            List.InStock == 0 ? <span className="stock-status out-stock">Out of stock</span> :
                              <span className="stock-status in-stock mb-0">In Stock</span>
                          }
                          <h5 className="title-detail" style={{ marginTop: "10px" }}>{List.name}</h5>
                          <div className="product-detail-rating">
                            <div className="product-rate-cover text-end">
                              <div className="product-rate d-inline-block">
                                <div className="product-rating" style={{ width: '90%' }} />
                              </div>
                              <span className="font-small ml-5 text-muted">{List.rating} (reviews)</span>
                            </div>
                          </div>
                          <hr style={{ margin: "0px", color: "rgb(69 96 147)" }} />
                          <div className="clearfix product-price-cover">
                            <div className="product-price primary-color float-left">
                              <span className="current-price text-brand">₹{Math.round(List.price)}</span>
                              <span>
                              {
                              List.offer == 0 ? null :
                                <span className="save-price font-md color3 ml-15">{List.offer ? List.offer : 0} % Off</span>
                              }
                              {
                              List.oldPrice == List.price ? null :
                                <span className="old-price font-md ml-15">₹{Math.round(List.oldPrice)}</span>
                              }
                              </span>
                            </div>
                          </div>
                          <div className="short-desc mb-20">
                            <p className="font-lg">Incluslve of all taxes</p>
                          </div>
                          {
                            sizeList.length <= 0 ? null :
                              <>
                              <div className="attr-detail attr-size mb-20">
                                <strong className="mr-10">SELECT SIZE <span style={{ paddingLeft: "14px", fontSize: "13px", color: "black" }}></span> </strong>
                                {
                                  sizechartList == '' ? null :
                                    <strong className="mr-10"><a style={{ color: "#FE5D17", textDecoration: "underline" }} onClick={() => openModel(true)}>Size Chart</a></strong> 
                                    
                                }
                              </div>
                              <div className="attr-detail attr-size mb-20">
                                <ul className="list-filter size-filter font-small">
                                  {
                                    sizeList.map((item, i) => {

                                      return (
                                        <>
                                          <li>
                                            <button className="size-btn-product" key={i} style={{ backgroundColor: size == item ? "black" : "white", color: size == item ? "white" : "black", borderRadius: "50px", width: "80px", height: "40px", margin: "2px" }} onClick={(e) => { sizeFun(e) }} value={item} >
                                              {item}
                                            </button>
                                          </li>
                                        </>
                                      )
                                    })
                                  }
                                </ul>
                              </div>
                              </>
                            }
                            {
                              colorsList.length <= 0 ? null :
                                <>
                          <div>
                            <div className="attr-detail attr-size mb-20">
                              <strong className="mr-10">COLORS<span style={{ paddingLeft: "14px", fontSize: "13px", color: "black" }}></span> </strong>
                            </div>

                            <div className="attr-detail attr-size mb-20">
                              <ul className="list-filter size-filter font-small d-flex flex-row">
                                {
                                  colorsList.map((item, i) => {
                                    return (

                                      <>
                                        <li className="d-flex align-items-center color-btn-product" style={{border: colors == item ? "2px solid black" : "2px solid #c9c9c9", borderRadius: '50%', padding: '2px'}}>
                                          <button key={i} className="color_button" style={{backgroundColor: `${item}` }} value={item} onClick={(e) => { colorFun(e) }} >
                                          </button>
                                        </li>
                                      </>
                                    )
                                  })
                                }
                              </ul>
                            </div>
                          </div>
                        </>
                        }
                          {
                                List.sleeves_option == 1 ? 
                              <div>
                                <div className="attr-detail attr-size mb-20">
                                  <strong className="mr-10">SLEEVES<span style={{ paddingLeft: "14px", fontSize: "13px", color: "black" }}></span> </strong>
                                </div>
                                <div className="attr-detail attr-size mb-20">
                                  <ul className="list-filter size-filter font-small" style={{width: "100%"}}>
                                    <li style={{width: "100%"}}>
                                    <div className="form-group col-lg-12">
                                      <div className="custom_select sleeve-options">
                                          {
                                              <Select2 className="form-control select-active" defaultValue = {Sleeves} data = {ListSleeves} onChange={handleSleevesChange}/>
                                          }
                                      </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div> : null
                          }

                          <div className="detail-extralink mb-20">
                            <div className="detail-qty border radius">
                              <a className="qty-down" ><i className="fi-rs-angle-small-down" onClick={() => { SetIncrement(increment == 1 ? 1 : increment - 1) }} /></a>
                              <span className="qty-val">{increment}</span>
                              <a className="qty-up" ><i className="fi-rs-angle-small-up" onClick={() => { SetIncrement(increment < List.InStock ? increment + 1 : increment) }} /></a>
                            </div>

                            <div className="product-extra-link2">
                              {
                                List.InStock == 0 ? <button className="button button-add-to-cart" style={{ backgroundColor: "#bbb5b5" }} title="Hello World!" disabled><i className="fi-rs-shopping-cart" />Add to cart</button> :

                                  <button type="submit" className="button button-add-to-cart" onClick={() => { CartPost(List.id, List.variant[0].variant, increment, colors, size, Customizations, Sleeves) }} >
                                    <i className="fi-rs-shopping-cart" />Add to cart
                                  </button>

                              }

                                
                             
                            </div>
                          </div>
                          <hr style={{ margin: "10px", color: "rgb(69 96 147)" }} />



                          <div className="attr-detail attr-size mb-20">
                            <strong className="mr-10">DELIVERY OPTIONS<span style={{ paddingLeft: "14px", fontSize: "13px", color: "black" }}></span> </strong>
                          </div>
                          <div className="row mb-30">
                            <div className="col-lg-6 apply-coupon">
                              <input type="text" placeholder="Enter Pincode..." value={PinCode} onChange={(e) => { SetPinCode(e.target.value) }} style={{ width: "170px" }} />
                              <button className="btn btn-md" onClick={() => { GetPinCode(PinCode) }}>Pincode</button>
                            </div>
                          </div>
                          <div className="attr-detail attr-size mb-20">
                            {PinMessage && <div style={{ fontSize: "14px", color: "red" }}>{PinMessage}</div>}
                          </div>

                          <div class="font-xs">
                            <ul class="mr-50 float-start">
                              <li class="mb-5"><img src='assets/imgs/theme/delivery.png' width="25px" />&nbsp;<span class="text-brand product-text">  Get it by 7 days</span></li>
                              <li class="mb-5"><img src='assets/imgs/theme/paydelivery.png' width="25px" />&nbsp;<span class="text-brand product-text">  Pay on delivery available</span></li>
                              <li><img src='assets/imgs/theme/return.png' width="25px" />&nbsp; <span class="text-brand product-text">  Easy {List.return_days} days return & exchange available</span></li>
                              <span class="text-brand product-text">100% Original Products</span>
                            </ul>
                          </div>
                        </div>
                        {/* Detail Info */}
                      </div>
                    </div>
                    <div className="product-info">
                      <div className="tab-style3">
                        <ul className="nav nav-tabs text-uppercase">
                          <li className="nav-item">
                            <a className="nav-link active" id="Description-tab" data-bs-toggle="tab" href="#Description">Description</a>
                          </li>
                          {/* <li className="nav-item">
                            <a className="nav-link" id="Additional-info-tab" data-bs-toggle="tab" href="#Additional-info">Additional info</a>
                          </li> */}
                          {/* <li className="nav-item">
                            <a className="nav-link" id="Vendor-info-tab" data-bs-toggle="tab" href="#Vendor-info">Vendor</a>
                          </li> */}
                          <li className="nav-item">
                            <a className="nav-link" id="Reviews-tab" data-bs-toggle="tab" href="#Reviews">Reviews</a>
                          </li>
                          {
                              List.video_link || List.pdf ? 
                              <li className="nav-item">
                                <a className="nav-link" id="video-pdf-tab" data-bs-toggle="tab" href="#video-pdf">Video & Pdf</a>
                              </li> : null
                          }
                        </ul>
                        <div className="tab-content shop_info_tab entry-main-content">
                          <div className="tab-pane fade show active" id="Description">
                            <div className>
                              <p className="bullet_points" dangerouslySetInnerHTML={{ __html: List.bullet_points_description }}></p>
                              {/* <p >{List.bullet_points_description}</p> */}
                              <p dangerouslySetInnerHTML={{ __html: List.description }}></p>
                              {/* <p>Spluttered narrowly yikes left moth in yikes bowed this that grizzly much hello on spoon-fed that alas rethought much decently richly and wow against the frequent fluidly at formidable acceptably flapped besides and much circa far over the bucolically hey precarious goldfinch mastodon goodness gnashed a jellyfish and one however because.</p> */}
                            </div>
                          </div>
                          <div className="tab-pane fade" id="Additional-info">
                            <table className="font-md">
                              <tbody>
                                <tr className="stand-up">
                                  <th>Stand Up</th>
                                  <td>
                                    <p>35″L x 24″W x 37-45″H(front to back wheel)</p>
                                  </td>
                                </tr>
                                <tr className="folded-wo-wheels">
                                  <th>Folded (w/o wheels)</th>
                                  <td>
                                    <p>32.5″L x 18.5″W x 16.5″H</p>
                                  </td>
                                </tr>
                                <tr className="folded-w-wheels">
                                  <th>Folded (w/ wheels)</th>
                                  <td>
                                    <p>32.5″L x 24″W x 18.5″H</p>
                                  </td>
                                </tr>
                                <tr className="door-pass-through">
                                  <th>Door Pass Through</th>
                                  <td>
                                    <p>24</p>
                                  </td>
                                </tr>
                                <tr className="frame">
                                  <th>Frame</th>
                                  <td>
                                    <p>Aluminum</p>
                                  </td>
                                </tr>
                                <tr className="weight-wo-wheels">
                                  <th>Weight (w/o wheels)</th>
                                  <td>
                                    <p>20 LBS</p>
                                  </td>
                                </tr>
                                <tr className="weight-capacity">
                                  <th>Weight Capacity</th>
                                  <td>
                                    <p>60 LBS</p>
                                  </td>
                                </tr>
                                <tr className="width">
                                  <th>Width</th>
                                  <td>
                                    <p>24″</p>
                                  </td>
                                </tr>
                                <tr className="handle-height-ground-to-handle">
                                  <th>Handle height (ground to handle)</th>
                                  <td>
                                    <p>37-45″</p>
                                  </td>
                                </tr>
                                <tr className="wheels">
                                  <th>Wheels</th>
                                  <td>
                                    <p>12″ air / wide track slick tread</p>
                                  </td>
                                </tr>
                                <tr className="seat-back-height">
                                  <th>Seat back height</th>
                                  <td>
                                    <p>21.5″</p>
                                  </td>
                                </tr>
                                <tr className="head-room-inside-canopy">
                                  <th>Head room (inside canopy)</th>
                                  <td>
                                    <p>25″</p>
                                  </td>
                                </tr>
                                <tr className="pa_color">
                                  <th>Color</th>
                                  <td>
                                    <p>Black, Blue, Red, White</p>
                                  </td>
                                </tr>
                                <tr className="pa_size">
                                  <th>Size</th>
                                  <td>
                                    <p>{List.multipleSize}</p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="tab-pane fade" id="Reviews">
                            <div className="comments-area">
                                <div className="row">
                                    <div className="col-lg-8">
                                        <h4 className="mb-30">Review this product</h4>
                                        <div className="comment-list">
                                          {
                                            reviewsList.map((item, i) => {
                                              return (

                                                <>
                                                  <div className="single-comment justify-content-between d-flex mb-30">
                                                    <div className="user justify-content-between d-flex">
                                                        <div className="thumb text-center">
                                                            <img src="../assets/imgs/blog/author-2.png" alt="" />
                                                            <a href="#" className="font-heading text-brand">{item.name}</a>
                                                        </div>
                                                        <div className="desc">
                                                            <div className="d-flex justify-content-between mb-10">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="font-xs text-muted">{item.time}</span>
                                                                </div>
                                                                <div className="product-rate d-inline-block">
                                                                  {
                                                                    item.rating == 1 ?
                                                                    <div className="product-rating" style={{ maxWidth: "20%" }}></div>: 
                                                                    item.rating == 2 ?                                                                                                                                   
                                                                    <div className="product-rating" style={{ maxWidth: "40%" }}></div>:
                                                                    item.rating == 3 ? 
                                                                    <div className="product-rating" style={{ maxWidth: "60%" }}></div>:
                                                                    item.rating == 4 ? 
                                                                    <div className="product-rating" style={{ maxWidth: "80%" }}></div>:
                                                                    item.rating == 5 ? 
                                                                    <div className="product-rating" style={{ maxWidth: "100%" }}></div>:
                                                                    <div className="product-rating" style={{ maxWidth: "0%" }}></div>
                                                                  }                                                          
                                                                </div>
                                                            </div>
                                                            <p className="mb-10">{item.comment} <a href="#" class="reply">Reply</a></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                </>
                                              )
                                            })
                                          }
                                        </div>
                                    </div>
                                </div>
                            </div>
                          {
                              List.userReview == "yes" ? 
                                <>
                                <div className="comment-form">
                                  <h4 className="mb-15">Add a review</h4>
                                  <div className="row">
                                    <div className='App'>
                                      <Rating onClick={handleRating} initialValue={rating} />
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-8 col-md-12">
                                      <form className="form-contact comment_form">
                                        <div className="row">
                                          <div className="col-12">
                                            <div className="form-group">
                                              <textarea className="form-control w-100" name="comment" cols={30} rows={9} placeholder="Write Comment" value={message} onChange={(e)=>{SetMessage(e.target.value)}} />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <button type="button" className="button button-contactForm" onClick={SubmitReviews}>Submit Review</button>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                                </>
                              : null
                          }
                         </div>  
                          <div className="tab-pane fade" id="video-pdf">
                            <div className="comments-area">
                            {
                              List.video_link ? 
                                <div className="row">
                                    <div className="col-lg-8">
                                        <h4 className="mb-30">Video</h4>
                                        <div className="comment-list">
                                          <iframe style={{width:"100%", height:"325px"}}
                                            src={List.video_link}>
                                          </iframe>
                                        </div>
                                    </div>
                                </div>: null
                            }
                            {
                              List.pdf ? 
                                <div className="row">
                                    <hr></hr>
                                    <div className="col-lg-8">
                                        <h4 className="mb-30">PDF File</h4>
                                        <div className="comment-list">
                                          <a target="_blank" href={List.pdf} class="btn mb-20 w-30">View PDF <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM11.7 17.7L16 14C16.4 13.6 16.4 12.9 16 12.5C15.6 12.1 15.4 12.6 15 13L11 16L9 15C8.6 14.6 8.4 14.1 8 14.5C7.6 14.9 8.1 15.6 8.5 16L10.3 17.7C10.5 17.9 10.8 18 11 18C11.2 18 11.5 17.9 11.7 17.7Z" fill="currentColor"/>
<path d="M10.4343 15.4343L9.25 14.25C8.83579 13.8358 8.16421 13.8358 7.75 14.25C7.33579 14.6642 7.33579 15.3358 7.75 15.75L10.2929 18.2929C10.6834 18.6834 11.3166 18.6834 11.7071 18.2929L16.25 13.75C16.6642 13.3358 16.6642 12.6642 16.25 12.25C15.8358 11.8358 15.1642 11.8358 14.75 12.25L11.5657 15.4343C11.2533 15.7467 10.7467 15.7467 10.4343 15.4343Z" fill="currentColor"/>
<path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"/>
</svg></a>
                                        </div>
                                    </div>
                                </div> : null
                            }
                            </div>
                          </div>  
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 primary-sidebar sticky-sidebar mt-30 sub-total-box">
                  <div className="border p-md-4 cart-totals ml-30">
                    <div className="table-responsive">
                      <table className="table no-border">
                        <tbody>
                          <tr>
                            <td className="cart_total_label">
                              <h6 className="text-muted">Customizations</h6>
                            </td>
                          </tr>
                          <tr>
                            <td scope="col" colSpan={2}>
                            <form method="post">
                              <textarea rows={3} placeholder="Customizations" defaultValue={""} onChange={(e) => { SetCustomizations(e.target.value) }}  />
                              </form>
                            </td>
                          </tr>
                          <tr>
                            <td className="cart_total_label">
                              <ul class="product-more-infor mt-30">
                                  <li><span style={{flex: "initial"}}>Customization is possible in this item. Go through following instructions for customisation.</span></li>
                                  <li><span style={{flex: "initial"}}>Customization is possible for Prepaid Orders Only. Customization is not Possible for COD orders.</span></li>
                                  <li><span style={{flex: "initial"}}>You can ask for any type of Size as well as Pattern customisations.</span></li>
                                  <li><span style={{flex: "initial"}}>If you want to give any Reference image then mention in note that "you will provide reference image in email within 24 hrs". then drop us an email on <a href="mailto:kingoodie@gmail.com">kingoodie@gmail.com.</a></span></li>
                                  <li><span style={{flex: "initial"}}>There is no extra cost of customization.</span></li>
                                  <li><span style={{flex: "initial"}}>Customized Products will be shipped within 3 to 4 working days of placing the order.</span></li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="border p-md-4 cart-totals ml-30 mt-10">
                    <div className="table-responsive">
                      <table className="table no-border">
                        <tbody>
                          <tr>
                            <td className="cart_total_label">
                              <h6 className="text-muted">Subtotal</h6>
                            </td>
                            <td className="cart_total_amount">
                              {
                                List.oldPrice == List.price ? <h4 className="text-brand text-end">₹{List.price * increment}</h4> :
                                  <h4 className="text-brand text-end">₹{Math.round(List.oldPrice) * increment}</h4>
                              }
                              
                            </td>
                          </tr>
                          <tr>
                            <td scope="col" colSpan={2}>
                              <div className="divider-2 mt-10 mb-10" />
                            </td>
                          </tr>
                          <tr>
                            <td className="cart_total_label">
                              <h6 className="text-muted">Offer Price ({List.offer ? List.offer : 0}%)</h6>
                            </td>
                            <td className="cart_total_amount">
                              {
                                List.offer == 0 ? <h5 className="text-heading text-end">- {List.offer ? List.offer : 0}%</h5> :
                                <h5 className="text-heading text-end">- ₹{(List.offer / 100) * (List.oldPrice * increment)} Off</h5>
                              }
                              </td></tr> <tr>
                            <td className="cart_total_label">
                              <h6 className="text-muted">Delivery Charge</h6>
                            </td>
                            <td className="cart_total_amount">
                              <h5 className="text-heading text-end">+ {List.DeliveryCharge ? List.DeliveryCharge : 0}</h5></td></tr> <tr>
                            <td scope="col" colSpan={2}>
                              <div className="divider-2 mt-10 mb-10" />
                            </td>
                          </tr>
                          <tr>
                            <td className="cart_total_label">
                              <h6 className="text-muted">Total</h6>
                            </td>
                            <td className="cart_total_amount">
                              <h4 className="text-brand text-end">₹{Math.round(List.price) * increment}</h4>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <BestSellers />
          </div>
        </div>
        <div className="modal size-chart" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }} aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Size Chart</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => openModel(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                  <div className="table-responsive shopping-summery">
                    <table className="table table-wishlist">
                        <thead>
                            <tr className="main-heading">
                                <th className="text-center" scope="col">Size</th>
                                <th className="text-center" scope="col">Brand Size<br/><span style={{fontSize:"14px"}}>(CM/Inch)</span></th>
                                <th className="text-center" scope="col">Chest<br/><span style={{fontSize:"14px"}}>(CM/Inch)</span></th>
                                <th className="text-center" scope="col">Shoulder<br/><span style={{fontSize:"14px"}}>(CM/Inch)</span></th>
                                <th className="text-center" scope="col">Length<br/><span style={{fontSize:"14px"}}>(CM/Inch)</span></th>
                                <th className="text-center" scope="col">Sleeve<br/><span style={{fontSize:"14px"}}>(CM/Inch)</span></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                sizechartList == '' ?
                                    <>
                                        <tr >
                                            <td></td>
                                            {/* <td style={{textAlign: "end"}}><h6>Oops, no size &nbsp;&nbsp;</h6></td> */}
                                            <td className="" style={{textAlign: "end"}} colspan="2"><h6>Oops, no size data your list</h6></td>
                                            <td></td>
                                        </tr></> :
                                    sizechartList.map((item, i) => {
                                        return (
                                            <>
                                                <tr className="pt-30" key={i}>
                                                    <td className="text-center detail-info">{item.size}</td>
                                                    <td className="text-center detail-info">{item.brand_size_cm} / {item.brand_size_inches}</td>
                                                    <td className="text-center detail-info">{item.chest_cm} / {item.chest_inches}</td>
                                                    <td className="text-center detail-info">{item.shoulder_cm} / {item.shoulder_inches}</td>
                                                    <td className="text-center detail-info">{item.length_cm} / {item.length_inches}</td>
                                                    <td className="text-center detail-info">{item.sleeve_cm} / {item.sleeve_inches}</td>
                                                </tr>
                                            </>
                                        )
                                    })


                            }

                        </tbody>
                    </table>
                </div>
                <img style={{width:"100%"}} src={List.sizeImg} alt={List.sizeImg} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer/> */}
    </div>
  )
}

export default Product;