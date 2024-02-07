import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import urlConstant from "../constants/urlConstant";
import CommonService from "../services/commonService";
import { ToasterWarning, ToasterSuccess, ToasterError } from "../common/toaster";
import { ToastContainer } from "react-toastify";
import Loding from "../component/Loding";
import { config } from '../constants/config'
const shippingContext = createContext();
// const [PinMessage, setPinMessage] = useState('');


const ShippingProvider = ({ children }) => {
  let common = new CommonService();


  


  function CreateOrder() {
    const CreateOrder1 = `${urlConstant.ShippingApi.CreateOrder}`;
    const Data = {
      "data": {
        "shipments": [
          {
            "waybill": "",
            "order": "GK00356",
            "sub_order": "A",
            "order_date": "31-01-2018",
            "total_amount": "999",
            "name": "Bharat",
            "company_name": "ABC Company",
            "add": "104, Shreeji Sharan",
            "add2": "",
            "add3": "",
            "pin": "400067",
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India",
            "phone": "9876543210",
            "alt_phone": "9876543210",
            "email": "abc@gmail.com",
            "is_billing_same_as_shipping": "no",
            "billing_name": "Bharat",
            "billing_company_name": "ABC Company",
            "billing_add": "104, Shreeji Sharan",
            "billing_add2": "",
            "billing_add3": "",
            "billing_pin": "400067",
            "billing_city": "Mumbai",
            "billing_state": "Maharashtra",
            "billing_country": "India",
            "billing_phone": "9876543210",
            "billing_alt_phone": "9876543210",
            "billing_email": "abc@gmail.com",
            "products": [
              {
                "product_name": "Green color tshirt",
                "product_sku": "GC001-1",
                "product_quantity": "1",
                "product_price": "100",
                "product_tax_rate": "5",
                "product_hsn_code": "91308",
                "product_discount": "0"
              },
              {
                "product_name": "Red color tshirt",
                "product_sku": "GC002-2",
                "product_quantity": "1",
                "product_price": "200",
                "product_tax_rate": "5",
                "product_hsn_code": "91308",
                "product_discount": "0"
              }
            ],
            "shipment_length": "10",
            "shipment_width": "10",
            "shipment_height": "5",
            "weight": "100",
            "shipping_charges": "0",
            "giftwrap_charges": "0",
            "transaction_charges": "0",
            "total_discount": "0",
            "first_attemp_discount": "0",
            "cod_charges": "0",
            "advance_amount": "0",
            "cod_amount": "300",
            "payment_mode": "COD",
            "reseller_name": "",
            "eway_bill_number": "",
            "gst_number": "",
            "return_address_id": "1293"
          }
        ],
        "pickup_address_id": "1293",
        "access_token": "5a7b40197cd919337501dd6e9a3aad9a",
        "secret_key": "2b54c373427be180d1899400eeb21aab",
        "logistics": "Delhivery",
        "s_type": "",
        "order_type": ""
      }
    }
    axios.post(CreateOrder1, Data).then(function (res) {
      console.log(res.data.data);
    })
      .catch(function (error) {
        ToasterError("Error");
      });
  }


  function TrackOrder(id) {
    const TrackOrder1 = `${urlConstant.ShippingApi.TrackOrder}`;
    console.log(id);
    const Data = {
      "data": {
        "awb_number_list": id,
        "access_token": config.access_token,
        "secret_key": config.secret_key
      }
    }
    axios.post(TrackOrder1, Data).then(function (res) {
      console.log(res.data.data);
    })
      .catch(function (error) {
        ToasterError("Error");
      });
  }

  function PrintShipmnet() {
    const PrintShipmnet1 = `${urlConstant.ShippingApi.PrintShipmnet}`;
    const Data = {
      "data": {
        "awb_numbers": "1333110027388",
        "page_size": "A4",
        "access_token": config.access_token,
        "secret_key": config.secret_key,
        "display_cod_prepaid": "",
        "display_shipper_mobile": "",
        "display_shipper_address": ""
      }
    }
    axios.post(PrintShipmnet1, Data).then(function (res) {
      console.log(res.data.data);
    })
      .catch(function (error) {
        ToasterError("Error");
      });
  }


  function Manifest() {
    const Manifest1 = `${urlConstant.ShippingApi.Manifest}`;
    const Data = {
      "data": {
        "awb_numbers": "86210005902",
        "access_token": config.access_token,
        "secret_key": config.secret_key
      }
    }
    axios.post(Manifest1, Data).then(function (res) {
      console.log(res.data.data);
    })
      .catch(function (error) {
        ToasterError("Error");
      });
  }

  function OrderCancel() {
    const OrderCancel1 = `${urlConstant.ShippingApi.OrderCancel}`;
    const Data = {
      "data": {
        "access_token": "5a7b40197cd919337501dd6e9a3aad9a",
        "access_token": config.access_token,
        "secret_key": config.secret_key
      }
    }
    axios.post(OrderCancel1, Data).then(function (res) {
      console.log(res.data.data);
    })
      .catch(function (error) {
        ToasterError("Error");
      });
  }

  useEffect(() => {
    // GetPinCode()
    // CreateOrder()
    // TrackOrder()
    // PrintShipmnet()
    // Manifest()
    // OrderCancel()
  }, [])


  return (
    <shippingContext.Provider value={{ CreateOrder, TrackOrder, PrintShipmnet, Manifest, OrderCancel }}>
      {children}
    </shippingContext.Provider>
  );
};

const useShippingContext = () => {
  return useContext(shippingContext);
};

export { ShippingProvider, useShippingContext };
