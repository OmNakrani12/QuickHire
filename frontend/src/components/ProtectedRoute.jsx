// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const token = Cookies.get("auth_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}