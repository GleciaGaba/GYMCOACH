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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { workoutApi, CreateWorkoutDto } from "../../api/workout";
import { exerciseApi, Exercise } from "../../api/exercise";
import "./CreateWorkoutPage.css";

const CreateWorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [form, setForm] = useState<CreateWorkoutDto>({
    name: "",
    description: "",
    exerciseIds: [],
  });

  // Vérifier que l'utilisateur est un coach
  useEffect(() => {
    if (!user || user.role !== "COACH") {
      setError(
        "Vous devez être connecté en tant que coach pour accéder à cette page"
      );
      navigate("/login");
    }
  }, [user, navigate]);

  // Charger les exercices
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exerciseApi.getExercises();
        setExercises(data);
      } catch (err) {
        setError("Erreur lors du chargement des exercices");
      }
    };
    fetchExercises();
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

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.some((e) => e.id === exercise.id);
      if (isSelected) {
        return prev.filter((e) => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });

    setForm((prev) => {
      const exerciseIds = prev.exerciseIds;
      const isSelected = exerciseIds.includes(exercise.id);
      if (isSelected) {
        return {
          ...prev,
          exerciseIds: exerciseIds.filter((id) => id !== exercise.id),
        };
      } else {
        return {
          ...prev,
          exerciseIds: [...exerciseIds, exercise.id],
        };
      }
    });
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
    if (!form.description.trim()) {
      setError("La description est obligatoire");
      return;
    }
    if (form.exerciseIds.length === 0) {
      setError("Vous devez sélectionner au moins un exercice");
      return;
    }

    try {
      setLoading(true);
      await workoutApi.createWorkout(form);
      setSuccess("Le workout a été créé avec succès !");

      // Réinitialiser le formulaire après succès
      setForm({
        name: "",
        description: "",
        exerciseIds: [],
      });
      setSelectedExercises([]);

      // Rediriger vers le tableau de bord après 2 secondes
      setTimeout(() => {
        navigate("/dashboard_coach");
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de la création du workout:", err);
      setError(err.message || "Erreur lors de la création du workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-workout-container">
      <Container>
        <Card className="create-workout-card">
          <Card.Header>
            <h2>Créer un nouveau workout</h2>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom du workout</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Entrez le nom du workout"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      placeholder="Décrivez le workout"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sélectionnez les exercices</Form.Label>
                    <div className="exercises-grid">
                      {exercises.map((exercise) => (
                        <Card
                          key={exercise.id}
                          className={`exercise-card ${
                            selectedExercises.some((e) => e.id === exercise.id)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => toggleExercise(exercise)}
                        >
                          <Card.Body>
                            <Card.Title>{exercise.name}</Card.Title>
                            <Card.Text>
                              <small>
                                Groupe musculaire: {exercise.muscleGroup}
                              </small>
                              <br />
                              <small>Difficulté: {exercise.difficulty}</small>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Exercices sélectionnés</Form.Label>
                    <ListGroup>
                      {selectedExercises.map((exercise) => (
                        <ListGroup.Item
                          key={exercise.id}
                          className="d-flex justify-content-between align-items-center"
                        >
                          {exercise.name}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => toggleExercise(exercise)}
                          >
                            Retirer
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? "Création en cours..." : "Créer le workout"}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/dashboard_coach")}
                >
                  Annuler
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CreateWorkoutPage;
