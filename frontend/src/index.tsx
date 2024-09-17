import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: import.meta.env.VITE_SOME_KEY,
  client_id: import.meta.env.VITE_CLIENT_ID,
  client_secret: import.meta.env.VITE_CLIENT_SECRET,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  scope: import.meta.env.VITE_SCOPE,
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container,
);
root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
