/**
 * AUTH CONTEXT — React Context API
 * Manages user session, login, logout, roles, and profile state.
 * Strictly separate from Redux (which manages marketplace business data).
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { StorageService } from "../services/storageService";

export const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: "usr-001",
    name: "Yatharth",
    email: "yatharth@habitex.in",
    phone: "9810123456",
    role: "Seller",
    company: "Yatharth Capital Real Estate LLP",
    avatar: "Y"
  },
  {
    id: "usr-002",
    name: "Aaditi Sharma",
    email: "aaditi.sharma@example.com",
    phone: "9871234567",
    role: "Buyer",
    company: "Private Family Office",
    avatar: "A"
  },
  {
    id: "usr-003",
    name: "Vikramaditya Singhania",
    email: "singhania.advisory@habitex.in",
    phone: "9811044219",
    role: "Agent",
    company: "Singhania Advisory Partners",
    avatar: "V"
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // 1. Check storage for existing session
    const stored = StorageService.getUser();
    if (stored) return stored;
    // 2. Default to Yatharth if not explicitly logged out
    const isExplicitlyLoggedOut = localStorage.getItem("habitex_logged_out") === "true";
    if (!isExplicitlyLoggedOut) {
      StorageService.saveUser(DEFAULT_USERS[0]);
      return DEFAULT_USERS[0];
    }
    return null;
  });

  const login = (email, password, role = "Seller", name = "") => {
    localStorage.removeItem("habitex_logged_out");
    // Match against default users or create dynamic user
    const existing = DEFAULT_USERS.find(
      u => u.email.toLowerCase() === (email || "").toLowerCase()
    );

    const activeUser = existing
      ? { ...existing, role: role || existing.role }
      : {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: name || (email.split("@")[0] || "User").replace(/[._]/g, " "),
          email,
          phone: "9810123456",
          role: role || "Buyer",
          company: "Independent Member",
          avatar: (name ? name[0] : email[0] || "U").toUpperCase()
        };

    setUser(activeUser);
    StorageService.saveUser(activeUser);
    return { success: true, user: activeUser };
  };

  const logout = () => {
    localStorage.setItem("habitex_logged_out", "true");
    StorageService.clearUser();
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    StorageService.saveUser(updated);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
    defaultUsers: DEFAULT_USERS
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
