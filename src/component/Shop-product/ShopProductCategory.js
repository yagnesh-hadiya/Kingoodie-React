import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import urlConstant from "../../constants/urlConstant";
import { ToastContainer } from "react-toastify";
import { ToasterWarning } from "../../common/toaster";
import Pagination from "../Pagination";
import axios from "axios";
import { useAppContext } from "../../context/index";
import RangeSlider from "./RangeSlider";

function ShopProductCategory() {
  const name = useParams();

  const {   Loding } = useAppContext();

  const [List, setList] = useState([]);
  const [toggleMobile, settoggleMobile] = useState(false);
  const [filterData, setFilterData] = useState({
    categoryData: [],
    brandData: [],
    colorData: [],
    sizeData: [],
  });

  const [productData, setProductData] = useState({
    categoryData: [],
    brandData: [],
    colorData: [],
    sizeData: [],
  });
  const [category, setcategory] = useState(
    localStorage.getItem("category")
      ? localStorage.getItem("category").split(",")
      : []
  );
  const [color, setcolor] = useState(List);
  const [brand, setBrand] = useState(
    localStorage.getItem("brand")
      ? localStorage.getItem("brand").split(",")
      : []
  );
  const [size, setSize] = useState(List);

  const [value, setValue] = useState({ min: 0, max: 7500 });

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = List.slice(firstPostIndex, lastPostIndex);

  //mobile view
  function getCurrntDimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  function useDimensionHook() {
    const [currentDimenstion, setCurrentDimenstion] = useState(
      getCurrntDimensions()
    );

    useEffect(() => {
      const handleResize = () => {
        setCurrentDimenstion(getCurrntDimensions());
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return currentDimenstion;
  }

  const { width } = useDimensionHook();

  const isMobile = width >= 992;

  function GetProducts() {
    setIsLoading(true);
    const GetAllProducts = `${urlConstant.Products.GetCategoryWiseProducts}`;
    const Data = { slug: name.name };
    axios
      .post(GetAllProducts, Data)
      .then(function (res) {
        setIsLoading(false);
        setList(res.data.data);
        const data = res.data.data;
        const categoryData = getUniqueData(data, "category");
        const colorData = getUniqueData(data, "colors");
        const brandData = getUniqueData(data, "brand");
        const sizeData = getUniqueData(data, "multipleSize");

        setProductData({
          categoryData,
          colorData,
          brandData,
          sizeData,
        });
      })
      .catch(function (error) {
        setIsLoading(false);
        ToasterWarning(error.message);
      });
  }

  const handleInput = (e) => {
    if (e.target.checked && e.target.name) {
      setFilterData((oldData) => ({
        ...oldData,
        [e.target.name]: Array.from(
          new Set([...oldData[e.target.name], e.target.value])
        ),
      }));
    } else if (e.target.name) {
      setFilterData((oldData) => {
        const newSet = new Set(oldData[e.target.name]);
        newSet.delete(e.target.value);

        return { ...oldData, [e.target.name]: Array.from(newSet) };
      });
    }
  };

  const phandleInput = (e) => {
    setValue(value.min == e.target.value);
    setValue(value.max == e.target.value);
  };

  const getUniqueData = (data, property) => {
    let newVal = data.map((item, i) => {
      return item[property];
    });

    if (property === "colors" || "multipleSize") {
      return (newVal = [...new Set(newVal.flat())]);
    } else {
      // return (newVal = ["All", ...new Set(newVal)]);
      return (newVal = [...new Set(newVal)]);
    }
  };

  useEffect(() => {
    GetProducts();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [name]);

  useEffect(() => {
    localStorage.setItem("category", filterData.categoryData.toString());
    localStorage.setItem("brand", filterData.brandData.toString());
  }, [filterData.brandData, filterData.categoryData]);

  return (
    <div>
      <ToastContainer />
      {/* <Header /> */}
      {isLoading ? <Loding /> : ShopProductCategory}
      <main className="main">
        <div className="page-header breadcrumb-wrap">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/ShopProduct" rel="nofollow">
                <i className="fi-rs-home mr-5" />
                Home
              </Link>
              <span /> <Link to="/">Shop</Link>
            </div>
          </div>
        </div>
        <br />
        <div className="container mb-30 product-listing">
          {/* <div className="row flex-row-reverse"> */}

          {!isMobile && (
            <button
              className="btn btn-sm"
              style={{ margin: "10px" }}
              onClick={(e) => {
                settoggleMobile(!toggleMobile);
              }}
            >
              Filter
            </button>
          )}

          <div className="row">
            {toggleMobile && (
              <div className="col-md-3 primary-sidebar sticky-sidebar">
                {/* Fillter By Price */}
                <div className="sidebar-widget price_range range mb-30">
                  <div className="d-flex justify-content-between">
                    <h5 className="section-title style-1 mb-30">
                      Filter items
                    </h5>
                    <div className="mobile-menu-close close-style-wrap close-style-position-inherit">
                      <button
                        className="close-style search-close"
                        onClick={(e) => {
                          settoggleMobile(false);
                        }}
                      >
                        {/* <button className="close-style search-close"> */}
                        <i className="icon-top" />
                        <i className="icon-bottom" />
                      </button>
                    </div>
                  </div>

                  <div className="price-filter">
                    <div className="price-filter-inner">
                      {/* <div id="slider-range" className="mb-20" /> */}
                      <div className="d-flex justify-content-between">
                        <label className="fw-900">Price Range :</label>
                        <div className="caption">
                          <h6 style={{ marginTop: "5px" }}>
                            ₹{value.min} - ₹{value.max}{" "}
                          </h6>
                        </div>
                      </div>

                      <RangeSlider
                        min={0}
                        max={7500}
                        step={5}
                        value={value}
                        onChange={setValue}
                        onInput={phandleInput}
                      />
                    </div>
                  </div>
                  <div className="list-group">
                    <div className="list-group-item mb-10 mt-10">
                      <label className="fw-900">Category</label>
                      <div className="custome-checkbox">
                        {productData.categoryData.map((item, i) => {
                          return (
                            <>
                              <input
                                className="form-check-input"
                                key={"box-" + item}
                                type="checkbox"
                                name="categoryData"
                                value={item}
                                id={item + i}
                                onClick={handleInput}
                                checked={category.includes(item)}
                                defaultValue
                              />
                              <label
                                className="form-check-label"
                                key={"label-" + item}
                                name="categoryData"
                                htmlFor={item + i}
                                onClick={handleInput}
                              >
                                <span style={{ textTransform: "capitalize" }}>
                                  {item}
                                </span>
                              </label>
                              <br />
                            </>
                          );
                        })}
                      </div>

                      <label className="fw-900">Brand</label>
                      <div className="custome-checkbox">
                        {productData.brandData.map((item, i) => {
                          return (
                            <>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="brandData"
                                key={"box-" + item}
                                value={item}
                                id={item + i}
                                onClick={handleInput}
                                checked={brand.includes(item)}
                                defaultValue
                              />
                              <label
                                className="form-check-label"
                                key={"label-" + item}
                                name="brandData"
                                htmlFor={item + i}
                                onClick={handleInput}
                              >
                                <span style={{ textTransform: "capitalize" }}>
                                  {item}
                                </span>
                              </label>
                              <br />
                            </>
                          );
                        })}
                      </div>
                      <label className="fw-900">Size</label>
                      <div className="custome-checkbox">
                        {productData.sizeData.map((item, i) => {
                          return (
                            <>
                              <input
                                id={item}
                                key={i}
                                className="check-size-input"
                                type="checkbox"
                                name={item}
                                value={item}
                                onClick={handleInput}
                                defaultValue
                              />
                              <label
                                className="check-size-label"
                                htmlFor={item}
                              >
                                {item}
                              </label>
                            </>
                          );
                        })}
                      </div>
                      <div></div>
                      {/* <span style={{width:"100%"}}></span> */}
                      {productData?.colorData.length > 0 && (
                        <>
                          <label className="fw-900" style={{ width: "110%" }}>
                            Color
                          </label>
                          <div className="custome-checkbox">
                            {productData.colorData.map((item, i) => {
                              return (
                                <>
                                  <input
                                    id={item}
                                    key={i}
                                    className="check-size-input"
                                    type="checkbox"
                                    name="colorData"
                                    value={`${item}`}
                                    onClick={handleInput}
                                    defaultValue
                                  />
                                  <label
                                    className="color-check-size-label"
                                    style={{ backgroundColor: `${item}` }}
                                    for={item}
                                  ></label>
                                </>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isMobile && (
              <div className="col-md-3 primary-sidebar sticky-sidebar">
                {/* Fillter By Price */}
                <div className="sidebar-widget price_range range mb-30">
                  <h5 className="section-title style-1 mb-30">Filter items</h5>
                  <div className="price-filter">
                    <div className="price-filter-inner">
                      {/* <div id="slider-range" className="mb-20" /> */}
                      <div className="d-flex justify-content-between">
                        <label className="fw-900">Price Range :</label>
                        <div className="caption">
                          <h6 style={{ marginTop: "5px" }}>
                            ₹{value.min} - ₹{value.max}{" "}
                          </h6>
                        </div>
                      </div>

                      <RangeSlider
                        min={0}
                        max={7500}
                        step={5}
                        value={value}
                        onChange={setValue}
                        onInput={phandleInput}
                      />
                    </div>
                  </div>
                  <div className="list-group">
                    <div className="list-group-item mb-10 mt-10">
                      <label className="fw-900">Category</label>
                      <div className="custome-checkbox">
                        {productData.categoryData.map((item, i) => {
                          return (
                            <>
                              <input
                                className="form-check-input"
                                key={"box-" + item}
                                type="checkbox"
                                name="categoryData"
                                value={item}
                                id={item + i}
                                onClick={handleInput}
                                checked={category.includes(item)}
                                defaultValue
                              />
                              <label
                                className="form-check-label"
                                key={"label-" + item}
                                name="categoryData"
                                htmlFor={item + i}
                                onClick={handleInput}
                              >
                                <span style={{ textTransform: "capitalize" }}>
                                  {item}
                                </span>
                              </label>
                              <br />
                            </>
                          );
                        })}
                      </div>

                      <label className="fw-900">Brand</label>
                      <div className="custome-checkbox">
                        {productData.brandData.map((item, i) => {
                          return (
                            <>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="brandData"
                                key={"box-" + item}
                                value={item}
                                id={item + i}
                                onClick={handleInput}
                                checked={brand.includes(item)}
                                defaultValue
                              />
                              <label
                                className="form-check-label"
                                key={"label-" + item}
                                name="brandData"
                                htmlFor={item + i}
                                onClick={handleInput}
                              >
                                <span style={{ textTransform: "capitalize" }}>
                                  {item}
                                </span>
                              </label>
                              <br />
                            </>
                          );
                        })}
                      </div>
                      <label className="fw-900">Size</label>
                      <div className="custome-checkbox">
                        {productData.sizeData.map((item, i) => {
                          return (
                            <>
                              <input
                                id={item}
                                key={i}
                                className="check-size-input"
                                type="checkbox"
                                name={item}
                                value={item}
                                onClick={handleInput}
                                defaultValue
                              />
                              <label
                                className="check-size-label"
                                htmlFor={item}
                              >
                                {item}
                              </label>
                            </>
                          );
                        })}
                      </div>
                      <div></div>
                      {/* <span style={{width:"100%"}}></span> */}
                      {productData?.colorData.length > 0 && (
                        <>
                          <label className="fw-900" style={{ width: "110%" }}>
                            Color
                          </label>
                          <div className="custome-checkbox">
                            {productData?.colorData.map((item, i) => {
                              return (
                                <>
                                  <input
                                    id={item}
                                    key={i}
                                    className="check-size-input"
                                    type="checkbox"
                                    name="colorData"
                                    value={`${item}`}
                                    onClick={handleInput}
                                    defaultValue
                                  />
                                  <label
                                    className="color-check-size-label"
                                    style={{ backgroundColor: `${item}` }}
                                    for={item}
                                  ></label>
                                </>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-9">
              <div className="row product-grid">
                {currentPosts
                  .filter((Data, i) => {
                    if (
                      value?.min ||
                      value?.max ||
                      brand?.length ||
                      category?.length ||
                      color?.length ||
                      size?.length
                    ) {
                      return (
                        (value.max
                          ? Data.base_discounted_price >
                              parseInt(value.min, 10) &&
                            Data.base_discounted_price < parseInt(value.max, 10)
                          : false) ||
                        filterData.brandData.includes(Data.brand) ||
                        filterData.categoryData.includes(Data.category) ||
                        filterData.sizeData.includes(
                          Data.multipleSize.map((item, i) => item[i])
                        )
                      );
                    }
                    return Data;
                  })
                  .map((item, i) => {
                    const image =
                      item.thumbnail_image == ""
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9zuWJ0xU19Mgk0dNFnl2KIc8E9Ch0zhfCg&usqp=CAU"
                        : item.thumbnail_image;
                    const Name = item.name.substring(0, 20);

                    return (
                      <div
                        className="col-lg-3 col-md-4 col-12 col-sm-6"
                        key={i}
                      >
                        <div className="product-cart-wrap mb-30">
                          <div className="product-img-action-wrap">
                            <div className="product-img product-img-zoom">
                              <Link to={`/${item.slug}`}>
                                <img
                                  className="default-img"
                                  src={image}
                                  alt="/"
                                />
                                <img
                                  className="hover-img"
                                  src={image}
                                  alt="/"
                                />
                              </Link>
                            </div>
                            
                            <div className="product-badges product-badges-position product-badges-mrg flex-column">
                              {item.on_sale == 0 ? null : (
                                <span
                                  className="hot mb-5"
                                  style={{ padding: "5px 5px 5px 5px" }}
                                >
                                  On sale
                                </span>
                              )}
                              {item.best_selling == 0 ? null : (
                                <span
                                  className="hot mb-5"
                                  style={{
                                    padding: "5px 12px 5px 5px",
                                    width: "auto",
                                    background: "#DEFFB4",
                                    color: "rgb(61 132 64)",
                                  }}
                                >
                                  Best Selling
                                </span>
                              )}
                              {item.selling_fast == 0 ? null : (
                                <span
                                  className="hot mb-5"
                                  style={{
                                    padding: "5px 12px 5px 5px",
                                    width: "auto",
                                    background: "#ffe1b4",
                                    color: "#84633d",
                                  }}
                                >
                                  Selling Fast
                                </span>
                              )}
                              {item.limited_stock == 0 ? null : (
                                <span
                                  className="hot mb-5"
                                  style={{
                                    padding: "5px 12px 5px 5px",
                                    width: "auto",
                                    background: "rgb(251 248 151)",
                                    color: "rgb(116 92 2)",
                                  }}
                                >
                                  Limited Stock
                                </span>
                              )}
                              {item.designer_piece == 0 ? null : (
                                <span
                                  className="hot mb-5"
                                  style={{
                                    padding: "5px 12px 5px 5px",
                                    width: "auto",
                                    background: "#FE5D17",
                                    color: "#fff",
                                  }}
                                >
                                  Designer Piece
                                </span>
                              )}
                            </div>
                            {item.discount == 0 ? (
                              ""
                            ) : (
                              <div
                                className="product-badges product-badges-position-mrg product-badges discount-set"
                                style={{ right: "0" }}
                              >
                                <span className="hot">
                                  {item.discount}% OFF
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="product-content-wrap">
                            <div className="product-category">
                              <a>{item.category}</a>
                            </div>
                            <h2>
                              <a> {Name?.length > 13 ? `${Name}...` : Name}</a>
                            </h2>
                            <div className="product-rate-cover">
                              <div className="product-rate d-inline-block">
                                <div
                                  className="product-rating"
                                  style={{ width: "90%" }}
                                />
                              </div>
                              <span className="font-small ml-5 text-muted">
                                {" "}
                                ({item.rating})
                              </span>
                            </div>
                            <div>
                              <span className="font-small text-muted">
                                By {item.brand}
                              </span>
                            </div>
                            <div className="product-card-bottom">
                              <div className="product-price">
                                <span>
                                  ₹{Math.round(item.base_discounted_price)}
                                </span>
                                {item.base_discounted_price ==
                                item.base_price ? null : (
                                  <span className="old-price">
                                    ₹{Math.round(item.base_price)}
                                  </span>
                                )}
                              </div>
                              <div className="add-cart">
                                {/* <a className="add" onClick={() => { CartPost(item.id, item.variants.variant) }} ><i className="fi-rs-shopping-cart mr-5" />Add </a> */}
                                <Link to={`/${item.slug}`}>
                                  {" "}
                                  <a className="add">Shop Now </a>{" "}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {!currentPosts.length && (
                <div>
                  <h4>No items available.</h4>
                </div>
              )}
              {currentPosts.length > 0 && (
                <Pagination
                  totalPosts={List?.length}
                  postsPerPage={postsPerPage}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                />
              )}
              {/* <div className="row">
                                <div className="col-lg-12 mb-40" style={{textAlign: "center"}}>
                                    <a href="#" className="btn btn-fill-out btn-block mt-30">View More Products</a>
                                </div>
                            </div> */}
            </div>
          </div>
        </div>

        <div
          className="modal fade custom-modal"
          id="quickViewModal"
          tabIndex={-1}
          aria-labelledby="quickViewModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 col-sm-12 col-xs-12 mb-md-0 mb-sm-5">
                    <div className="detail-gallery">
                      <span className="zoom-icon">
                        <i className="fi-rs-search" />
                      </span>
                      {/* MAIN SLIDES */}
                      <div className="product-image-slider">
                        <figure className="border-radius-10">
                          <img
                            src="assets/imgs/shop/product-1-1.jpg"
                            alt="product image"
                          />
                        </figure>
                        <figure className="border-radius-10">
                          <img
                            src="assets/imgs/shop/product-16-1.jpg"
                            alt="product image"
                          />
                        </figure>
                        <figure className="border-radius-10">
                          <img
                            src="assets/imgs/shop/product-16-3.jpg"
                            alt="product image"
                          />
                        </figure>
                        <figure className="border-radius-10">
                          <img
                            src="assets/imgs/shop/product-16-4.jpg"
                            alt="product image"
                          />
                        </figure>
                        <figure className="border-radius-10">
                          <img
                            src="assets/imgs/shop/product-16-5.jpg"
                            alt="product image"
                          />
                        </figure>
                        <figure className="border-radius-10">
                          <img
                            src="assets/imgs/shop/product-16-6.jpg"
                            alt="product image"
                          />
                        </figure>
                        <figure className="border-radius-10">
                          <img
                            src="assets/imgs/shop/product-16-7.jpg"
                            alt="product image"
                          />
                        </figure>
                      </div>
                      {/* THUMBNAILS */}
                      <div className="slider-nav-thumbnails">
                        <div>
                          <img
                            src="assets/imgs/shop/thumbnail-3.jpg"
                            alt="product image"
                          />
                        </div>
                        <div>
                          <img
                            src="assets/imgs/shop/thumbnail-4.jpg"
                            alt="product image"
                          />
                        </div>
                        <div>
                          <img
                            src="assets/imgs/shop/thumbnail-5.jpg"
                            alt="product image"
                          />
                        </div>
                        <div>
                          <img
                            src="assets/imgs/shop/thumbnail-6.jpg"
                            alt="product image"
                          />
                        </div>
                        <div>
                          <img
                            src="assets/imgs/shop/thumbnail-7.jpg"
                            alt="product image"
                          />
                        </div>
                        <div>
                          <img
                            src="assets/imgs/shop/thumbnail-8.jpg"
                            alt="product image"
                          />
                        </div>
                        <div>
                          <img
                            src="assets/imgs/shop/thumbnail-9.jpg"
                            alt="product image"
                          />
                        </div>
                      </div>
                    </div>
                    {/* End Gallery */}
                  </div>
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="detail-info pr-30 pl-30">
                      <span className="stock-status out-stock"> Sale Off </span>
                      <h3 className="title-detail">
                        <a href="/Product" className="text-heading">
                          Seeds of Change Organic Quinoa, Brown
                        </a>
                      </h3>
                      <div className="product-detail-rating">
                        <div className="product-rate-cover text-end">
                          <div className="product-rate d-inline-block">
                            <div
                              className="product-rating"
                              style={{ width: "90%" }}
                            />
                          </div>
                          <span className="font-small ml-5 text-muted">
                            {" "}
                            (32 reviews)
                          </span>
                        </div>
                      </div>
                      <div className="clearfix product-price-cover">
                        <div className="product-price primary-color float-left">
                          <span className="current-price text-brand">₹38</span>
                          <span>
                            <span className="save-price font-md color3 ml-15">
                              26% Off
                            </span>
                            <span className="old-price font-md ml-15">₹52</span>
                          </span>
                        </div>
                      </div>
                      <div className="detail-extralink mb-30">
                        <div className="detail-qty border radius">
                          <a href="#" className="qty-down">
                            <i className="fi-rs-angle-small-down" />
                          </a>
                          <span className="qty-val">1</span>
                          <a href="#" className="qty-up">
                            <i className="fi-rs-angle-small-up" />
                          </a>
                        </div>
                        <div className="product-extra-link2">
                          <button
                            type="submit"
                            className="button button-add-to-cart"
                          >
                            <i className="fi-rs-shopping-cart" />
                            Add to cart
                          </button>
                        </div>
                      </div>
                      <div className="font-xs">
                        <ul>
                          <li className="mb-5">
                            Vendor:{" "}
                            <span className="text-brand">colebrook</span>
                          </li>
                          <li className="mb-5">
                            MFG:<span className="text-brand"> Jun 4.2021</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* Detail Info */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer/> */}
    </div>
  );
}

export default ShopProductCategory;
