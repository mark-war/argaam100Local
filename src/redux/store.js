import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./features/languageSlice";
import apiDataReducer from "./features/apiDataSlice"; // Import the new reducer
import { fieldConfigurationReducer } from "./features/fieldConfigurationSlice"; // Import the correct reducer
import sectorReducer from "./features/sectorSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["language", "apiData", "screener"],
};

const rootReducer = combineReducers({
  language: languageReducer,
  apiData: apiDataReducer, // Add the new reducer
  screener: fieldConfigurationReducer, // Use the correct reducer name
  argaamSectors: sectorReducer,
});

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
