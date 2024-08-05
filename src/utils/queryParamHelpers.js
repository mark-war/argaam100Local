import CryptoJS from "crypto-js";

function keepObjectKeys(object, keysToKeep) {
  const newObject = {};

  keysToKeep.forEach((key) => {
    if (object.hasOwnProperty(key)) {
      newObject[key] = object[key];
    }
  });

  return newObject;
}

export const createChartParams = (params, args) => {
  // console.log("Params received:", params);
  // console.log("Args received:", args);
  const parsedParams = typeof params === "string" ? JSON.parse(params) : params;
  // console.log("Parsed Params: ", parsedParams);
  const configuration = parsedParams.configuration[0];

  // Map the desired output structure
  const mappedParams = {
    id: parseInt(configuration.fid, 10),
    filterid: parseInt(configuration.fid, 10),
    marketid: 3,
    fiscalperiodtypeid: parseInt(configuration.config[0].ftid, 10),
    noofcompanies: parseInt(configuration.noc, 10),
    language: "en",
  };

  // console.log("Mapped Params:", mappedParams);

  const argsarr = args?.length ? args?.split(",").map((i) => i.trim()) : [];
  const filteredparams = keepObjectKeys(mappedParams, argsarr);
  const queryString = JSON.stringify(filteredparams);
  // console.log("filteredparams", filteredparams);
  // console.log("queryString", queryString);

  const secretKeyHex = CryptoJS.enc.Hex.parse(
    "7a1b6c4d3e2f1a0b7c8d9e0a1b2c3d4e"
  );

  const iv = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");

  const encryptedText = CryptoJS.AES.encrypt(queryString, secretKeyHex, {
    iv,
  }).toString();
  // console.log("Encrypted Params:", encryptedText);
  return btoa(encryptedText);
};
