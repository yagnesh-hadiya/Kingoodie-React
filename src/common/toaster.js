import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToasterSuccess(Message) {
  toast.success(Message, {
    autoClose: 2000,
  });
}
function ToasterError(Message) {
  toast.error(Message, {
    autoClose: 2000,
  });
}
function ToasterWarning(Message) {
  toast.info(Message, {
    autoClose: 2000,
  });
}
export { ToasterSuccess, ToasterError , ToasterWarning };

