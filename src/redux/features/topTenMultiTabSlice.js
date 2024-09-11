import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createChartParams } from "../../utils/queryParamHelpers";
import { fetchScreenerTableData } from "../../services/screenerApi.js";

// Thunk to fetch data for specific sub-tab
export const fetchSubTabData = createAsyncThunk(
  "topten/fetchSubTabData",
  async ({ encryptedConfigJson }, { rejectWithValue }) => {
    try {
      const response = await fetchScreenerTableData(encryptedConfigJson);
      const { data: responseData } = response;
      return responseData || [{}]; // Return only the data
    } catch (error) {
      console.error("Error fetching sub-tab data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMultipleTabTopTenData = createAsyncThunk(
  "topten/fetchMultipleTabTopTenData",
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

            // Wrap responseData in an array and then wrap that in another array
            const wrappedData = [responseData || [{}]];

            // Combine responses if necessary or handle separately
            return {
              identifier: data.identifier,
              data: wrappedData, // Include primary response
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
  toptenDataMultiple: [],
  subTabs: [],
  loading: false,
  error: null,
};

const topTenMultipleTabSlice = createSlice({
  name: "toptenMultiple",
  initialState,
  reducers: {
    resetTabData: (state, action) => {
      const { tabId } = action.payload;
      if (Array.isArray(state.toptenDataMultiple)) {
        state.toptenDataMultiple = state.toptenDataMultiple.filter(
          (item) => item.identifier.split("-")[0] !== tabId
        );
      }
    },
    resetState: () => initialState,

    // New action to add a new item
    addNewTopTenItem: (state, action) => {
      const { sectionId, index, newItem } = action.payload;

      // Find the section based on the identifier (sectionId)
      const sectionIndex = state.toptenDataMultiple.findIndex(
        (section) => section.identifier === sectionId
      );

      if (sectionIndex !== -1) {
        const section = state.toptenDataMultiple[sectionIndex];

        if (index >= 0 && index < section.subTabs.length)
          if (index >= 0 && index < section.subTabs.length) {
            // Clone the existing data array to avoid mutating the state directly
            const updatedData = [...(section?.data || [])];

            // Directly assign the new item to the specified index
            updatedData[index] = newItem;

            // Create a new updated section with the modified data array
            const updatedSection = {
              ...section,
              data: updatedData, // Use the updated array with the new item at the correct index
            };

            // Update the toptenDataMultiple array with the updated section
            state.toptenDataMultiple = [
              ...state.toptenDataMultiple.slice(0, sectionIndex), // Sections before the updated one
              updatedSection, // The updated section
              ...state.toptenDataMultiple.slice(sectionIndex + 1), // Sections after the updated one
            ];
          }
        console.log(
          "State after update:",
          JSON.parse(JSON.stringify(state.toptenDataMultiple))
        );
      } else {
        console.warn("Section with ID not found:", sectionId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMultipleTabTopTenData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMultipleTabTopTenData.fulfilled, (state, action) => {
        state.loading = false;

        // Check action.payload for null or undefined items
        if (!action.payload) {
          state.error = "No data received";
          return;
        }

        // Filter out null values and existing identifiers
        const newItems = action.payload.filter((item) => item !== null);

        // Convert each item.data to arrays within an array
        const processedItems = newItems.map((item) => ({
          ...item,
          data: Array.isArray(item.data) ? item.data : [item.data || {}],
        }));

        const existingIdentifiers = new Set(
          state.toptenDataMultiple.map((item) => item.identifier)
        );

        // Merge new topten data with existing data
        state.toptenDataMultiple = [
          ...(state.toptenDataMultiple || []),
          ...processedItems.filter(
            (item) => !existingIdentifiers.has(item.identifier)
          ),
        ];

        console.log(
          "TopTen Multiple Data current state: ",
          JSON.parse(JSON.stringify(state.toptenDataMultiple))
        );

        // Extract and store subTabs
        const allSubTabs = action.payload.reduce((acc, item) => {
          if (item && item.subTabs) {
            return [...acc, ...item.subTabs];
          }
          return acc;
        }, []);
        state.subTabs = allSubTabs;
      })
      .addCase(fetchMultipleTabTopTenData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubTabData.fulfilled, (state, action) => {
        const { identifier, data } = action.payload;
        // Find the index of the item with the same identifier
        const index = state.toptenDataMultiple.findIndex(
          (item) => item.identifier === identifier
        );

        if (index !== -1) {
          // Use the existing action to add new data
          state.toptenDataMultiple[index].data = [
            ...(state.toptenDataMultiple[index]?.data || []),
            ...data,
          ];
        }

        console.log(
          "TopTen Multiple Data current state: ",
          state.toptenDataMultiple
        );
      });
  },
});

export const { resetTabData, resetState, addNewTopTenItem } =
  topTenMultipleTabSlice.actions;

// Export actions and reducer
export const toptenMultipleTabReducer = topTenMultipleTabSlice.reducer;
