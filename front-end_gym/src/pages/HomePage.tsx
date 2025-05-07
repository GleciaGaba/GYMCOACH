// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => (
  <div className="relative w-full">
    {/* 1) Image de fond */}
    <img
      src="/images/hero.jpg"
      alt="Salle de sport"
      className="w-full h-auto object-contain"
    />

    {/* 2) Overlay sombre */}
    <div className="absolute inset-0 flex items-center justify-center" />

    {/* 3) Contenu centré */}
    <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 lg:px-20">
      {/* Titre avec fond semi-transparent */}
      <h1 className="bg-black bg-opacity-60 text-white text-4xl md:text-6xl font-bold p-4 rounded-md max-w-xl mb-6">
        Atteignez vos objectifs de fitness avec Gym Coach App
      </h1>
      {/* Sous-titre */}
      <p className="bg-black bg-opacity-60 text-white text-lg md:text-2xl p-3 rounded-md max-w-lg mb-8">
        Votre coaching, votre rythme, vos résultats.
      </p>
      {/* Bouton d’action */}
      <Link
        to="/signup"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
      >
        Get Started
      </Link>
    </div>
  </div>
);

export default HomePage;
