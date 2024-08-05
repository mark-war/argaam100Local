import { createSlice } from "@reduxjs/toolkit";
import config from "../../utils/config";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: config.defaultLanguage, //get the default language configured
  },
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
