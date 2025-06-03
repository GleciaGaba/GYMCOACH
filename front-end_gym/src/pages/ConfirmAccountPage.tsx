import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmCoachAccount } from "../api/auth";
import { Alert, Spinner } from "react-bootstrap";

function ConfirmAccountPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token manquant");
        return;
      }

      try {
        await confirmCoachAccount(token);
        setStatus("success");
        setMessage("Compte confirmé avec succès !");
        // Redirection vers la page de login après 2 secondes
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Erreur lors de la confirmation du compte"
        );
      }
    };

    confirmAccount();
  }, [token, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              {status === "loading" && (
                <>
                  <Spinner animation="border" role="status" />
                  <p className="mt-3">Confirmation du compte en cours...</p>
                </>
              )}

              {status === "success" && (
                <Alert variant="success">
                  <Alert.Heading>Compte confirmé !</Alert.Heading>
                  <p>{message}</p>
                  <p>Redirection vers la page de connexion...</p>
                </Alert>
              )}

              {status === "error" && (
                <Alert variant="danger">
                  <Alert.Heading>Erreur</Alert.Heading>
                  <p>{message}</p>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAccountPage;
