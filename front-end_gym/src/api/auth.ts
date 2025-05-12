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
