import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./features/languageSlice";
import pagesReducer from "./features/pageSlice"; // Import the new reducer
import { fieldConfigurationReducer } from "./features/fieldConfigurationSlice"; // Import the correct reducer
import { screenerDataReducer } from "./features/screenerDataSlice"; // Import the correct reducer
import { topTenSingleTabReducer } from "./features/topTenSingleTabSlice";
import sectorReducer from "./features/sectorSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { toptenMultipleTabReducer } from "./features/topTenMultiTabSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [
    "language",
    "pages",
    "fieldConfig",
    "screener",
    "topten",
    "toptenMultiple",
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
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export default store;
