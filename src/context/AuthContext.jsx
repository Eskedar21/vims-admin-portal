import { createContext, useContext, useState, useEffect } from "react";
import { getUserScopeFromUser } from "../data/mockUsersCredentials";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem("vims_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // Login function
  const login = async (userData) => {
    // Remove password from user object before storing
    const { password, ...userWithoutPassword } = userData;
    
    // Get user scope and role
    const scope = getUserScopeFromUser(userData);
    
    // Format user for the app
    const formattedUser = {
      id: userData.user_id,
      name: userData.full_name,
      email: userData.email,
      phone: userData.phone,
      username: userData.username,
      role: scope.role,
      roleId: scope.roleId,
      scopeType: scope.type,
      scopeValue: scope.value,
      scopeIds: scope.ids,
      role_assignments: userData.role_assignments,
      lastLoginAt: new Date().toISOString(),
      status: userData.status,
    };

    setUser(formattedUser);
    setIsAuthenticated(true);
    localStorage.setItem("vims_user", JSON.stringify(formattedUser));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("vims_user");
  };

  // Update last login time on mount if user exists
  useEffect(() => {
    if (user && !user.lastLoginAt) {
      const updatedUser = {
        ...user,
        lastLoginAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      localStorage.setItem("vims_user", JSON.stringify(updatedUser));
    }
  }, [user]);

  const value = { 
    user, 
    isAuthenticated, 
    setUser, 
    login, 
    logout 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}



