import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import urlConstant from "../../constants/urlConstant";
import CommonService from "../../services/commonService";
import { useAppContext } from '../../context';
import Loding from '../Loding';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function BestSellers() {
  let common = new CommonService();
  const [isLoading, setIsLoading] = useState(false);
  const [List, SetList] = useState([]);
  const {   Loding, CartPost } = useAppContext();

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500
  };

  function BestSellerData() {
    setIsLoading(true)
    const BestSellers1 = `${urlConstant.BestSellers.BestSellersData}`;
    common.httpGet(BestSellers1).then(function (res) {
      setIsLoading(false);
      SetList(res.data.data);
    })
      .catch(function (error) {
        setIsLoading(false);
      });
  }


  useEffect(() => {
    BestSellerData();
  }, [])

  return (
    <div>
      {isLoading ? <Loding /> : BestSellers}
      <section className="section-padding pb-5 best-seller-sec">
        <div className="container">
          <div className="section-title wow animate__animated animate__fadeIn">
            <h3 className>Best Sellers</h3>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="row product-grid">
                {
                  List.map((item, i) => {
                    const image = item.thumbnail_image == '' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9zuWJ0xU19Mgk0dNFnl2KIc8E9Ch0zhfCg&usqp=CAU' : item.thumbnail_image
                    const Name = item.name.substring(0, 20);

                    return (
                      <div className="col-lg-1-4 col-md-3 col-12 col-sm-6" key={i}>
                        <Link to={`/${item.slug}`}>
                          <div className="product-cart-wrap mb-30">
                            <div className="product-img-action-wrap">
                              <div className="product-img product-img-zoom">
                                <Link to={`/${item.slug}`}>
                                  <img className="default-img" src={image} alt="/" />
                                  <img className="hover-img" src={image} alt="/" />
                                </Link>
                              </div>
                              
                              <div className="product-badges product-badges-position product-badges-mrg flex-column">
                                {
                                  item.on_sale == 0 ? null :
                                  <span className="hot mb-5" style={{padding: "5px 5px 5px 5px"}}>On sale</span>
                                }
                                {
                                  item.best_selling == 0 ? null :
                                  <span className="hot mb-5" style={{padding: "5px 12px 5px 5px", width: "auto", background: "#DEFFB4", color: "rgb(61 132 64)"}}>Best Selling</span>
                                }
                                {
                                  item.selling_fast == 0 ? null :
                                  <span className="hot mb-5" style={{padding: "5px 12px 5px 5px", width: "auto", background: "#ffe1b4", color: "#84633d"}}>Selling Fast</span>
                                }
                                {
                                  item.limited_stock == 0 ? null :
                                  <span className="hot mb-5" style={{padding: "5px 12px 5px 5px", width: "auto", background: "rgb(251 248 151)", color: "rgb(116 92 2)"}}>Limited Stock</span>
                                }
                                {
                                  item.designer_piece == 0 ? null :
                                  <span className="hot mb-5" style={{padding: "5px 12px 5px 5px", width: "auto", background: "#FE5D17", color: "#fff"}}>Designer Piece</span>
                                }
                              </div>
                              {
                                item.discount == 0 ? null :
                                  <div className="product-badges product-badges-position-mrg product-badges discount-set" style={{right: '0'}}>
                                    <span className="hot">{item.discount}% OFF</span>
                                  </div>
                              }
                            </div>
                            <div className="product-content-wrap">
                              <div className="product-category">
                                <a>{item.slug}</a>
                              </div>
                              <h2><a> {Name?.length > 13
                                ? `${Name}...`
                                : Name}</a></h2>
                              <div className="product-rate-cover">
                                <div className="product-rate d-inline-block">
                                  <div className="product-rating" style={{ width: item.rating + 35 }} />
                                </div>
                                <span className="font-small ml-5 text-muted"> ({item.rating})</span>
                              </div>
                              <div className="product-price mt-10">
                                <span>{item.main_price}</span>
                                {
                                  item.main_price == item.stroked_price ? null :
                                  <span className="old-price">{item.stroked_price}</span>
                                }
                              </div>
                              {/* <div className="sold mt-18 mb-25">
                                <div className="progress mb-5">
                                  <div className="progress-bar" role="progressbar" style={{ width: '60%' }} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                                <span className="font-xs text-heading"> Sold: {item.sales}/120</span>
                              </div> */}
                              <div className="product-card-bottom">


                                <Link to={`/${item.slug}`} style={{ width: "100%" }} ><a className="btn1 w-100 hover-up" ><i className="fi-rs-shopping-cart mr-5" />Shop Now</a></Link>

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </section><br />
    </div>
  )
}

export default BestSellers
