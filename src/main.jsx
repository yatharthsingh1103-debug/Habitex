import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import App from "./App";

// Modular Stylesheets
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/forms.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <UIProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UIProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
