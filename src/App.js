import React from "react";
import routerList from "./router";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Whatsapp from './assets/imgs/theme/whatsapp.png';
import Header from "./component/Header";
import Footer from "./component/Footer";
import StickyCart from "./component/StickyCart";
import { useAppContext } from "./context";

function App() {
  const {totalCount} = useAppContext();

  return (
    <div className="App">
      <Header />
        <Routes>
          {routerList.map((item, i) => {
            return (<Route key={i} element={<item.element />} path={item.path} exact={item.exact} />);
          })}
        </Routes>
        <Footer />
      <a className="whats-app" href='https://api.whatsapp.com/send?phone=+919624501047' target="_blank">
        <img className src={Whatsapp} alt="/" />
      </a>
     {totalCount.length > 0 && <StickyCart/>}
    </div>
  );
}

export default App;
