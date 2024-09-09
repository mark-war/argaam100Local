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
  },
});

export const { setPages } = pageSlice.actions;

export default pageSlice.reducer;
