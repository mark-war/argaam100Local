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

const initialState = {
  fieldConfigurations: [],
  loading: false,
  error: null,
};

// Create Redux Slice
const fieldConfigurationSlice = createSlice({
  name: "fieldConfig",
  initialState,
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
      });
  },
});

// Export actions and reducer
export const fieldConfigurationReducer = fieldConfigurationSlice.reducer;
