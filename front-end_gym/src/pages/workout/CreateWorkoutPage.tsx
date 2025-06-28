import React, { useState, useEffect, FormEvent } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
  ListGroup,
  Badge,
  Modal,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  workoutApi,
  CreateWorkoutDto,
  Workout,
  WorkoutExercise,
} from "../../api/workout";
import { exerciseApi, Exercise } from "../../api/exercise";
import "./CreateWorkoutPage.css";

const CreateWorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  const [exerciseFilters, setExerciseFilters] = useState<{
    [key: number]: string;
  }>({});

  const [form, setForm] = useState<CreateWorkoutDto>({
    name: "",
    groups: "",
    workoutDescription: "",
    exercises: [],
  });

  // Obtenir les groupes musculaires uniques
  const muscleGroups = React.useMemo(() => {
    const groups = exercises.map((ex) => ex.muscleGroupLabel);
    return [...new Set(groups)].sort();
  }, [exercises]);

  // Fonction pour obtenir les exercices filtrés pour un exercice spécifique
  const getFilteredExercisesForIndex = (index: number) => {
    const filter = exerciseFilters[index] || "";
    if (!filter) return exercises;
    return exercises.filter((ex) => ex.muscleGroupLabel === filter);
  };

  // Vérifier que l'utilisateur est un coach
  useEffect(() => {
    if (!user || user.role !== "COACH") {
      setError(
        "Vous devez être connecté en tant que coach pour accéder à cette page"
      );
      navigate("/login");
    }
  }, [user, navigate]);

  // Charger les exercices et workouts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [exercisesData, workoutsData] = await Promise.all([
          exerciseApi.getExercises(),
          workoutApi.getWorkouts(),
        ]);
        setExercises(exercisesData);
        setWorkouts(workoutsData);
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addExercise = () => {
    const newExercise: WorkoutExercise = {
      exerciseId: 0,
      repetitions: 0,
      series: 0,
      pause: 0,
    };
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const removeExercise = (index: number) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (
    index: number,
    field: keyof WorkoutExercise,
    value: number
  ) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!form.name.trim()) {
      setError("Le nom du workout est obligatoire");
      return;
    }
    if (!form.groups.trim()) {
      setError("Les groupes musculaires sont obligatoires");
      return;
    }
    if (!form.workoutDescription.trim()) {
      setError("La description est obligatoire");
      return;
    }
    if (form.exercises.length === 0) {
      setError("Vous devez ajouter au moins un exercice");
      return;
    }

    // Validation des exercices
    for (let i = 0; i < form.exercises.length; i++) {
      const exercise = form.exercises[i];
      if (exercise.exerciseId === 0) {
        setError(`Veuillez sélectionner un exercice pour l'exercice ${i + 1}`);
        return;
      }
      if (exercise.repetitions <= 0) {
        setError(
          `Le nombre de répétitions doit être supérieur à 0 pour l'exercice ${
            i + 1
          }`
        );
        return;
      }
      if (exercise.series <= 0) {
        setError(
          `Le nombre de séries doit être supérieur à 0 pour l'exercice ${i + 1}`
        );
        return;
      }
      if (exercise.pause < 0) {
        setError(
          `Le temps de pause ne peut pas être négatif pour l'exercice ${i + 1}`
        );
        return;
      }
    }

    try {
      setLoading(true);
      if (editingWorkout) {
        await workoutApi.updateWorkout(editingWorkout.id, form);
        setSuccess("Le workout a été modifié avec succès !");
      } else {
        await workoutApi.createWorkout(form);
        setSuccess("Le workout a été créé avec succès !");
      }

      // Recharger les workouts
      const updatedWorkouts = await workoutApi.getWorkouts();
      setWorkouts(updatedWorkouts);

      // Réinitialiser le formulaire
      resetForm();
      setShowForm(false);
      setEditingWorkout(null);

      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde du workout:", err);
      setError(err.message || "Erreur lors de la sauvegarde du workout");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      groups: "",
      workoutDescription: "",
      exercises: [],
    });
    setExerciseFilters({});
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setForm({
      name: workout.name,
      groups: workout.groups,
      workoutDescription: workout.workoutDescription,
      exercises: workout.exercises,
    });
    setExerciseFilters({});
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!workoutToDelete) return;

    try {
      setLoading(true);
      await workoutApi.deleteWorkout(workoutToDelete.id);
      setWorkouts(workouts.filter((w) => w.id !== workoutToDelete.id));
      setSuccess("Le workout a été supprimé avec succès !");
      setShowDeleteModal(false);
      setWorkoutToDelete(null);

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError("Erreur lors de la suppression du workout");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (workout: Workout) => {
    setWorkoutToDelete(workout);
    setShowDeleteModal(true);
  };

  const getExerciseName = (exerciseId: number) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    return exercise ? exercise.name : "Exercice inconnu";
  };

  if (loading && workouts.length === 0) {
    return (
      <div className="create-workout-container">
        <Container>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des workouts...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="create-workout-container">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestion des Workouts</h2>
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setEditingWorkout(null);
              setShowForm(true);
            }}
          >
            Créer un nouveau workout
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Liste des workouts */}
        {!showForm && (
          <div className="workouts-list">
            {workouts.length === 0 ? (
              <Card>
                <Card.Body className="text-center">
                  <p>Aucun workout créé pour le moment.</p>
                  <Button variant="primary" onClick={() => setShowForm(true)}>
                    Créer votre premier workout
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Row>
                {workouts.map((workout) => (
                  <Col key={workout.id} md={6} lg={4} className="mb-3">
                    <Card className="workout-card">
                      <Card.Body>
                        <Card.Title>{workout.name}</Card.Title>
                        <Card.Text>
                          <strong>Groupes musculaires:</strong> {workout.groups}
                        </Card.Text>
                        <Card.Text>
                          <strong>Description:</strong>{" "}
                          {workout.workoutDescription}
                        </Card.Text>
                        <div className="mb-3">
                          <strong>
                            Exercices ({workout.exercises.length}):
                          </strong>
                          <ul className="list-unstyled mt-2">
                            {workout.exercises
                              .slice(0, 3)
                              .map((exercise, index) => (
                                <li key={index}>
                                  • {getExerciseName(exercise.exerciseId)} -{" "}
                                  {exercise.series} séries x{" "}
                                  {exercise.repetitions} reps
                                </li>
                              ))}
                            {workout.exercises.length > 3 && (
                              <li>
                                ... et {workout.exercises.length - 3} autres
                                exercices
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(workout)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDelete(workout)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}

        {/* Formulaire de création/modification */}
        {showForm && (
          <Card className="workout-form-card">
            <Card.Header>
              <h3>
                {editingWorkout
                  ? "Modifier le workout"
                  : "Créer un nouveau workout"}
              </h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom du workout *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Full Body, Upper Body, etc."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Groupes musculaires *</Form.Label>
                      <Form.Control
                        type="text"
                        name="groups"
                        value={form.groups}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Jambes, Dos, Poitrine"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="workoutDescription"
                    value={form.workoutDescription}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez le workout, les objectifs, etc."
                  />
                </Form.Group>

                <div className="exercises-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Exercices</h5>
                    <Button
                      type="button"
                      variant="outline-primary"
                      size="sm"
                      onClick={addExercise}
                    >
                      + Ajouter un exercice
                    </Button>
                  </div>

                  {form.exercises.map((exercise, index) => (
                    <Card key={index} className="mb-3 exercise-form-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h6>Exercice {index + 1}</h6>
                          <Button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeExercise(index)}
                          >
                            Supprimer
                          </Button>
                        </div>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Exercice *</Form.Label>

                              {/* Filtre par groupe musculaire pour cet exercice */}
                              <div className="mb-2 exercise-filter">
                                <div className="d-flex gap-2 align-items-center">
                                  <Form.Select
                                    size="sm"
                                    value={exerciseFilters[index] || ""}
                                    onChange={(e) => {
                                      setExerciseFilters((prev) => ({
                                        ...prev,
                                        [index]: e.target.value,
                                      }));
                                      // Réinitialiser la sélection d'exercice si le filtre change
                                      if (exercise.exerciseId !== 0) {
                                        updateExercise(index, "exerciseId", 0);
                                      }
                                    }}
                                    style={{ maxWidth: "200px" }}
                                  >
                                    <option value="">Tous les groupes</option>
                                    {muscleGroups.map((group) => (
                                      <option key={group} value={group}>
                                        {group}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  {(exerciseFilters[index] || "") && (
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => {
                                        setExerciseFilters((prev) => ({
                                          ...prev,
                                          [index]: "",
                                        }));
                                        if (exercise.exerciseId !== 0) {
                                          updateExercise(
                                            index,
                                            "exerciseId",
                                            0
                                          );
                                        }
                                      }}
                                      title="Réinitialiser le filtre"
                                    >
                                      ✕
                                    </Button>
                                  )}
                                </div>
                                <small className="text-muted">
                                  {getFilteredExercisesForIndex(index).length}{" "}
                                  exercice(s) disponible(s)
                                  {(exerciseFilters[index] || "") &&
                                    ` pour ${exerciseFilters[index]}`}
                                </small>
                              </div>

                              <Form.Select
                                value={exercise.exerciseId}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "exerciseId",
                                    Number(e.target.value)
                                  )
                                }
                                required
                              >
                                <option value={0}>
                                  Sélectionner un exercice
                                </option>
                                {getFilteredExercisesForIndex(index).map(
                                  (ex) => (
                                    <option key={ex.id} value={ex.id}>
                                      {ex.name} - {ex.muscleGroupLabel}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={2}>
                            <Form.Group className="mb-3">
                              <Form.Label>Répétitions *</Form.Label>
                              <Form.Control
                                type="number"
                                min="1"
                                value={exercise.repetitions}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "repetitions",
                                    Number(e.target.value)
                                  )
                                }
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={2}>
                            <Form.Group className="mb-3">
                              <Form.Label>Séries *</Form.Label>
                              <Form.Control
                                type="number"
                                min="1"
                                value={exercise.series}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "series",
                                    Number(e.target.value)
                                  )
                                }
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={2}>
                            <Form.Group className="mb-3">
                              <Form.Label>Pause (sec)</Form.Label>
                              <Form.Control
                                type="number"
                                min="0"
                                value={exercise.pause}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "pause",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}

                  {form.exercises.length === 0 && (
                    <Alert variant="info">
                      Cliquez sur "Ajouter un exercice" pour commencer à
                      construire votre workout.
                    </Alert>
                  )}
                </div>

                <div className="form-actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingWorkout(null);
                      resetForm();
                    }}
                    className="me-2"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading
                      ? "Sauvegarde..."
                      : editingWorkout
                      ? "Modifier le workout"
                      : "Créer le workout"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {/* Modal de confirmation de suppression */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer le workout "
            {workoutToDelete?.name}" ? Cette action est irréversible.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? "Suppression..." : "Supprimer"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default CreateWorkoutPage;
