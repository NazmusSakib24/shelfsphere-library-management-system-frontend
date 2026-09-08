import api from "./api";

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type RegisterResponse = {
  message: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    staffId: string | null;
    role: string;
  };
};

export const login = async (data: LoginData) => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    data
  );

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};