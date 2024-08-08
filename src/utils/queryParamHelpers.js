import CryptoJS from "crypto-js";
import { LANGUAGES, LANGUAGEID } from "./constants/localizedStrings";

function keepObjectKeys(object, keysToKeep) {
  const newObject = {};

  keysToKeep.forEach((key) => {
    if (object.hasOwnProperty(key)) {
      newObject[key] = object[key];
    }
  });

  return newObject;
}

/*
Mapping : 
fid = filterid
cid= id
ftid = fiscalperiodtypeid 
noc = noofcompanies
Selected languageid = language
*/

// export const createChartParams = (params, args) => {
//   const parsedParams = typeof params === "string" ? JSON.parse(params) : params;
//   const configuration = parsedParams.configuration[0];

//   // Map the desired output structure
//   const mappedParams = {
//     id: parseInt(configuration.cid, 10),
//     filterid: parseInt(configuration.fid, 10),
//     marketid: 3,
//     fiscalperiodtypeid: parseInt(configuration.config[0].ftid, 10),
//     noofcompanies: parseInt(configuration.noc, 10),
//     language: "en",
//   };

//   const argsarr = args?.length ? args?.split(",").map((i) => i.trim()) : [];
//   const filteredparams = keepObjectKeys(mappedParams, argsarr);
//   const queryString = JSON.stringify(filteredparams);

//   const secretKeyHex = CryptoJS.enc.Hex.parse(
//     "7a1b6c4d3e2f1a0b7c8d9e0a1b2c3d4e"
//   );

//   const iv = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");

//   const encryptedText = CryptoJS.AES.encrypt(queryString, secretKeyHex, {
//     iv,
//   }).toString();

//   return btoa(encryptedText);
// };

export const createChartParams = (params, args, lang) => {
  const parsedParams = typeof params === "string" ? JSON.parse(params) : params;
  const configurations = parsedParams.configuration;

  const argsArr = args?.length ? args.split(",").map((i) => i.trim()) : [];

  const encryptedResults = configurations.map((configuration) => {
    // Map the desired output structure
    const mappedParams = {
      id: parseInt(configuration.cid, 10),
      filterid: parseInt(configuration.fid, 10),
      marketid: 3,
      fiscalperiodtypeid: parseInt(configuration.config[0].ftid, 10),
      noofcompanies: parseInt(configuration.noc, 10),
      language: LANGUAGEID[lang.toUpperCase()],
    };

    const filteredParams = keepObjectKeys(mappedParams, argsArr);
    const queryString = JSON.stringify(filteredParams);

    const secretKeyHex = CryptoJS.enc.Hex.parse(
      "7a1b6c4d3e2f1a0b7c8d9e0a1b2c3d4e"
    );

    const iv = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");

    const encryptedText = CryptoJS.AES.encrypt(queryString, secretKeyHex, {
      iv,
    }).toString();

    return btoa(encryptedText);
  });

  return encryptedResults;
};
