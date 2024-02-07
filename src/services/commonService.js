import axiosInstance from "../common/Interceptor";
import { ToasterSuccess, ToasterWarning } from "../common/toaster";
import swal from "sweetalert";

class CommonService {
  httpGet = async (requestURL) =>
    new Promise((resolve, reject) => {
      const options = {
        method: "get",
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      };
      axiosInstance
        .get(requestURL, options)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

  httpDelete = async (requestURL) =>
    new Promise((resolve, reject) => {
      const options = {
        method: "Delete",
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      };
      swal({
        title: "Are You Sure Delete Data?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axiosInstance
            .delete(requestURL, options)
            .then((response) => {
              resolve(response);
              ToasterSuccess("Success...!!");
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          ToasterWarning("Your Data Safe...!!");
        }
      });
    });

  httpPost = async (requestURL, requestBody) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .post(requestURL, requestBody, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

  httpPostFormData = async (requestURL, requestBody) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .post(requestURL, requestBody, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

  //  checkInternetConnection = async () => {
  //     let data = await Network.getNetworkStateAsync();
  //     if (data.isConnected == false || data.type == Network.NetworkStateType.NONE) {
  //         return false;
  //     }
  //     else {
  //         return true;
  //     }
  // }
}
export default CommonService;
