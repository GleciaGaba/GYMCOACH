import React, { useState, FormEvent } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addSportif } from "../../api/sportif";
import "./AddSportifPage.css";

interface SportifForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AddSportifPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SportifForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (form.password.length < 12) {
      setError("Le mot de passe doit contenir au moins 12 caractères");
      return;
    }

    try {
      setLoading(true);
      await addSportif({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role: "SPORTIF",
        is_active: false,
        password_changed: false,
      });

      setSuccess(
        `Le compte a été créé avec succès. Un email de confirmation a été envoyé à ${form.email}.`
      );

      // Réinitialiser le formulaire après succès
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.error("Erreur lors de l'ajout du sportif:", err);
      if (err.response?.status === 403) {
        setError(
          "Vous n'avez pas les droits nécessaires pour ajouter un sportif. Veuillez vous connecter en tant que coach."
        );
      } else {
        setError(
          err.response?.data?.message || "Erreur lors de l'ajout du sportif"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-sportif-container">
      <Container>
        <Card className="add-sportif-card">
          <Card.Header>
            <h2>Ajouter un nouveau sportif</h2>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Alert variant="info" className="mb-4">
              <h5>Processus d'inscription :</h5>
              <ol>
                <li>
                  Remplissez le formulaire avec les informations du sportif
                </li>
                <li>Un email de confirmation sera envoyé au sportif</li>
                <li>
                  Le sportif devra confirmer son compte via le lien dans l'email
                </li>
                <li>
                  Une fois confirmé, le sportif pourra se connecter avec ses
                  identifiants
                </li>
              </ol>
            </Alert>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      placeholder="Entrez le prénom du sportif"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                      placeholder="Entrez le nom du sportif"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Entrez l'email du sportif"
                    />
                    <Form.Text className="text-muted">
                      Un email de confirmation sera envoyé à cette adresse
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mot de passe temporaire</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={12}
                      placeholder="Entrez le mot de passe temporaire"
                    />
                    <Form.Text className="text-muted">
                      Le mot de passe doit contenir au moins 12 caractères. Le
                      sportif devra changer ce mot de passe lors de sa première
                      connexion.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirmez le mot de passe"
                    />
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
                  {loading ? "Ajout en cours..." : "Ajouter le sportif"}
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

export default AddSportifPage;
