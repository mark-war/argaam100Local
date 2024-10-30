import { toast } from "react-toastify";
import { strings } from "./constants/localizedStrings";




export const showSuccess = (msg, timer = 20000) => {
  const lang = strings.getLanguage();
  toast.success(msg, {
    position: "top-center",
    autoClose: timer ,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: "light",
    rtl: lang !== "en",
    toastId: "success1",
    style: {
      fontWeight: "bold",
    },
  });
};

export const showError = (msg, timer = 20000) => {
  const lang = strings.getLanguage();
  toast.error(msg, {
    position: "top-center",
    autoClose: timer ,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: "light",
    rtl: lang !== "en",
    toastId: "success1",
    style: {
      fontWeight: "bold",
    },
  });
};
