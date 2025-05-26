// src/api/auth.ts
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // ou ton URL prod
});

// Intercepteur pour injecter le token s’il existe
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponses Axios pour gérer les erreurs 
// d'authentification et les tokens expirés
API.interceptors.response.use(
  
  // Si la réponse est OK, on la renvoie telle quelle
  response => response,
  
  // En cas d'erreur, on examine le status et le message pour détecter 
  // un token expiré ou un accès non autorisé
  error => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';

    // Si on reçoit un 401 ou un message d'expiration
    if (status === 401 || message.toLowerCase().includes('expired')) {
      localStorage.removeItem('token');
      // Optionnel : forcer la redirection vers la page de login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const signupCoach = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => API.post('/api/auth/signup/coach', data);
export const signupSportif = (data: { email: string; password: string }, coachEmail: string) =>
  API.post('/api/auth/signup/sportif', data, {
    headers: { 'X-Coach-Email': coachEmail } // si tu veux passer coachEmail en header
  });
export const login = (data: { email: string; password: string }) =>
  API.post('/api/auth/login', data);

export default API;
