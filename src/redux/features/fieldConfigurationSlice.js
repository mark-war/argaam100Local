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
    if (item.SectorNameAr) {
      distinctSectorsAr.add(item.SectorNameAr);
    }
    if (item.SectorNameEn) {
      distinctSectorsEn.add(item.SectorNameEn);
    }
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
  async ({ fieldConfigurations, currentLanguage }, { rejectWithValue }) => {
    try {
      const processedData = fieldConfigurations.map((item) => {
        const configJson = JSON.parse(item.ConfigJson);
        const args = item.Args;

        // Extract specific fields from each configuration object in an array for top 10 page
        const subTabs = configJson.configuration.map((config) => ({
          tabNameEn: config.ten,
          tabNameAr: config.tar,
          isSelected: config.IA,
          displaySeq: Number(config.dsno),
        }));

        // Generate encrypted configuration JSON
        const encryptedConfigJsons = createChartParams(
          configJson,
          args,
          currentLanguage
        );

        // Create a unique identifier
        const identifier = `${item.TabID}-${item.FieldNameEn}-${item.UnitNameEn}`;

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
            const responses = await Promise.all(
              data.encryptedConfigJsons.map(async (encryptedConfig) => {
                // console.log("IDENTIFIER: ", data.identifier);
                // console.log("ENCRYPTED JSON: ", encryptedConfig);
                const response = await fetchScreenerTableData(encryptedConfig);
                const extractedSectors = extractDistinctSectors(response.data);
                return {
                  data: response.data,
                  sectors: {
                    ar: extractedSectors.distinctSectorsArabic || [], // Use empty array if null
                    en: extractedSectors.distinctSectorsEnglish || [], // Use empty array if null
                  },
                };
              })
            );

            // Combine responses if necessary or handle separately
            return {
              identifier: data.identifier,
              data: responses[0].data || {}, // Include primary response
              chartData: responses.slice(1), // Include additional responses
              sectors: {
                ar: responses[0]?.sectors?.ar || [], // Use empty array if null
                en: responses[0]?.sectors?.en || [], // Use empty array if null
              },
              subTabs: data.subTabs,
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
    chartData: null,
    fieldConfigurations: [],
    sectors: { ar: [], en: [] },
    subTabs: [],
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

        // Check action.payload for null or undefined items
        if (!action.payload) {
          state.error = "No data received";
          return;
        }

        // Extract and store sectors
        const allSectors = action.payload.reduce(
          (acc, item) => {
            if (item && item.sectors) {
              acc.ar = [...acc.ar, ...(item.sectors.ar || [])]; // Use empty array if null
              acc.en = [...acc.en, ...(item.sectors.en || [])]; // Use empty array if null
            }
            return acc;
          },
          { ar: [], en: [] }
        );
        state.sectors = {
          ar: Array.from(new Set(allSectors.ar)),
          en: Array.from(new Set(allSectors.en)),
        };

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
      .addCase(fetchScreenerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const fieldConfigurationReducer = fieldConfigurationSlice.reducer;
