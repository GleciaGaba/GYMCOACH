import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/signup/SignupPage";
import Dashboard from "../pages/Dashboard";
import { useAuth } from "../contexts/AuthContext";
import ResendConfirmation from "../components/resend_confirmation/ResendConfirmation";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/coach"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route path="/resend-confirmation" 
        element={<ResendConfirmation />} 
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
