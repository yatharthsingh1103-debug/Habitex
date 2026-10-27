/**
 * FAVORITES SLICE — Redux Toolkit
 * Manages user bookmarked / saved property IDs across the application.
 * Synchronizes with localStorage so bookmarks persist across reloads.
 */

import { createSlice } from "@reduxjs/toolkit";
import { StorageService } from "../../services/storageService";

const initialState = {
  savedIds: StorageService.getFavorites()
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const id = action.payload;
      if (!state.savedIds.includes(id)) {
        state.savedIds.push(id);
        StorageService.saveFavorites(state.savedIds);
      }
    },
    removeFavorite: (state, action) => {
      const id = action.payload;
      state.savedIds = state.savedIds.filter(savedId => savedId !== id);
      StorageService.saveFavorites(state.savedIds);
    },
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.savedIds.includes(id)) {
        state.savedIds = state.savedIds.filter(savedId => savedId !== id);
      } else {
        state.savedIds.push(id);
      }
      StorageService.saveFavorites(state.savedIds);
    },
    clearFavorites: (state) => {
      state.savedIds = [];
      StorageService.saveFavorites([]);
    }
  }
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavoriteIds = (state) => state.favorites.savedIds;
export const selectIsFavorite = (state, id) => state.favorites.savedIds.includes(id);
export const selectFavoriteCount = (state) => state.favorites.savedIds.length;

export default favoritesSlice.reducer;
