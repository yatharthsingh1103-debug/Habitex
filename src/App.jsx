import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Enquiry from "./pages/Enquiry";
import AddProperty from "./pages/AddProperty";
import MyListings from "./pages/MyListings";
import SavedProperties from "./pages/SavedProperties";
import Dashboard from "./pages/Dashboard";
import Performance from "./pages/Performance";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="enquiry" element={<Enquiry />} />
        <Route path="add-property" element={<AddProperty />} />
        <Route path="saved-properties" element={<SavedProperties />} />
        <Route path="performance" element={<Performance />} />

        {/* Protected Member Routes */}
        <Route
          path="my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
