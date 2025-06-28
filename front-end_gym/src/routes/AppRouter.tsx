import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import SignupPage from "../pages/signup/SignupPage";
import LoginPage from "../pages/login/LoginPage";
import DashboardCoach from "../pages/dashboard/DashboardCoach";
import DashboardSportif from "../pages/dashboard/DashboardSportif";
//import DashboardAdmin from "../pages/dashboard/DashboardAdmin";
import AddSportifPage from "../pages/sportif/AddSportifPage";
import AddExercisePage from "../pages/exercise/AddExercisePage";
import EditExercisePage from "../pages/exercise/EditExercisePage";
import { useAuth } from "../contexts/AuthContext";
import ResendConfirmation from "../components/resend_confirmation/ResendConfirmation";
import CreateWorkoutPage from "../pages/workout/CreateWorkoutPage";
import ExerciseDetailsPage from "../pages/exercise/ExerciseDetailsPage";
import ChatPage from "../pages/chat/ChatPage";

export default function AppRouter() {
  const { user, isLoading } = useAuth();

  console.log("DEBUG - AppRouter render - user:", user);
  console.log("DEBUG - AppRouter render - isLoading:", isLoading);
  console.log(
    "DEBUG - AppRouter render - current pathname:",
    window.location.pathname
  );

  // Afficher un loader pendant le chargement de l'authentification
  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement de l'application...</p>
          </div>
        </div>
      </div>
    );
  }

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
      <Route
        path="/create-workout"
        element={
          user?.role === "COACH" ? (
            <CreateWorkoutPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/chat"
        element={user ? <ChatPage /> : <Navigate to="/login" />}
      />
      {/*<Route
        path="/dashboard_admin"
        element={
          user?.role === "ADMIN" ? <DashboardAdmin /> : <Navigate to="/login" />
        }
      />*/}
      <Route path="/resend-confirmation" element={<ResendConfirmation />} />
      <Route path="/exercises" element={<AddExercisePage />} />
      <Route path="/exercises/:id" element={<ExerciseDetailsPage />} />
      <Route
        path="/exercises/edit/:id"
        element={
          user?.role === "COACH" ? (
            <EditExercisePage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/*"
        element={
          user ? (
            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <h1 className="display-1">404</h1>
                  <h2>Page non trouvée</h2>
                  <p className="lead">
                    La page que vous recherchez n'existe pas.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.history.back()}
                  >
                    Retour
                  </button>
                  <button
                    className="btn btn-outline-primary ms-2"
                    onClick={() =>
                      (window.location.href = `/dashboard_${user.role.toLowerCase()}`)
                    }
                  >
                    Aller au dashboard
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}
