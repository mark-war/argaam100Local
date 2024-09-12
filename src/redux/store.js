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
  whitelist: ["language", "apiData", "screener", "topten", "toptenMultiple"],
};

const rootReducer = combineReducers({
  language: languageReducer,
  pages: pagesReducer,
  fieldConfig: fieldConfigurationReducer,
  screener: screenerDataReducer,
  argaamSectors: sectorReducer,
  topten: topTenSingleTabReducer,
  toptenMultiple: toptenMultipleTabReducer,
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
