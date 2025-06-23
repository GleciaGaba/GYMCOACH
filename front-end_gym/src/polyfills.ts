// src/polyfills.ts
// Polyfills pour la compatibilité avec sockjs-client

// Définir global si il n'existe pas
if (typeof global === "undefined") {
  (window as any).global = window;
}

// Définir process si il n'existe pas
if (typeof process === "undefined") {
  (window as any).process = { env: {} };
}

// Définir Buffer si il n'existe pas
if (typeof Buffer === "undefined") {
  (window as any).Buffer = {
    isBuffer: () => false,
  };
}
