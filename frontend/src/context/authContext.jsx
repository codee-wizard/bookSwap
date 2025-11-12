import React, { useContext, createContext } from "react";
import { authService } from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const token = response.data?.token || response.data?.data?.token;
    if (token) localStorage.setItem("token", token);
    return response.data;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const token = response.data?.token || response.data?.data?.token;
    if (token) localStorage.setItem("token", token);
    return response.data;
  };

  const logout = () => {
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
