// src/pages/SignupPage.tsx
import React, { useState, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { signupCoach } from '../../api/auth';
import './SignupPage.css';

// Décrit la structure des données du formulaire
interface SignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignupPage: React.FC = () => {
  // Hook - État qui stocke les valeurs de chaque champ du formulaire
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  // Hook - État pour afficher un message d'erreur côté front
  const [error, setError] = useState<string | null>(null);

  // Hook - Booléen pour savoir si la requête d'inscription a bien été envoyée
  const [sent, setSent] = useState(false);

  // Met à jour l'état `form` à chaque modification d'un input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value  // nom de l'input correspond à une propriété de l'objet form
    });
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();  // Empêche le rechargement de la page

    // Validation front : le mot de passe doit faire au moins 12 caractères
    if (form.password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères');
      return;
    }

    try {
      // Appel à l'API pour créer le coach
      await signupCoach(form);

      // Réinitialise l'erreur et passe l'état `sent` à true
      setError(null);
      setSent(true);
    } catch (err: any) {
      // Si l'API renvoie une erreur, on l'affiche
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="signup-hero">
      {/* Overlay semi-transparent derrière la carte */}
      <div className="overlay" />

      <div className="form-container">
        {/* Avant envoi : on affiche le formulaire */}
        {!sent ? (
          <div className="signup-card">
            <h2>Inscription Coach</h2>

            {/* Affiche le message d'erreur s'il y en a un */}
            {error && <p className="text-danger">{error}</p>}

            {/* Formulaire d'inscription */}
            <Form onSubmit={handleSubmit}>
              {/* Champ Prénom */}
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Champ Nom */}
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Champ Email */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Champ Mot de passe */}
              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={12} // HTML5 : validation minimale
                />
                <Form.Text className="text-muted">
                  Au moins 12 caractères.
                </Form.Text>
              </Form.Group>

              {/* Bouton de soumission */}
              <Button variant="primary" type="submit" className="btn-submit">
                S'inscrire
              </Button>
            </Form>

            {/* Lien vers la page de connexion */}
            <p className="mt-3">
              Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
            </p>
          </div>
        ) : (
          /* Après envoi : on affiche le message de confirmation */
          <div className="signup-card text-center">
            <h3 className="text-success">Inscription réussie !</h3>
            <p>
              Un email de confirmation vient de vous être envoyé.<br/>
              Vérifiez votre boîte de réception pour activer votre compte.
            </p>
            <Link to="/login">
              <Button variant="outline-primary">Aller à la connexion</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
