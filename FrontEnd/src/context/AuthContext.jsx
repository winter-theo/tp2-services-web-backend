import { createContext, useContext, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const initialUser = safeJsonParse(localStorage.getItem("auth_user"));
const initialToken = localStorage.getItem("auth_token");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });

    setUser(response.user);
    setToken(response.token);
    localStorage.setItem("auth_user", JSON.stringify(response.user));
    localStorage.setItem("auth_token", response.token);

    return response;
  };

  const register = async (payload) => {
    return authApi.register(payload);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user?.id && !!token,
      login,
      register,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
