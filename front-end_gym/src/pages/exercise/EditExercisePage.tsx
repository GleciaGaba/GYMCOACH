import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  exerciseApi,
  CreateExerciseDto,
  MuscleGroup,
  Exercise,
} from "../../api/exercise";
import "./AddExercisePage.css"; // Réutilise le CSS de AddExercisePage

interface ErrorState {
  message: string;
  type: "error" | "warning" | "info";
  details?: string;
}

const EditExercisePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateExerciseDto>({
    name: "",
    description: "",
    exerciseUrl: "",
    equipment: "",
    instructions: "",
    difficulty: "BEGINNER",
    muscleGroupId: 0,
    muscleSubgroup: "",
  });

  const [error, setError] = useState<ErrorState | null>(null);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction utilitaire pour gérer les erreurs
  const handleError = (error: any, context: string) => {
    console.error(`Erreur ${context}:`, error);

    let errorMessage = "Une erreur est survenue";
    let errorType: "error" | "warning" | "info" = "error";
    let errorDetails = "";

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          errorMessage = "Données invalides";
          errorType = "warning";
          errorDetails =
            data.message || "Veuillez vérifier les informations saisies";
          break;
        case 401:
          errorMessage = "Session expirée";
          errorType = "warning";
          errorDetails = "Veuillez vous reconnecter";
          break;
        case 403:
          errorMessage = "Accès refusé";
          errorType = "error";
          errorDetails = "Vous n'avez pas les permissions nécessaires";
          break;
        case 404:
          errorMessage = "Exercice non trouvé";
          errorType = "warning";
          break;
        case 500:
          errorMessage = "Erreur serveur";
          errorType = "error";
          errorDetails =
            "Le serveur rencontre des difficultés. Veuillez réessayer plus tard";
          break;
        default:
          errorMessage = data.message || "Une erreur est survenue";
      }
    } else if (error.request) {
      errorMessage = "Erreur de connexion";
      errorType = "error";
      errorDetails = "Veuillez vérifier votre connexion internet";
    } else {
      errorMessage = error.message || "Une erreur inattendue est survenue";
    }

    setError({
      message: errorMessage,
      type: errorType,
      details: errorDetails,
    });
  };

  // Charge les données initiales
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError({
          message: "ID d'exercice manquant",
          type: "error",
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [groups, exercise] = await Promise.all([
          exerciseApi.getMuscleGroups(),
          exerciseApi.getExerciseById(parseInt(id)),
        ]);
        setMuscleGroups(groups);

        // Fonction pour nettoyer les valeurs null
        const cleanValue = (value: any) => value || "";

        // Pré-remplit le formulaire avec les données existantes
        setFormData({
          name: cleanValue(exercise.name),
          description: cleanValue(exercise.description),
          exerciseUrl: cleanValue(exercise.exerciseUrl),
          equipment: cleanValue(exercise.equipment),
          instructions: cleanValue(exercise.instructions),
          difficulty: exercise.difficulty || "BEGINNER",
          muscleGroupId: exercise.muscleGroupId || 0,
          muscleSubgroup: cleanValue(exercise.muscleSubgroup),
        });
      } catch (err) {
        handleError(err, "de chargement");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Met à jour formData pour tous les champs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "muscleGroupId" ? Number(value) : value,
    }));
    // Efface l'erreur quand l'utilisateur modifie le formulaire
    setError(null);
  };

  // Soumission : met à jour l'exercice
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) {
      setError({
        message: "Session expirée ou ID manquant",
        type: "warning",
        details: "Veuillez vous reconnecter",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await exerciseApi.updateExercise(parseInt(id), formData);

      // Affiche un message de succès
      setError({
        message: "Exercice mis à jour avec succès",
        type: "info",
        details: "Les modifications ont été enregistrées",
      });

      // Redirige vers les détails après un délai
      setTimeout(() => {
        navigate(`/exercises/${id}`);
      }, 2000);
    } catch (err) {
      handleError(err, "de mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Composant pour afficher les messages
  const MessageDisplay: React.FC<{ error: ErrorState }> = ({ error }) => (
    <div className={`message ${error.type}`}>
      <div className="message-header">{error.message}</div>
      {error.details && <div className="message-details">{error.details}</div>}
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de l'exercice...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1>Modifier l'exercice</h1>
        <button
          onClick={() => navigate(`/exercises/${id}`)}
          className="btn btn-secondary"
        >
          Annuler
        </button>
      </header>

      {error && <MessageDisplay error={error} />}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="muscleGroupId">Groupe musculaire</label>
          <select
            id="muscleGroupId"
            name="muscleGroupId"
            value={formData.muscleGroupId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value={0}>Sélectionner…</option>
            {muscleGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="muscleSubgroup">Sous-groupe</label>
          <input
            id="muscleSubgroup"
            name="muscleSubgroup"
            type="text"
            value={formData.muscleSubgroup}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulté</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value="BEGINNER">Débutant</option>
            <option value="INTERMEDIATE">Intermédiaire</option>
            <option value="ADVANCED">Avancé</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="equipment">Équipement</label>
          <input
            id="equipment"
            name="equipment"
            type="text"
            value={formData.equipment}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="exerciseUrl">URL Image/Vidéo</label>
          <input
            id="exerciseUrl"
            name="exerciseUrl"
            type="url"
            value={formData.exerciseUrl}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Mise à jour en cours..."
              : "Mettre à jour l'exercice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExercisePage;
