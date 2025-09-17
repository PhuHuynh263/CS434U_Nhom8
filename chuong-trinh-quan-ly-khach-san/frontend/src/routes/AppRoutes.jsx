import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default AppRoutes;
