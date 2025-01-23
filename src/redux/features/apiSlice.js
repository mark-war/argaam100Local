import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../utils/config";

export const apiSlice = createApi({
  reducerPath: "companyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.chartsApiUrl,
  }), // Base URL from the API
  endpoints: (builder) => ({
    // Define an endpoint for fetching the data, passing the marketId as a parameter
    fetchCompanyData: builder.query({
      query: () => ({
        url: "/country-markets-sector-companies", // The endpoint path
        params: { includeInsurance: true }, // The query parameter (marketId)
      }),
    }),
  }),
});

export const { useFetchCompanyDataQuery } = apiSlice;
