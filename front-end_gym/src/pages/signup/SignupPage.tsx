// src/pages/SignupPage.tsx
import React, { useState, FormEvent } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./SignupPage.css";

// Décrit la structure des données du formulaire
interface SignupForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  // Hook - État qui stocke les valeurs de chaque champ du formulaire
  const [form, setForm] = useState<SignupForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Hook - État pour afficher un message d'erreur côté front
  const [error, setError] = useState<string | null>(null);

  // Hook - Booléen pour savoir si la requête d'inscription a bien été envoyée
  const [loading, setLoading] = useState(false);

  // Met à jour l'état `form` à chaque modification d'un input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value, // nom de l'input correspond à une propriété de l'objet form
    });
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(null);

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
      await signup(form.email, form.password, form.first_name, form.last_name);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Container>
        <Card className="signup-card">
          <Card.Header>
            <h2>Créer un compte</h2>
            <p className="text-muted">Rejoignez notre communauté de sportifs</p>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      placeholder="Entrez votre prénom"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                      placeholder="Entrez votre nom"
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Entrez votre email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={12}
                  placeholder="Entrez votre mot de passe"
                />
                <Form.Text className="text-muted">
                  Le mot de passe doit contenir au moins 12 caractères
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirmer le mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={12}
                  placeholder="Confirmez votre mot de passe"
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? "Inscription en cours..." : "S'inscrire"}
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Déjà inscrit ?{" "}
                  <Link to="/login" className="text-primary">
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default SignupPage;
