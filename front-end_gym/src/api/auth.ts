interface UserResponse {
  id: number;
  email: string;
  token: string;
}

export async function loginAPI(
  email: string,
  password: string
): Promise<UserResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Erreur de connexion");
  return res.json();
}

export async function signupAPI(
  email: string,
  password: string
): Promise<UserResponse> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Erreur d’inscription");
  return res.json();
}
