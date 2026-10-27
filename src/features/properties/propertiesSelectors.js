/**
 * PROPERTIES SELECTORS
 * Derived memoized selectors for reading property states.
 */

export const selectAllProperties = (state) => state.properties.items;

export const selectPropertyById = (state, id) =>
  state.properties.items.find((p) => p.id === id);

export const selectFeaturedProperties = (state) =>
  state.properties.items.filter((p) => p.isFeatured);

export const selectMyListings = (state, myListingsIds) => {
  const ids = Array.isArray(myListingsIds) ? myListingsIds : [];
  return state.properties.items.filter((p) => ids.includes(p.id));
};

export const selectPropertyCount = (state) => state.properties.items.length;
