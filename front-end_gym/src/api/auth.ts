// src/api/auth.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Intercepteur pour injecter le token s'il existe
API.interceptors.request.use((config) => {
  // Ne pas ajouter le token pour les routes d'inscription et de login
  if (
    config.url?.includes("/api/auth/signup") ||
    config.url?.includes("/api/auth/login")
  ) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token ajouté aux headers:", {
      url: config.url,
      token: token.substring(0, 10) + "...",
      headers: config.headers,
    });
  } else {
    console.log("Pas de token trouvé pour la requête:", config.url);
  }
  return config;
});

// Intercepteur de réponses Axios pour gérer les erreurs
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "";
    console.log("Erreur API:", {
      status,
      message,
      url: error.config?.url,
    });

    if (status === 401 || message.toLowerCase().includes("expired")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Inscription d'un coach
export const signupCoach = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  console.log("Inscription coach:", { ...data, password: "***" });
  return API.post("/api/auth/signup/coach", {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: "COACH",
  });
};

// Confirmation du compte coach
export const confirmCoachAccount = (token: string) => {
  return API.post("/api/auth/confirm-account", { token });
};

// Connexion
export const login = (data: { email: string; password: string }) => {
  return API.post("/api/auth/login", data);
};

export default API;
