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

export const fetchDistinctSectors = async () => {
  try {
    const fieldConfig = await fetchFieldConfiguration();
    if (fieldConfig && fieldConfig.sectors) {
      const distinctSectors = Array.from(
        new Set(fieldConfig.sectors.map((sector) => sector.name))
      );
      return distinctSectors;
    }
    return [];
  } catch (error) {
    console.error("Error fetching distinct sectors:", error);
    return [];
  }
};
