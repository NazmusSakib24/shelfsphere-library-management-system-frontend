import api from "./api";

export type User = {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  staffId?: string | null;
  role: "ADMIN" | "LIBRARIAN" | "MEMBER";
};

export type CreateUserData = {
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "LIBRARIAN" | "MEMBER";
  phone?: string;
  staffId?: string;
};

export type UpdateUserData = {
  fullName?: string;
  email?: string;
  phone?: string;
  staffId?: string;
  role?: "ADMIN" | "LIBRARIAN" | "MEMBER";
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

export const createUser = async (data: CreateUserData,): Promise<User> => {
  const response = await api.post<User>("/users", data);
  return response.data;
};

export const updateUser = async (id: number,data: UpdateUserData,): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};