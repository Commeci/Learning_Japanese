// AuthContext.js
import { createContext, useContext, useState } from "react";
import { TokenStorage } from "../axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!TokenStorage.getToken()
  );

  const login = (token) => {
    TokenStorage.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    TokenStorage.removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
