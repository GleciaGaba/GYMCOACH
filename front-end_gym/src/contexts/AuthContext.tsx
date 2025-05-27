// src/contexts/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { login as loginAPI, signupCoach as signupAPI } from "../api/auth";

interface User {
  id: number;
  email: string;
  token: string;
  role: "COACH" | "SPORTIF" | "ADMIN";
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
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

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  async function login(email: string, password: string) {
    const res = await loginAPI({ email, password });
    const u: User = res.data;
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  }

  async function signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    // on passe un objet, pas 4 args séparés
    const res = await signupAPI({ firstName, lastName, email, password });
    const u: User = res.data;
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
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
