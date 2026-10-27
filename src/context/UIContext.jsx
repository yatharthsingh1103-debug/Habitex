/**
 * UI CONTEXT — React Context API
 * Manages global user interface state: toast notifications, global modals, and feedback.
 * Strictly separate from business state (Redux).
 */

import React, { createContext, useContext, useState, useCallback } from "react";

export const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    content: null,
    onConfirm: null,
    confirmText: "Confirm",
    cancelText: "Cancel"
  });

  // Toasts
  const showToast = useCallback((message, type = "info", duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Modals
  const openModal = useCallback(({ title, content, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => {
    setModal({
      isOpen: true,
      title,
      content,
      onConfirm,
      confirmText,
      cancelText
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const value = {
    toasts,
    showToast,
    removeToast,
    modal,
    openModal,
    closeModal
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
