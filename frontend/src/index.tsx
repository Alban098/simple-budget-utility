import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const oidcConfig = {
  authority: "%%authority%%",
  client_id: "%%client_id%%",
  redirect_uri: "%%redirect_url%%",
  scope: "openid,profile",
  userStore: new WebStorageStateStore({
    store: localStorage,
  }),
  automaticSilentRenew: true,
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
