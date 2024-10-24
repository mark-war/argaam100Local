import { createSlice } from "@reduxjs/toolkit";

const sectorSlice = createSlice({
  name: "argaamSectors",
  initialState: {
    sectors: [],
  },
  reducers: {
    setArgaamSectors: (state, action) => {
      state.sectors = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setArgaamSectors, resetState } = sectorSlice.actions;

export default sectorSlice.reducer;
