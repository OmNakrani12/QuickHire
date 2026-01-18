import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Home from "./home.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import ContractorHome from "./contractor.jsx";
import WorkerHome from "./worker.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
        <Route path="/worker" element={<WorkerHome />} />
        <Route path="/contractor" element={<ContractorHome />} />

        {/* Optional: App wrapper */}
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
