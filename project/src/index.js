import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import reportWebVitals from "./reportWebVitals";

// this is the entry point of the application
ReactDOM.render(
  <React.StrictMode>
    {/* adding app component */}
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
