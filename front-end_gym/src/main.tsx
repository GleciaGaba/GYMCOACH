import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// On récupère l'élément HTML <div id="root"></div> présent dans public/index.html
// et on lui associe un "root" React via l'API createRoot de React 18.
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// root.render() monte l'arbre de composants React à partir de <App />
// <React.StrictMode> est un enveloppeur de développement qui active des vérifications
// et avertissements supplémentaires (dépréciations, effets de bord, etc.).
root.render(
  <React.StrictMode>
    {/* Composant racine de l'application : tout l'arbre React démarre ici */}
    <App />
  </React.StrictMode>
);