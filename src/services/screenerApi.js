import axios from "axios";
import config from "../utils/config";

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchPageStructure = async () => {
  try {
    const response = await axiosInstance.get("/get-structure-data");
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
