import axios from "axios";
import config from "../utils/config";

export const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchPageStructure = async () => {
  try {
    const response = await axiosInstance.get("/get-structure-data", {
      params: {
        nocache: new Date().getTime(), // Add a timestamp to prevent caching
      },
      headers: {
        "Cache-Control": "no-cache", // Disable cache explicitly
        Pragma: "no-cache",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching page structures:", error);
    return null;
  }
};

export const fetchFieldConfiguration = async () => {
  try {
    const response = await axiosInstance.get("/get-field-configuration");
    return response;
  } catch (error) {
    console.error("Error fetching field configurations:", error);
    return null;
  }
};

export const fetchScreenerTableData = async (encryptedConfigJson) => {
  try {
    const response = await axiosInstance.get(
      `/screener-data/${encryptedConfigJson}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching screener data:", error);
    return null;
  }
};

export const fetchArgaamSectors = async () => {
  try {
    const argaamSectors = await axiosInstance.get(
      "/get-argaam-sectors?marketid=3"
    );
    return argaamSectors.data;
  } catch (error) {
    console.error("Error fetching Argaam sectors:", error);
    return [];
  }
};

export const SubmitRequest = (body)=>{
  return axiosInstance.post("/add-product-details-request-screener", body);
}

export const PostQuestionaierScreener = (body)=>{
  return axiosInstance.post("/post-questionnaier-screener", body);
}


