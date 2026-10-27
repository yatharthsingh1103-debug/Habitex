/**
 * PROPERTIES SLICE — Redux Toolkit
 * Manages marketplace property listings, addition of new listings,
 * updates, removals, and synchronization with storage.
 */

import { createSlice } from "@reduxjs/toolkit";
import { StorageService } from "../../services/storageService";
import { INITIAL_PROPERTIES } from "../../data/properties";

const initialState = {
  items: StorageService.getProperties(),
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    addProperty: (state, action) => {
      // Prepend new listing to state
      state.items.unshift(action.payload);
      StorageService.saveProperties(state.items);
      // Track as user's listing
      const myListings = StorageService.getMyListings();
      if (!myListings.includes(action.payload.id)) {
        myListings.unshift(action.payload.id);
        StorageService.saveMyListings(myListings);
      }
    },
    updateProperty: (state, action) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        StorageService.saveProperties(state.items);
      }
    },
    deleteProperty: (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      StorageService.saveProperties(state.items);
      // Also remove from user's listings
      const myListings = StorageService.getMyListings().filter(id => id !== action.payload);
      StorageService.saveMyListings(myListings);
    },
    resetProperties: (state) => {
      state.items = INITIAL_PROPERTIES;
      StorageService.saveProperties(INITIAL_PROPERTIES);
    }
  }
});

export const { addProperty, updateProperty, deleteProperty, resetProperties } = propertiesSlice.actions;

export default propertiesSlice.reducer;
