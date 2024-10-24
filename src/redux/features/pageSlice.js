import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "pages",
  initialState: {
    pages: [],
  },
  reducers: {
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setPages, resetState } = pageSlice.actions;

export default pageSlice.reducer;
