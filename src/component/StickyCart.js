import React from "react";
import { useAppContext } from "../context";
import { Link } from "react-router-dom";

const StickyCart = () => {
  const { totalCount } = useAppContext();
  return (
    <div className="productList">
      <div className="container">
        <div className="row  justify-content-end align-items-center">
          <h4>There are <span>{totalCount.length}</span> products in your cart.</h4>
          <div className="footer-button justify-content-end">
            <Link to={"/Checkout"}>
              <button className="btn btn-xl">CheckOut</button>
            </Link>
            <Link to={"/Cart"}>
              <button className="btn btn-xl">Go to cart</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCart;
