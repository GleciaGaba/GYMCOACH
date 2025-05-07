// src/pages/SignupPage.tsx
import React, { useState, FormEvent } from 'react';

//
// Décrit la forme des données du formulaire d'inscription
//
interface SignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignupPage: React.FC = () => {
  //
  // État pour stocker les valeurs du formulaire
  // initialise chaque champ à une chaîne vide
  //
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  //
  // État pour afficher un message d'erreur, ou null s'il n'y en a pas
  //
  const [error, setError] = useState<string | null>(null);

  //
  // Gestionnaire mis sur chaque input : met à jour le champ correspondant dans l'état `form`
  //
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value // nom de l'input = propriété de l'objet form
    });
  };

  //
  // Gestionnaire du submit du formulaire
  // 1) Empêche le comportement par défaut (rechargement de la page)
  // 2) Vérifie que le mot de passe fait au moins 12 caractères
  // 3) En cas de succès, envoie (ici simulé) les données à l'API
  //
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation front : longueur minimale du mot de passe
    if (form.password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères');
      return;
    }

    try {
      // TODO : remplacer console.log par appel réel à votre API, ex :
      // await api.post('/api/auth/signup/coach', form);
      console.log('Submitting', form);
      alert('Inscription réussie !');
      setError(null); // réinitialise l'erreur si besoin
    } catch (err: any) {
      // Affiche l'erreur retournée par l'API ou un message générique
      setError(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    // Conteneur centré avec largeur max, marge, padding et ombre
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      {/* Titre de la page */}
      <h2 className="text-2xl font-bold mb-4 text-center">Inscription Coach</h2>

      {/* Affichage conditionnel d'un message d'erreur */}
      {error && (
        <p className="text-red-500 mb-2">
          {error}
        </p>
      )}

      {/* Formulaire d'inscription */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Prénom */}
        <div>
          <label htmlFor="firstName" className="block text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={form.firstName}
            onChange={handleChange}    // met à jour form.firstName
            required                    // champ obligatoire
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* Champ Nom */}
        <div>
          <label htmlFor="lastName" className="block text-gray-700">
            Nom
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={form.lastName}
            onChange={handleChange}    // met à jour form.lastName
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* Champ Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}    // met à jour form.email
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* Champ Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}    // met à jour form.password
            required
            minLength={12}             // validation HTML5 : >=12 chars
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
