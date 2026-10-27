/**
 * REDUX STORE CONFIGURATION
 * Combines features: properties, favorites, enquiries.
 */

import { configureStore } from "@reduxjs/toolkit";
import propertiesReducer from "../features/properties/propertiesSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import enquiriesReducer from "../features/enquiries/enquiriesSlice";

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    favorites: favoritesReducer,
    enquiries: enquiriesReducer
  },
  devTools: process.env.NODE_ENV !== "production"
});

export default store;
