/**
 * Page de confirmation de compte
 *
 * Cette page est utilisée pour confirmer le compte d'un coach après son inscription.
 * Elle est accessible via un lien envoyé par email contenant un token de confirmation.
 *
 * Fonctionnement :
 * 1. Récupère le token depuis l'URL
 * 2. Envoie le token au backend pour confirmer le compte
 * 3. Affiche un message de succès/erreur
 * 4. Redirige vers la page de connexion en cas de succès
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmCoachAccount } from "../api/auth";
import { Alert, Spinner } from "react-bootstrap";

function ConfirmAccountPage() {
  // Récupère le token depuis l'URL
  const { token } = useParams();
  const navigate = useNavigate();

  // États pour gérer le statut de la confirmation et les messages
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmAccount = async () => {
      // Vérifie si le token est présent
      if (!token) {
        setStatus("error");
        setMessage("Token manquant");
        return;
      }

      try {
        // Appelle l'API pour confirmer le compte
        await confirmCoachAccount(token);
        setStatus("success");
        setMessage("Compte confirmé avec succès !");

        // Redirection vers la page de login après 2 secondes
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error: any) {
        // Gestion des erreurs
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
              {/* Affichage pendant le chargement */}
              {status === "loading" && (
                <>
                  <Spinner animation="border" role="status" />
                  <p className="mt-3">Confirmation du compte en cours...</p>
                </>
              )}

              {/* Message de succès */}
              {status === "success" && (
                <Alert variant="success">
                  <Alert.Heading>Compte confirmé !</Alert.Heading>
                  <p>{message}</p>
                  <p>Redirection vers la page de connexion...</p>
                </Alert>
              )}

              {/* Message d'erreur */}
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
