import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { exerciseApi, Exercise } from "../../api/exercise";
import "./ExerciseDetailsPage.css";

const ExerciseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        if (!id) {
          return;
        }
        const data = await exerciseApi.getExerciseById(parseInt(id));
        setExercise(data);
      } catch (err) {
        setError("Erreur lors du chargement de l'exercice");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/exercises/edit/${id}`);
    }
  };

  const handleDelete = async () => {
    if (!id || !exercise) return;

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'exercice "${exercise.name}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await exerciseApi.deleteExercise(parseInt(id));
      // Redirige vers la liste des exercices après suppression
      navigate("/exercises");
    } catch (err) {
      setError("Erreur lors de la suppression de l'exercice");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour nettoyer les valeurs null
  const cleanValue = (value: any) => value || "";

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de l'exercice...</p>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{error || "Exercice non trouvé"}</p>
        <button
          onClick={() => navigate("/exercises")}
          className="btn btn-primary"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="exercise-details-container">
      <button onClick={() => navigate("/exercises")} className="back-button">
        ← Retour
      </button>

      <div className="exercise-details">
        <div className="exercise-header">
          <div className="exercise-title-actions">
            <h1>{cleanValue(exercise.name)}</h1>
            <div className="exercise-actions">
              <button
                onClick={handleEdit}
                className="action-button edit"
                title="Modifier l'exercice"
              >
                <i className="fas fa-edit"></i>
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="action-button delete"
                title="Supprimer l'exercice"
                disabled={isDeleting}
              >
                <i className="fas fa-trash"></i>
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
          <div className="exercise-tags">
            <span className="tag-muscle">
              {cleanValue(exercise.muscleGroupLabel)}
            </span>
            <span className="tag-difficulty">
              {cleanValue(exercise.difficulty)}
            </span>
          </div>
        </div>

        {exercise.exerciseUrl && (
          <div className="exercise-media">
            <img
              src={exercise.exerciseUrl}
              alt={cleanValue(exercise.name)}
              className="exercise-image"
            />
          </div>
        )}

        <div className="exercise-info">
          <section className="info-section">
            <h2>Description</h2>
            <p>{cleanValue(exercise.description)}</p>
          </section>

          <section className="info-section">
            <h2>Sous-groupe musculaire</h2>
            <p>{cleanValue(exercise.muscleSubgroup) || "Non spécifié"}</p>
          </section>

          <section className="info-section">
            <h2>Équipement</h2>
            <p>{cleanValue(exercise.equipment) || "Aucun équipement requis"}</p>
          </section>

          <section className="info-section">
            <h2>Instructions</h2>
            <div className="instructions">
              {cleanValue(exercise.instructions)
                .split("\n")
                .map((instruction: string, index: number) => (
                  <p key={index} className="instruction-step">
                    {index + 1}. {instruction}
                  </p>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailsPage;
