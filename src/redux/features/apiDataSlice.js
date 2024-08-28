import { createSlice } from "@reduxjs/toolkit";

const apiDataSlice = createSlice({
  name: "apiData",
  initialState: {
    pages: [],
  },
  reducers: {
    setApiData: (state, action) => {
      state.pages = action.payload;
    },
  },
});

export const { setApiData } = apiDataSlice.actions;

export default apiDataSlice.reducer;
