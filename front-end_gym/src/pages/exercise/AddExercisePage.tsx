// src/components/AddExercisePage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  exerciseApi,
  CreateExerciseDto,
  MuscleGroup,
  Exercise,
} from "../../api/exercise";
import "./AddExercisePage.css";

// Types pour les messages d'erreur
interface ErrorState {
  message: string;
  type: "error" | "warning" | "info";
  details?: string;
}

/**
 * Composant AddExercisePage
 * Permet aux coachs de créer et consulter leurs exercices.
 */
const AddExercisePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Formulaire n'inclut plus coachId : le backend le déduit du JWT
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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMuscleGroupFilter, setSelectedMuscleGroupFilter] =
    useState<number>(0);

  // Fonction utilitaire pour gérer les erreurs
  const handleError = (error: any, context: string) => {
    console.error(`Erreur ${context}:`, error);

    let errorMessage = "Une erreur est survenue";
    let errorType: "error" | "warning" | "info" = "error";
    let errorDetails = "";

    if (error.response) {
      // Erreur avec réponse du serveur
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
          errorMessage = "Ressource non trouvée";
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
      // Erreur de réseau
      errorMessage = "Erreur de connexion";
      errorType = "error";
      errorDetails = "Veuillez vérifier votre connexion internet";
    } else {
      // Autre type d'erreur
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
      setLoading(true);
      setError(null);
      try {
        const [groups, list] = await Promise.all([
          exerciseApi.getMuscleGroups(),
          exerciseApi.getExercises(),
        ]);
        setMuscleGroups(groups);
        setExercises(list);
      } catch (err) {
        handleError(err, "de chargement");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  // Soumission : crée l'exercice et l'ajoute à la liste
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError({
        message: "Session expirée",
        type: "warning",
        details: "Veuillez vous reconnecter",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await exerciseApi.createExercise(formData);
      setExercises((prev) => [created, ...prev]);

      // Réinitialise le formulaire
      setFormData({
        name: "",
        description: "",
        exerciseUrl: "",
        equipment: "",
        instructions: "",
        difficulty: "BEGINNER",
        muscleGroupId: 0,
        muscleSubgroup: "",
      });

      setIsFormVisible(false);

      // Affiche un message de succès
      setError({
        message: "Exercice créé avec succès",
        type: "info",
        details: "L'exercice a été ajouté à votre liste",
      });
    } catch (err) {
      handleError(err, "de création");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExerciseClick = (exerciseId: number) => {
    navigate(`/exercises/${exerciseId}`);
  };

  const handleDelete = async (exerciseId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la navigation vers les détails
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
      try {
        await exerciseApi.deleteExercise(exerciseId);
        setExercises(exercises.filter((ex) => ex.id !== exerciseId));
      } catch (err) {
        setError({
          message: "Erreur lors de la suppression de l'exercice",
          type: "error",
        });
        console.error(err);
      }
    }
  };

  const handleEdit = (exerciseId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la navigation vers les détails
    navigate(`/exercises/edit/${exerciseId}`);
  };

  // Fonction pour filtrer les exercices par groupe musculaire
  const filteredExercises = exercises.filter((exercise) => {
    if (selectedMuscleGroupFilter === 0) {
      return true; // Afficher tous les exercices si aucun filtre n'est sélectionné
    }
    return exercise.muscleGroupId === selectedMuscleGroupFilter;
  });

  // Composant pour afficher les messages
  const MessageDisplay: React.FC<{ error: ErrorState }> = ({ error }) => (
    <div className={`message ${error.type}`}>
      <div className="message-header">{error.message}</div>
      {error.details && <div className="message-details">{error.details}</div>}
    </div>
  );

  return (
    <div className="container">
      <header className="page-header">
        <h1>Gestion des exercices</h1>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="toggle-form-btn"
          aria-expanded={isFormVisible}
        >
          {isFormVisible ? "Masquer le formulaire" : "Ajouter un exercice"}
        </button>
      </header>

      {error && <MessageDisplay error={error} />}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      ) : (
        <>
          {isFormVisible && (
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
                  {isSubmitting ? "Création en cours..." : "Créer l'exercice"}
                </button>
              </div>
            </form>
          )}

          <div className="exercises-filter">
            <div className="filter-container">
              <label htmlFor="muscleGroupFilter">
                Filtrer par groupe musculaire :
              </label>
              <select
                id="muscleGroupFilter"
                value={selectedMuscleGroupFilter}
                onChange={(e) =>
                  setSelectedMuscleGroupFilter(Number(e.target.value))
                }
                className="filter-select"
              >
                <option value={0}>Tous les groupes musculaires</option>
                {muscleGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.label}
                  </option>
                ))}
              </select>
              {selectedMuscleGroupFilter !== 0 && (
                <button
                  onClick={() => setSelectedMuscleGroupFilter(0)}
                  className="clear-filter-btn"
                  title="Effacer le filtre"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <div className="filter-info">
              <span className="exercise-count">
                {filteredExercises.length} exercice
                {filteredExercises.length !== 1 ? "s" : ""} trouvé
                {filteredExercises.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="exercises-grid">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="exercise-card"
                onClick={() => handleExerciseClick(ex.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleExerciseClick(ex.id);
                  }
                }}
              >
                {ex.exerciseUrl && (
                  <img
                    src={ex.exerciseUrl}
                    alt={ex.name}
                    className="exercise-image"
                  />
                )}
                <div className="exercise-content">
                  <div className="exercise-header">
                    <h3>{ex.name}</h3>
                    <div className="exercise-actions">
                      <button
                        onClick={(e) => handleEdit(ex.id, e)}
                        className="action-button edit"
                        title="Modifier l'exercice"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={(e) => handleDelete(ex.id, e)}
                        className="action-button delete"
                        title="Supprimer l'exercice"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p className="muscle-subgroup">
                    {ex.muscleSubgroup || "Sous-groupe non spécifié"}
                  </p>
                  <div className="exercise-tags">
                    <span className="tag-muscle">{ex.muscleGroupLabel}</span>
                    <span className="tag-difficulty">{ex.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AddExercisePage;
