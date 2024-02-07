import Error from "./component/404error";
import Cart from "./component/Cart/Cart";
import Checkout from "./component/Checkout/Checkout";
import Contact from "./component/Contact/Contact";
import Home from "./component/Home/Home";
import PrivacyPolicy from "./component/Privacy-policy/PrivacyPolicy";
import Product from "./component/Product/Product";
import ShopProduct from "./component/Shop-product/ShopProduct";
import ShopProductCategory from "./component/Shop-product/ShopProductCategory";
import Terms_Service from "./component/Terms-Service/Terms_Service";
import RefundPolicy from "./component/RefundPolicy/RefundPolicy";
import ReturnExchangePolicy from "./component/ReturnExchangePolicy/ReturnExchangePolicy";
import ShippingDelivery from "./component/ShippingDelivery/ShippingDelivery";
import OrderDetail from "./component/OrderDetail/OrderDetail";
import TicketsDetail from "./component/TicketsDetail/TicketsDetail";
import OrderTrack from "./component/OrderTrack/OrderTrack";
import SupportTicket from "./component/SupportTicket/SupportTicket";

const routerList = [
  {
    path: "/",
    element: () => <Home />,
    exact: true,
  },
  {
    path: "/ShopProduct",
    element: () => <ShopProduct />,
    exact: true,
  },
  {
    path: "/ShopProduct/:name",
    element: () => <ShopProductCategory />,
    exact: true,
  },
  {
    path: "/:id",
    element: () => <Product />,
    exact: true,
  },
  {
    path: "/Cart",
    element: () => <Cart />,
    exact: true,
  },
  {
    path: "/Checkout",
    element: () => <Checkout />,
    exact: true,
  },
  {
    path: "/Contact",
    element: () => <Contact />,
    exact: true,
  },
  {
    path: "/Privacy-Policy",
    element: () => <PrivacyPolicy />,
    exact: true,
  },
  {
    path: "/Terms-Service",
    element: () => <Terms_Service />,
    exact: true,
  },
  {
    path: "/Refund-Policy",
    element: () => <RefundPolicy />,
    exact: true,
  },
  {
    path: "/Return-Exchange-Policy",
    element: () => <ReturnExchangePolicy />,
    exact: true,
  },
  {
    path: "/Shipping-Delivery",
    element: () => <ShippingDelivery />,
    exact: true,
  },
  {
    path: "*",
    element: () => <Error />,
    exact: true,
  },
  {
    path: "/OrderDetail",
    element: () => <OrderDetail />,
    exact: true,
  },
  {
    path: "/TicketsDetail",
    element: () => <TicketsDetail />,
    exact: true,
  },
  {
    path: "/OrderTrack",
    element: () => <OrderTrack />,
    exact: true,
  },
  {
    path: "/SupportTicket",
    element: () => <SupportTicket />,
    exact: true,
  },
];
export default routerList;
