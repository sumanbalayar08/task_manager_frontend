"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useMe } from "../api/auth/auth.query";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useMe();
  const [user, setUser] = useState<User | null>(null);  

  useEffect(() => {
    if (data?.success && data.data) {
      setUser(data.data.user);
    } else {
      setUser(null);
    }
  }, [data]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}