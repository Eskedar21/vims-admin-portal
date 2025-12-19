import { createContext, useContext, useState, useEffect } from "react";
import { mockUser } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load user from localStorage or use mock
    const savedUser = localStorage.getItem("vims_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return mockUser;
      }
    }
    return mockUser;
  });

  // Update last login time
  useEffect(() => {
    if (user) {
      const updatedUser = {
        ...user,
        lastLoginAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      localStorage.setItem("vims_user", JSON.stringify(updatedUser));
    }
  }, []);

  const value = { user, isAuthenticated: !!user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}



