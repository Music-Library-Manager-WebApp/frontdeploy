'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser, User } from "../../lib/api";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loginUser: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loginUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const loginUser = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
