"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
  login as loginRequest,
  register as registerRequest,
  type LoginData,
  type RegisterData,
} from "../services/auth";

type User = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  staffId: string | null;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (data: LoginData) => {
    const response = await loginRequest(data);

    localStorage.setItem(
      "access_token",
      response.access_token
    );

    const currentUser = await getMe();

    setUser(currentUser);
    return currentUser;
  };

  const register = async (data: RegisterData) => {
    await registerRequest(data);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}