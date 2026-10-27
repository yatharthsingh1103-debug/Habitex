import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ToastContainer from "../common/Toast";
import Modal from "../common/Modal";

export const MainLayout = () => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="site-main">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <Modal />
    </>
  );
};

export default MainLayout;
