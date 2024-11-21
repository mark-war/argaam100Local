export function isEmpty(n) {
  return !(!!n
    ? typeof n === "object"
      ? Array.isArray(n)
        ? !!n.length
        : !!Object.keys(n).length
      : true
    : false);
}

export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}


export default function getLangID(langtype) {
  switch (langtype) {
    case "en":
      return 2;
    case "ar":
      return 1;
    default:
      return 1;
  }
}

export function getCurrentYear(numYears) {
  return new Date().getFullYear();
}

export function yearsAgo(numYears) {
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - numYears;
  return yearsAgo;
}

export function getDateYearsAgo(yearsAgo) {
  var currentDate = new Date();
  var year = currentDate.getFullYear() - yearsAgo;
  var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var day = ("0" + currentDate.getDate()).slice(-2);

  var formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}

export function getCurrentDate() {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var day = ("0" + currentDate.getDate()).slice(-2);

  var formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}