import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  return (
    <div style={{ backgroundColor: "#f0f0f0", padding: "2rem", fontSize: "1.5rem" }}>
      React is working!
    </div>
  );
}

export default App;
