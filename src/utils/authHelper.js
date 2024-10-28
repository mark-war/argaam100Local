import { clearUser, setUser } from "../redux/features/userSlice";
import store from "../redux/store";
import { axiosInstance } from "../services/screenerApi";
import { isEmpty, parseJwt } from "./helperFunctions";

export function redirectLogin(autoLogin, email = null) {
  const { VITE_APP_LOGIN_URL: loginUrl } = import.meta.env;
  const lang = store?.getState()?.language?.currentLanguage;
  // const lang = getLocaleFromURL();

  const urlParams = new URLSearchParams(window.location.search);
  const requestRedirect = urlParams.get("requestRedirect");
  const url = `${loginUrl}/${lang}?refferalURL=${window.location.href}${
    !isEmpty(autoLogin) ? "&autoRedirect=true" : ""
  }${!isEmpty(email) ? `&email=${email}` : ""}${
    requestRedirect == "true" ? "&requestRedirect=true" : ""
  }&refferalSearch=${urlParams
    ?.toString()
    ?.replace("&", "(rs)")}&requiredToken=true&app=Screener`;

  window.open(url, "_self");
}

export function resetUser(reload = true, autologout = false) {
  const uniqId = localStorage.getItem("uniqueIdentifier");
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("uniqueIdentifier");

  store.dispatch(clearUser());

  if (reload) {
    const { VITE_APP_LOGOUT_URL: logoutUrl } = import.meta.env;

    window.open(
      `${logoutUrl}?refferalURL=${window.location.href}&uniqueIdentifier=${uniqId}&autologout=${autologout}`,
      "_self"
    );
  }
  // else {
  //   getLoginUserMail()
  //     .then((res) => {
  //       if (!isEmpty(res)) {
  //         // const key = "redirectemails";
  //         // const redirectemails = JSON.parse(localStorage.getItem(key)) || [];
  //         // const hasRedirected = redirectemails?.includes(res);
  //         // if (!hasRedirected) {
  //         redirectLogin(true, res);
  //         // }
  //       }else{
  //         setCompany(defaultCompanies[0]);
  //       }
  //     })
  //     .catch((err) => {
  //       setCompany(defaultCompanies[0]);
  //     });
  // }
}


export async function refreshToken() {
  // console.log("REFRESH");
  const jwtToken = localStorage.getItem("jwtToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const uniqueIdentifier = localStorage.getItem("uniqueIdentifier");

  const newToken = await axiosInstance.post(`${API_URL}${ENDPOINTS.refreshToken}`, {
    jwtToken,
    refreshToken,
    tokenOption: "Screener",
    uniqueIdentifier,
  });
  const { jwtToken: newjwtToken, refreshToken: newrefreshToken } =
    newToken.data;

  localStorage.setItem("jwtToken", newjwtToken);
  localStorage.setItem("refreshToken", newrefreshToken);

  const splittokens = newjwtToken.split(".");
  const parsedToken = parseJwt(newjwtToken);
  let user = {
    ...parsedToken,
  };

  const extstinguser = store.getState()?.user?.user;
  const hasExpired =
    extstinguser?.IsScreenerTrialOrScreenerPackageExpired !== "true" &&
    user?.IsScreenerTrialOrScreenerPackageExpired === "true";

  store.dispatch(setUser(user));

  return Promise.resolve(hasExpired);
}

export function getAccessToken() {
  return localStorage.getItem("jwtToken");
}
