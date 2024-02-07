import { Link } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { useAppContext } from '../../context/index';
import React, { useState, useEffect } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import CommonService from "../../services/commonService";
import urlConstant from "../../constants/urlConstant";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BestSellers from '../BestSellers/BestSellers';
import Slider from "react-slick";

function Home() {
  let common = new CommonService();
  const {  Loding, HomeCard } = useAppContext();

  const [List, setList] = useState([]);
  const [BrandsList, setBrandsList] = useState([]);
  const [BannersList, setBannersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [BrandsSlider, setBrandsSlider] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePrevCard = () => {
    const newIndex = currentCardIndex === 0 ? BrandsList.length - 1 : currentCardIndex - 1;
    setCurrentCardIndex(newIndex);
    console.log(newIndex);
  };

  const handleNextCard = () => {
    const newIndex = currentCardIndex === BrandsList.length - 1 ? 0 : currentCardIndex + 1;
    setCurrentCardIndex(newIndex);
    console.log(newIndex);
  };
  function GetProducts() {
    setIsLoading(true)
    const GetAllProducts = `${urlConstant.Products.GetProducts}`;
    common.httpGet(GetAllProducts).then(function (res) {
      setIsLoading(false);
      setList(res.data.data);
    })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  }


  function GetBrands() {
    setIsLoading(true)
    const GetAllBrands = `${urlConstant.AllBrands.GetAllBrands}`;
    common.httpGet(GetAllBrands).then(function (res) {
      setIsLoading(false);
      setBrandsList(res.data.data);
    })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  }

  function GetBanners() {
    setIsLoading(true)
    const GetAllbanners = `${urlConstant.bannersData.bannersData}`;
    common.httpGet(GetAllbanners).then(function (res) {
      setIsLoading(false);
      setBannersList(res.data.data);
    })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
      });
  }

  var settings = {
      infinite: false,
      slidesToShow: 7,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      arrows:false,
      responsive: [
        {
          breakpoint: 1440, // screen size at which settings will change
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 1200, // screen size at which settings will change
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 992, // screen size at which settings will change
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 767, // screen size at which settings will change
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 480, // screen size at which settings will change
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
  };

  useEffect(() => {
    GetProducts();
    GetBrands();
    GetBanners();
  }, [])
  return (
    <div>
      <ToastContainer />
      {/* <Header /> */}
      {isLoading ? <Loding /> : Home}
      <main className="main">
        <section className="home-slider position-relative mb-30">
          <div className="container">
            <div className="home-slide-cover mt-30">
              <div className="hero-slider-1 style-4 dot-style-1 dot-style-1-position-1">
                <div className="single-hero-slider single-animation-wrap">
                  <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner d-none">
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className="carousel-inner" >
                      {
                        BannersList.map((item, i) => {
                          return (
                            <>
                              <div key={i} className={`carousel-item ${i == 1 ? "active" : ""}`}>
                                <img src={item.photo} className="d-block w-100" alt="/" />
                                <div className="carousel-caption d-md-block" style={{ width: "65%" }}>
                                  <h1 className='banner_title_set mx-auto' style={{ maxWidth: "640px" }}>{item.title}</h1>
                                  <p className='banner_text_set mx-auto' style={{ maxWidth: "435px" }}>{item.sub_title}</p>
                                  <div className="slider-main-button-div">
                                    <Link to="/ShopProduct">
                                      <button className="slider-main-button">
                                        <span className="img-span">
                                          <img style={{ width: "100%" }} src="../assets/imgs/banner/right-arrow.svg" alt="/" />
                                        </span>
                                        <span className="text-span">
                                          SHOP NOW !
                                        </span>
                                      </button>
                                    </Link>
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
              <div className="slider-arrow hero-slider-1-arrow" />
            </div>
          </div>
        </section>

        {/* new */}
        <section class="banners mb-25">
          <div class="container">
            <div class="row">
              <div class="col-lg-4 col-md-6">
                <div class="banner-img wow animate__animated animate__fadeInUp" data-wow-delay="0">
                  <img src={HomeCard[0]?.image} alt="" />
                  <div class="banner-text">
                    <h4>
                    {HomeCard[0]?.title}
                    </h4>
                    <a href="#" className="btn btn-xs small-slider-button" style={{ backgroundColor: "#A5A5A5" }}>
                      <Link to="/ShopProduct">
                        <span className="text-span">
                          Shop Now
                        </span>
                      </Link>
                      <span className="img-span">
                        <img style={{ width: "100%" }} src="../assets/imgs/banner/right-arrow.svg" alt="/" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="banner-img wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                  <img src={HomeCard[1]?.image} alt="" />
                  <div class="banner-text">
                    <h4>
                    {HomeCard[1]?.title}
                    </h4>
                    <a href="#" className="btn btn-xs small-slider-button" style={{ backgroundColor: "#3D8440" }}>
                      <Link to="/ShopProduct">
                        <span className="text-span">
                          Shop Now
                        </span>
                      </Link>
                      <span className="img-span">
                        <img style={{ width: "100%" }} src="../assets/imgs/banner/right-arrow.svg" alt="/" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="banner-img mb-sm-0 wow animate__animated animate__fadeInUp" data-wow-delay=".4s">
                  <img src={HomeCard[2]?.image} alt="" />
                  <div class="banner-text">
                    <h4> {HomeCard[2]?.title}</h4>
                    <a href="#" className="btn btn-xs small-slider-button" style={{ backgroundColor: "#84633D" }}>
                      <Link to="/ShopProduct">
                        <span className="text-span">
                          Shop Now
                        </span>
                      </Link>
                      <span className="img-span">
                        <img style={{ width: "100%" }} src="../assets/imgs/banner/right-arrow.svg" alt="/" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="product-tabs section-padding position-relative">
          <div className="container">
            <div className="section-title style-2 wow animate__animated animate__fadeIn">
              <h3>Best Sellers</h3>
            </div>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="tab-one" role="tabpanel" aria-labelledby="tab-one">
                <div className="row product-grid-4">
                  {
                    List.map((item, i) => {
                      const image = item.thumbnail_image == '' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9zuWJ0xU19Mgk0dNFnl2KIc8E9Ch0zhfCg&usqp=CAU' : item.thumbnail_image
                      const Name = item.name.substring(0, 15);
                      return (
                        <>
                          <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                            <Link to={`/${item.slug}`}>
                              <div className="product-cart-wrap mb-30 wow animate__animated animate__fadeIn" data-wow-delay=".1s">
                                <div className="product-img-action-wrap">
                                  <div className="product-img product-img-zoom">
                                    <Link to={`/${item.slug}`}>
                                      <img className="default-img" src={image} width="100%" alt="/" />
                                      <img className="hover-img" src={image} width="100%" alt="/" />
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
                                </div>
                                <div className="product-content-wrap">
                                  <div className="product-category">
                                    <a >{item.category}</a>
                                  </div>
                                  <h2><Link to={'1'}>{Name.length > 15
                                    ? `${Name}...`
                                    : Name}</Link></h2>
                                  <div className="product-rate-cover">
                                    <div className="product-rate d-inline-block">
                                      <div className="product-rating" style={{ width: '90%' }} />
                                    </div>
                                    <span className="font-small ml-5 text-muted">({item.rating})</span>
                                  </div>
                                  <div className="product-card-bottom">
                                    <div className="product-price">
                                      <span>₹{Math.round(item.base_price)}</span>
                                      {
                                        item.base_discounted_price == item.base_price ? null :                                          
                                        <span className="old-price">₹{Math.round(item.base_discounted_price)}</span>
                                      }
                                    </div>
                                    <div className="add-cart">
                                      <Link to={`/${item.slug}`} className="add">Buy Now </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="popular-categories section-padding">
          <div className="container wow animate__animated animate__fadeIn">
            <div className="row">
              <div className="col-md-11">
                <div className="title">
                  <h3>Featured Brands</h3>
                </div>
              </div>
            </div>

            <div className="slider-arrow slider-arrow-2 flex-right carausel-10-columns-arrow" />
            <div className="carausel-10-columns-cover position-relative" style={{ marginTop:"30px" }}>
              <Slider {...settings}>
                {
                  BrandsList.map((item, i) => {
                    return (
                      <>
                        <div className="carausel-10-columns" id="carausel-10-columns">
                          <div className="card-2">
                            <div className="cat-list-home">
                              <img src={item.logo} />
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })
                }
              </Slider>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home;