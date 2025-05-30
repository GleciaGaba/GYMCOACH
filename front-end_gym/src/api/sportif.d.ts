declare module "sportif" {
  interface SportifData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    is_active: boolean;
    verification_token?: string;
    password_changed: boolean;
    temporaryPassword?: string;
  }

  export const addSportif: (data: SportifData) => Promise<any>;
  export const confirmSportifAccount: (token: string) => Promise<any>;
  export const changeTemporaryPassword: (
    token: string,
    newPassword: string
  ) => Promise<any>;
  export const getSportifs: () => Promise<any>;
  export const getSportif: (id: number) => Promise<any>;
  export const updateSportif: (
    id: number,
    data: Partial<SportifData>
  ) => Promise<any>;
  export const deleteSportif: (id: number) => Promise<any>;
}
