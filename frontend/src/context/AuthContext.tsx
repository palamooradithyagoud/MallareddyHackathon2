import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "./ToastContext";

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  googleLogin: (googleToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("hiremate-token");
      const savedUserStr = localStorage.getItem("hiremate-user");

      if (savedToken && savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
          // Perform a quick verification check (e.g. check api/health or profile)
          // to ensure token is valid.
          await api.get("/health"); 
        } catch (error) {
          // Token might be invalid/expired, let axios interceptor clean up or handle manually
          localStorage.removeItem("hiremate-token");
          localStorage.removeItem("hiremate-user");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { access_token, user: userData } = res.data;
      
      localStorage.setItem("hiremate-token", access_token);
      localStorage.setItem("hiremate-user", JSON.stringify(userData));
      setUser(userData);
      showToast("Successfully logged in!", "success");
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Failed to log in. Please check your credentials.";
      showToast(msg, "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", { email, password });
      const { access_token, user: userData } = res.data;
      
      localStorage.setItem("hiremate-token", access_token);
      localStorage.setItem("hiremate-user", JSON.stringify(userData));
      setUser(userData);
      showToast("Account created successfully!", "success");
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Registration failed. Try a different email.";
      showToast(msg, "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (googleToken: string) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/google-login", { token: googleToken });
      const { access_token, user: userData } = res.data;
      
      localStorage.setItem("hiremate-token", access_token);
      localStorage.setItem("hiremate-user", JSON.stringify(userData));
      setUser(userData);
      showToast("Successfully signed in with Google!", "success");
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Google authentication failed.";
      showToast(msg, "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Backend logout logging skipped:", error);
    } finally {
      localStorage.removeItem("hiremate-token");
      localStorage.removeItem("hiremate-user");
      setUser(null);
      showToast("Logged out successfully.", "info");
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
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
