/**
 * ENQUIRIES SLICE — Redux Toolkit
 * Manages submitted property enquiries, inspections, and status updates.
 * Connected to Dashboard and Enquiry form.
 */

import { createSlice } from "@reduxjs/toolkit";
import { StorageService } from "../../services/storageService";

const initialState = {
  items: StorageService.getEnquiries()
};

export const enquiriesSlice = createSlice({
  name: "enquiries",
  initialState,
  reducers: {
    addEnquiry: (state, action) => {
      const newEnquiry = {
        id: `enq-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
        status: "New",
        ...action.payload
      };
      state.items.unshift(newEnquiry);
      StorageService.saveEnquiries(state.items);
    },
    updateEnquiryStatus: (state, action) => {
      const { id, status } = action.payload;
      const enquiry = state.items.find(e => e.id === id);
      if (enquiry) {
        enquiry.status = status;
        StorageService.saveEnquiries(state.items);
      }
    },
    deleteEnquiry: (state, action) => {
      state.items = state.items.filter(e => e.id !== action.payload);
      StorageService.saveEnquiries(state.items);
    }
  }
});

export const { addEnquiry, updateEnquiryStatus, deleteEnquiry } = enquiriesSlice.actions;

// Selectors
export const selectAllEnquiries = (state) => state.enquiries.items;
export const selectEnquiriesByPropertyId = (state, propertyId) =>
  state.enquiries.items.filter(e => e.propertyId === propertyId);
export const selectEnquiryCount = (state) => state.enquiries.items.length;

export default enquiriesSlice.reducer;
