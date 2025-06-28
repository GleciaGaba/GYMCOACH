import API from "./auth";

export interface SportifData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  password_changed: boolean;
  verification_token?: string;
}

// Le coach crée un compte sportif avec un mot de passe temporaire
export const addSportif = async (data: SportifData) => {
  // Restructuration des données pour correspondre à l'API
  const requestData = {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    password: data.password,
    temporaryPassword: data.password, // Le mot de passe temporaire est le même que le mot de passe initial
  };

  return API.post("/api/users/register-sportif", requestData);
};

// Le sportif confirme son compte avec le token reçu par email
export const confirmSportifAccount = (token: string) =>
  API.post("/api/users/confirm-account", { token });

// Le sportif change son mot de passe temporaire
export const changeTemporaryPassword = (token: string, newPassword: string) =>
  API.post("/api/users/change-temporary-password", { token, newPassword });

export const getSportifs = async () => {
  const response = await API.get("/api/coaches/my-athletes", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // Adapter le mapping pour le chat
  return (response.data || []).map((athlete: any) => ({
    id: athlete.id,
    firstName: athlete.firstName,
    lastName: athlete.lastName,
    email: athlete.email,
    is_active: athlete.active === true, // mapping correct pour le chat
  }));
};

export const getSportif = (id: number) =>
  API.get(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const updateSportif = (id: number, data: Partial<SportifData>) =>
  API.put(`/api/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const deleteSportif = (id: number) =>
  API.delete(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const changePassword = (oldPassword: string, newPassword: string) =>
  API.post(
    "/api/users/change-password",
    { oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

// Récupérer le coach du sportif connecté
export const getMyCoach = async () => {
  const response = await API.get("/api/coaches/my-coaches", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // Retourne le premier coach (ou le coach principal)
  return (response.data || [])[0] || null;
};
