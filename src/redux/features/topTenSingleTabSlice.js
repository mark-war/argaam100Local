import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createChartParams } from "../../utils/queryParamHelpers";
import { fetchScreenerTableData } from "../../services/screenerApi.js";

export const fetchTopTenData = createAsyncThunk(
  "topten/fetchTopTenData",
  async (
    { filteredConfigurations, currentLanguage },
    { rejectWithValue, getState }
  ) => {
    try {
      const currentState = getState();
      console.log("Current State in Thunk: ", currentState);

      const processedData = filteredConfigurations.map((item) => {
        const configJson = JSON.parse(item.ConfigJson);
        const args = item.Args;

        // Generate encrypted configuration JSON
        const encryptedConfigJsons = createChartParams(
          configJson,
          args,
          currentLanguage
        );

        // Extract specific fields from each configuration object in an array for top 10 page
        const subTabs = configJson.configuration.map((config, index) => ({
          tabNameEn: config.ten,
          tabNameAr: config.tar,
          isSelected: config.IA,
          displaySeq: Number(config.dsno),
          direction: config.extraparams?.ob || "",
          encryptedConfigJson: encryptedConfigJsons[index] || null, // Associate encryptedConfigJson for each subtab
          originalIndex: index, // Add the original index here
          tabNoteEn: config.te,
          tabNoteAr: config.ta
        }));

        const identifier = `${item.TabID}-${item.Pkey}-${currentLanguage}`;

        return {
          ...item,
          encryptedConfigJsons,
          identifier, // Add the unique identifier
          subTabs: subTabs, // Store the extracted array
        };
      });
      // Example of making multiple requests or processing multiple encrypted params
      const results = await Promise.all(
        processedData.map(async (data) => {
          try {
            // process the default subtab
            const encryptedConfig = data.encryptedConfigJsons[0];
            const response = await fetchScreenerTableData(encryptedConfig);

            // Extract only the serializable parts of the response
            const { data: responseData } = response;

            // Combine responses if necessary or handle separately
            return {
              identifier: data.identifier,
              data: responseData || {}, // Include primary response
              chartData: data.encryptedConfigJsons[1] || null, // Add a check for undefined
              subTabs: data.subTabs,
              timestamp: Date.now(), // Add timestamp here
            };
          } catch (error) {
            console.error("Error in processing data:", error);
            return null; // Handle errors gracefully
          }
        })
      );

      // Handle the aggregated results if needed
      console.log("Aggregated Results:", results);

      return results;
    } catch (error) {
      console.error("Error fetching top ten data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  toptenData: [],
  chartData: "",
  subTabs: [],
  loading: false,
  error: null,
};

const topTenSingleTabSlice = createSlice({
  name: "topten",
  initialState,
  reducers: {
    resetTabData: (state, action) => {
      const { tabId } = action.payload;
      if (Array.isArray(state.toptenData)) {
        state.toptenData = state.toptenData.filter(
          (item) => item.identifier.split("-")[0] !== tabId
        );
      }
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopTenData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopTenData.fulfilled, (state, action) => {
        state.loading = false;

        // Check action.payload for null or undefined items
        if (!action.payload) {
          state.error = "No data received";
          return;
        }

        // Filter out null values and existing identifiers
        const newItems = action.payload.filter((item) => item !== null);
        const existingIdentifiers = new Set(
          state.toptenData.map((item) => item.identifier)
        );

        // Merge new topten data with existing data
        state.toptenData = [
          ...(state.toptenData || []),
          ...newItems.filter(
            (item) => !existingIdentifiers.has(item.identifier)
          ),
        ];

        // Extract and store subTabs
        const allSubTabs = action.payload.reduce((acc, item) => {
          if (item && item.subTabs) {
            return [...acc, ...item.subTabs];
          }
          return acc;
        }, []);
        state.subTabs = allSubTabs;

        // Store chartData
        state.chartData = action.payload.map((item) => item.chartData || []); // Ensure chartData is properly extracted
      })
      .addCase(fetchTopTenData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTabData, resetState } = topTenSingleTabSlice.actions;

// Export actions and reducer
export const topTenSingleTabReducer = topTenSingleTabSlice.reducer;
