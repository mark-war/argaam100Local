import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createChartParams } from "../../utils/queryParamHelpers";
import {
  fetchFieldConfiguration,
  fetchScreenerTableData,
} from "../../services/screenerApi.js";

// Fetch Field Configuration Data Thunk
export const fetchFieldConfigurationData = createAsyncThunk(
  "screener/fetchFieldConfigurationData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchFieldConfiguration();
      return response.data;
    } catch (error) {
      console.error("Error fetching field configuration:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

function extractDistinctSectors(screnerData) {
  const distinctSectorsAr = new Set(); // To store distinct Arabic sector names
  const distinctSectorsEn = new Set(); // To store distinct English sector names

  // Iterate through the data
  screnerData.forEach((item) => {
    distinctSectorsAr.add(item.SectorNameAr);
    distinctSectorsEn.add(item.SectorNameEn);
  });

  // Convert Sets to arrays
  const distinctArabicSectorsArray = Array.from(distinctSectorsAr);
  const distinctEnglishSectorsArray = Array.from(distinctSectorsEn);

  // Return the distinct sector names
  return {
    distinctSectorsArabic: distinctArabicSectorsArray,
    distinctSectorsEnglish: distinctEnglishSectorsArray,
  };
}

// Fetch Screener Data Thunk
export const fetchScreenerData = createAsyncThunk(
  "screener/fetchScreenerTableData",
  async ({ fieldConfigurations }, { rejectWithValue }) => {
    try {
      const processedData = fieldConfigurations.map((item) => {
        const configJson = JSON.parse(item.ConfigJson);
        const args = item.Args;

        // Generate encrypted configuration JSON
        const encryptedConfigJson = createChartParams(configJson, args);

        // Create a unique identifier
        const identifier = `${item.TabID}-${item.FieldNameEn}-${item.UnitNameEn}`;

        return {
          ...item,
          encryptedConfigJson,
          identifier, // Add the unique identifier
        };
      });

      // Example of making multiple requests or processing multiple encrypted params
      const results = await Promise.all(
        processedData.map(async (data) => {
          try {
            const encryptedConfig = data.encryptedConfigJson;
            const response = await fetchScreenerTableData(encryptedConfig);
            const extractedSectors = extractDistinctSectors(response.data);

            return {
              identifier: data.identifier,
              data: response.data,
              sectors: {
                ar: extractedSectors.distinctSectorsArabic,
                en: extractedSectors.distinctSectorsEnglish,
              },
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

// Create Redux Slice
const fieldConfigurationSlice = createSlice({
  name: "screener",
  initialState: {
    screenerData: null,
    fieldConfigurations: [],
    sectors: { ar: [], en: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Field Configuration Data
      .addCase(fetchFieldConfigurationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldConfigurationData.fulfilled, (state, action) => {
        state.loading = false;
        state.fieldConfigurations = action.payload;
      })
      .addCase(fetchFieldConfigurationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Screener Data
      .addCase(fetchScreenerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScreenerData.fulfilled, (state, action) => {
        state.loading = false;
        state.screenerData = action.payload;
        // Extract and store sectors
        const allSectors = action.payload.reduce(
          (acc, item) => {
            acc.ar = [...acc.ar, ...item.sectors.ar];
            acc.en = [...acc.en, ...item.sectors.en];
            return acc;
          },
          { ar: [], en: [] }
        );
        state.sectors = {
          ar: Array.from(new Set(allSectors.ar)),
          en: Array.from(new Set(allSectors.en)),
        };
      })
      .addCase(fetchScreenerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const fieldConfigurationReducer = fieldConfigurationSlice.reducer;
