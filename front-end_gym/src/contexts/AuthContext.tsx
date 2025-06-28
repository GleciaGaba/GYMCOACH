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

// Fonction pour décoder le token JWT
function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (stored && token) {
      const user = JSON.parse(stored);
      // Décoder le token pour obtenir l'ID de l'utilisateur
      const decodedToken = decodeJwt(token);
      if (decodedToken && decodedToken.sub) {
        user.id = decodedToken.sub;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
    setIsLoading(false);
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

      // Décoder le token pour obtenir l'ID de l'utilisateur
      const decodedToken = decodeJwt(token);
      console.log("Token décodé:", decodedToken);
      if (!decodedToken || !decodedToken.sub) {
        throw new Error("Token invalide");
      }

      const user: User = {
        id: decodedToken.sub, // Utiliser l'ID du token
        email: userEmail,
        token: token,
        role: role,
        firstName: firstName,
        lastName: lastName,
      };

      console.log("Utilisateur connecté:", user);
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
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
