import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createChartParams } from "../../utils/queryParamHelpers";
import { fetchScreenerTableData } from "../../services/screenerApi.js";

export const fetchScreenerData = createAsyncThunk(
  "argaam100/fetchScreenerData",
  async (
    { filteredConfigurations, currentLanguage, selectedSectorId = null },
    { rejectWithValue, getState }
  ) => {
    try {
      const currentState = getState();
      console.log("Current State in Thunk: ", currentState);

      const processedData = filteredConfigurations
        .filter((item) => item.SectorID === selectedSectorId)
        .map((item) => {
          const configJson = JSON.parse(item.ConfigJson);
          const args = item.Args;
          const sectorId = item.SectorID;

          // Generate encrypted configuration JSON
          const encryptedConfigJsons = createChartParams(
            configJson,
            args,
            currentLanguage
          );

          const identifier = `${item.TabID}-${item.Pkey}-${currentLanguage}`;

          return {
            ...item,
            encryptedConfigJsons,
            identifier, // Add the unique identifier
            sectorId,
          };
        });
      // Example of making multiple requests or processing multiple encrypted params
      const results = await Promise.all(
        processedData
          .filter((data) => data.sectorId === selectedSectorId)
          .map(async (data) => {
            try {
              // process the default subtab
              const encryptedConfig = data.encryptedConfigJsons[0];
              console.log("Identifier: ", data.identifier);
              console.log("Encrypted Configuration: ", encryptedConfig);
              const response = await fetchScreenerTableData(encryptedConfig);

              // Extract only the serializable parts of the response
              const { data: responseData } = response;

              // Combine responses if necessary or handle separately
              return {
                identifier: data.identifier,
                data: responseData || {}, // Include primary response
                timestamp: Date.now(), // Add timestamp here
                sectorId: data.SectorID,
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
      console.error("Error fetching screener data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  screenerData: [],
  loading: false,
  error: null,
};

const screenerDataSlice = createSlice({
  name: "screener",
  initialState,
  reducers: {
    resetTabData: (state, action) => {
      const { tabId } = action.payload;
      if (Array.isArray(state.screenerData)) {
        state.screenerData = state.screenerData.filter(
          (item) => item.identifier.split("-")[0] !== tabId
        );
      }
      // can reset other related states if required
    },
    setExportData: (state, action) => {
      state.exportData = action.payload;
    },
    clearExportData: (state) => {
      state.exportData = [];
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Screener Tab Data
      .addCase(fetchScreenerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScreenerData.fulfilled, (state, action) => {
        state.loading = false;

        // Check action.payload for null or undefined items
        if (!action.payload) {
          state.error = "No data received";
          return;
        }

        // Filter out null values and existing identifiers
        const newItems = action.payload.filter((item) => item !== null);
        const existingIdentifiers = new Set(
          state.screenerData.map((item) => item.identifier)
        );

        // Merge new screener data with existing data
        state.screenerData = [
          ...(state.screenerData || []),
          ...newItems.filter(
            (item) => !existingIdentifiers.has(item.identifier)
          ),
        ];

        console.log("Current State of Screener Data: ", state.screenerData);
      })
      .addCase(fetchScreenerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTabData, resetState, setExportData, clearExportData } =
  screenerDataSlice.actions;

export const screenerDataReducer = screenerDataSlice.reducer;
