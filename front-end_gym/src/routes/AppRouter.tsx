import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import SignupPage from "../pages/signup/SignupPage";
import LoginPage from "../pages/login/LoginPage";
import DashboardCoach from "../pages/dashboard/DashboardCoach";
import DashboardSportif from "../pages/dashboard/DashboardSportif";
//import DashboardAdmin from "../pages/dashboard/DashboardAdmin";
import AddSportifPage from "../pages/sportif/AddSportifPage";
import AddExercisePage from "../pages/exercise/AddExercisePage";
import { useAuth } from "../contexts/AuthContext";
import ResendConfirmation from "../components/resend_confirmation/ResendConfirmation";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={`/dashboard_${user.role.toLowerCase()}`} />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/dashboard_coach"
        element={
          user?.role === "COACH" ? <DashboardCoach /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/add-sportif"
        element={
          user?.role === "COACH" ? <AddSportifPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/add-exercise"
        element={
          user?.role === "COACH" ? (
            <AddExercisePage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/dashboard_sportif"
        element={
          user?.role === "SPORTIF" ? (
            <DashboardSportif />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      {/*<Route
        path="/dashboard_admin"
        element={
          user?.role === "ADMIN" ? <DashboardAdmin /> : <Navigate to="/login" />
        }
      />*/}
      <Route path="/resend-confirmation" element={<ResendConfirmation />} />
      <Route
        path="/*"
        element={
          user ? (
            <Navigate to={`/dashboard_${user.role.toLowerCase()}`} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}
