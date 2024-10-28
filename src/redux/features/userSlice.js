import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  requestRedirectModal: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state, action) => {
      state.user = null;
    },
    setrequestRedirectModal: (state, action) => {
      state.requestRedirectModal = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setUser, clearUser, setrequestRedirectModal } = userSlice.actions;

export default userSlice.reducer;
