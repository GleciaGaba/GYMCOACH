// src/contexts/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { login as loginAPI, signupCoach as signupAPI } from "../api/auth";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  token: string;
  role: "COACH" | "SPORTIF" | "ADMIN";
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<string>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  async function login(email: string, password: string): Promise<string> {
    try {
      // Login pour obtenir le token et les informations utilisateur
      const loginRes = await loginAPI({ email, password });
      const {
        token,
        role,
        email: userEmail,
        password_changed,
        firstName,
        lastName,
      } = loginRes.data;

      if (!role || !["COACH", "SPORTIF", "ADMIN"].includes(role)) {
        throw new Error("Rôle utilisateur invalide");
      }

      const user: User = {
        id: 0, // L'ID n'est pas nécessaire pour le moment
        email: userEmail,
        token: token,
        role: role,
        firstName: firstName,
        lastName: lastName,
      };

      console.log("Utilisateur connecté avec le rôle:", user.role);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      return JSON.stringify({ role, password_changed });
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error);
      // Nettoyer le token en cas d'erreur
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      throw error;
    }
  }

  async function signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    try {
      const res = await signupAPI({ firstName, lastName, email, password });
      console.log("Réponse inscription:", res.data);

      // Redirection vers la page de login après inscription réussie
      navigate("/login");
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  }

  function logout() {
    setUser(null);
    // Effacer toutes les informations du localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    // Rediriger vers la page de login
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
