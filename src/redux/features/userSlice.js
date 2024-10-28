import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  requestRedirectModal: false,
  trialStatus: {visible:false, status: 0},

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
    settrialStatusModal: (state, action) => {
      state.trialStatus = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setUser, clearUser, setrequestRedirectModal , settrialStatusModal} = userSlice.actions;

export default userSlice.reducer;
