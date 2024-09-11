import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
