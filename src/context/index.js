import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import urlConstant from "../constants/urlConstant";
import CommonService from "../services/commonService";
import {
  ToasterSuccess,
  ToasterWarning,
  ToasterError,
} from "../common/toaster";
import Loding from "../component/Loding";
import swal from "sweetalert";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  let common = new CommonService();

  const random = Math.floor(Math.random() * 10000);

  
  // const user_id = localStorage.getItem('user_id') || random;
  const UserName = localStorage.getItem('user');
  const UserEmail = localStorage.getItem('userEmail');
  const tempid = localStorage.getItem('tempid');
  const user_id = tempid;

  const [isLoading, setIsLoading] = useState(false);
  const [AllCategory, SetAllCategory] = useState([]);
  const [Logo, SetLogo] = useState([]);
  const [HeaderLogo, SetHeaderLogo] = useState([]);
  const [FooterLogo, SetFooterLogo] = useState([]);
  const [FacebookLink, SeFacebook] = useState([]);
  const [TwitterLink, SetTwitter] = useState([]);
  const [InstagramLink, SetInstagram] = useState([]);
  const [YoutubeLink, SetYoutube] = useState([]);
  const [LinkedinLink, SetLinkedin] = useState([]);
  const [FooterAddress, SetFooterAddress] = useState([]);
  const [FooterPhone, SetFooterPhone] = useState([]);
  const [FooterEmail, SetFooterEmail] = useState([]);
  const [FooterDesc, SetFooterDesc] = useState([]);
  const [HomeCard, SetHomeCard] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [totalCount, setTotalCount] = useState([]);

  function CartPost(
    id,
    variant,
    increment,
    colors,
    size,
    Customizations = "",
    Sleeves
  ) {
    try {
      if (!size && size != null) {
        ToasterWarning("Please Select Size");
        return;
      } else if (!colors && colors != null) {
        ToasterWarning("Please Select Color");
        return;
      }
      
      if (!tempid) {
        localStorage.setItem("tempid", random);
        tempid = localStorage.getItem("tempid");
      }
      const localtempid = user_id == null ? tempid : user_id;
      setIsLoading(true);
      const Data = {
        id,
        variant: variant,
        quantity: increment || 1,
        user_id: parseInt(user_id),
        tempid: parseInt(localtempid),
        colors,
        size,
        customizations: Customizations,
        sleeves: Sleeves,
      };
      const CartData = `${urlConstant.Cart.PostCart}`;
      axios.post(CartData, Data).then(() => {
        setTotalCount([...totalCount, Data]);
        ToasterSuccess("Success...!!");
        setIsLoading(false);
      });
    } catch (error) {
      ToasterError("Error");
    }
  }

  function GetAllSearch(key) {
    try {
      const Data = { search: key };
      const SearchData = `${urlConstant.SearchData.SearchAllData}`;
      axios.post(SearchData, Data).then((res) => {
        setSearchData(res.data.data);
      });
    } catch (error) {
      ToasterError("Error");
    }
  }

  function GetAllCategory() {
    const GetAllCategory1 = `${urlConstant.AllCategory.GetAllCategory}`;
    common
      .httpGet(GetAllCategory1)
      .then(function (res) {
        SetAllCategory(res.data.data.data);
        SetLogo(res.data.logo);
        SetHeaderLogo(res.data.headerLogo);
        SetFooterLogo(res.data.footerLogo);
        SeFacebook(res.data.facebook);
        SetTwitter(res.data.twitter);
        SetInstagram(res.data.instagram);
        SetYoutube(res.data.youtube);
        SetLinkedin(res.data.linkedin);
        SetFooterAddress(res.data.footerAddress);
        SetFooterPhone(res.data.footerPhone);
        SetFooterEmail(res.data.footerEmail);
        SetFooterDesc(res.data.footerDesc);
      })
      .catch(function (error) {
        // ToasterWarning(error.message)
        console.log(error);
      });
  }

  function GetHomeCard() {
    setIsLoading(true);
    const GetHomeCard1 = `${urlConstant.AllHomeCard.GetHomeCard}`;
    common
      .httpGet(GetHomeCard1)
      .then(function (res) {
        SetHomeCard(res.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        // ToasterError("Error");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    GetAllCategory();
    GetHomeCard();
  }, []);

  return (
    <AppContext.Provider
      value={{
        totalCount,
        setTotalCount,
        user_id,
        UserEmail,
        UserName,
        Loding,
        CartPost,
        AllCategory,
        Logo,
        GetAllSearch,
        searchData,
        HomeCard,
        FacebookLink,
        TwitterLink,
        InstagramLink,
        YoutubeLink,
        LinkedinLink,
        HeaderLogo,
        FooterLogo,
        FooterAddress,
        FooterPhone,
        FooterEmail,
        FooterDesc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
