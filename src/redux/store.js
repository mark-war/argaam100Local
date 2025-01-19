import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./features/languageSlice";
import pagesReducer from "./features/pageSlice"; // Import the new reducer
import { fieldConfigurationReducer } from "./features/fieldConfigurationSlice"; // Import the correct reducer
import { screenerDataReducer } from "./features/screenerDataSlice"; // Import the correct reducer
import { topTenSingleTabReducer } from "./features/topTenSingleTabSlice";
import userSlice from "./features/userSlice";
import sectorReducer from "./features/sectorSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { toptenMultipleTabReducer } from "./features/topTenMultiTabSlice";
import logger from "redux-logger";

import { apiSlice } from "./features/apiSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [
    "language",
    "user",
    // "pages",
    // "fieldConfig",
    // "screener",
    // "topten",
    // "toptenMultiple",
  ],
};

const combinedReducers = combineReducers({
  language: languageReducer,
  pages: pagesReducer, // Add the new reducer
  fieldConfig: fieldConfigurationReducer,
  screener: screenerDataReducer, // Use the correct reducer name
  argaamSectors: sectorReducer,
  topten: topTenSingleTabReducer,
  toptenMultiple: toptenMultipleTabReducer,
  user: userSlice,
  [apiSlice.reducerPath]: apiSlice.reducer, // add apiSlice reducer path here
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_ALL_STATE") {
    console.log("Resetting state..."); // Log when resetting
    // Reset the state of the entire store
    state = undefined;
  }

  // Pass the updated or reset state to the actual reducers
  return combinedReducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV !== "production"
      ? getDefaultMiddleware({ serializableCheck: false })
          .concat(apiSlice.middleware)
          .concat(logger)
      : getDefaultMiddleware({ serializableCheck: false }).concat(
          apiSlice.middleware
        ),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export default store;
