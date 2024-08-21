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

function extractDistinctSectors(screenerData) {
  // Check if screenerData is null or undefined
  if (!screenerData) {
    return {
      distinctSectorsArabic: [],
      distinctSectorsEnglish: [],
    };
  }

  const distinctSectorsAr = new Set(); // To store distinct Arabic sector names
  const distinctSectorsEn = new Set(); // To store distinct English sector names

  // Iterate through the data
  screenerData.forEach((item) => {
    if (item.SectorNameAr) {
      distinctSectorsAr.add(item.SectorNameAr.trim());
    }
    if (item.SectorNameEn) {
      distinctSectorsEn.add(item.SectorNameEn.trim());
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

// Fetch Screener Data Thunk with filtered configurations
export const fetchScreenerData = createAsyncThunk(
  "screener/fetchScreenerData",
  async ({ filteredConfigurations, currentLanguage }, { rejectWithValue }) => {
    try {
      const processedData = filteredConfigurations.map((item) => {
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
            const subTabsCount = data.subTabs.length;

            // New process: If subtabs count is more than 2
            if (subTabsCount > 2) {
              const responses = await Promise.all(
                data.encryptedConfigJsons.map(async (encryptedConfig) => {
                  // console.log("IDENTIFIER: ", identifier);
                  // console.log("CONFIG: ", encryptedConfig);
                  const response = await fetchScreenerTableData(
                    encryptedConfig
                  );

                  // Extract only the serializable parts of the response
                  const { data: responseData } = response;

                  return {
                    data: responseData || {},
                  };
                })
              );

              return {
                identifier: data.identifier,
                data: responses,
                chartData: "",
                sectors: null,
                subTabs: data.subTabs, // Store the responses corresponding to each sub-tab
              };
            } else {
              // Process the first item (index 0)
              const encryptedConfig = data.encryptedConfigJsons[0];
              const response = await fetchScreenerTableData(encryptedConfig);

              // Extract only the serializable parts of the response
              const { data: responseData } = response;

              const extractedSectors = extractDistinctSectors(responseData);

              // Store the remaining items (index > 0) in a constant
              const historicalEncryptedConfig =
                data.encryptedConfigJsons.slice(1);

              // Combine responses if necessary or handle separately
              return {
                identifier: data.identifier,
                data: responseData || {}, // Include primary response
                chartData: historicalEncryptedConfig[0] || null, // Add a check for undefined
                sectors: {
                  ar: extractedSectors.distinctSectorsArabic || [],
                  en: extractedSectors.distinctSectorsEnglish || [],
                },
                subTabs: data.subTabs,
              };
            }
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
  screenerData: null,
  chartData: "",
  fieldConfigurations: [],
  sectors: { ar: [], en: [] },
  subTabs: [],
  loading: false,
  error: null,
};

// Create Redux Slice
const fieldConfigurationSlice = createSlice({
  name: "screener",
  initialState,
  reducers: {
    resetState: () => initialState, // Add this line
  },
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

        // Merge new screener data with existing data
        state.screenerData = [
          ...(state.screenerData || []),
          ...action.payload.filter((item) => item !== null), // Filter out null values
        ];

        // Merge sectors without duplicates
        const allSectors = action.payload.reduce(
          (acc, item) => {
            if (item && item.sectors) {
              acc.ar = [...acc.ar, ...(item.sectors.ar || [])];
              acc.en = [...acc.en, ...(item.sectors.en || [])];
            }
            return acc;
          },
          { ar: state.sectors.ar || [], en: state.sectors.en || [] }
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

export const { resetState } = fieldConfigurationSlice.actions;

// Export actions and reducer
export const fieldConfigurationReducer = fieldConfigurationSlice.reducer;
