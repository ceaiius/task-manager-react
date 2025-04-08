import { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { getUserProfile, UserData } from "../api/auth";
import apiClient from "../api/apiClient";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null; // Add user state
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  updateUserContext: (updatedUserData: UserData) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const fetchAndSetUser = useCallback(async (currentToken: string) => {
    console.log("Attempting to fetch user profile with token:", currentToken);
    // Ensure the API client has the latest token for this request
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
    try {
      const userData = await getUserProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user profile on load:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, []);

  const updateUserContext = (updatedUserData: UserData) => {
    setUser(updatedUserData);
  };


  // Effect to check auth status and fetch user on initial load
  useEffect(() => {
    const checkAuth = async () => {
        setIsLoading(true); // Start loading
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          console.log("Token found in storage, verifying...");
          setToken(storedToken);
          await fetchAndSetUser(storedToken); // Fetch user data using the token
        } else {
          console.log("No token found in storage.");
          setIsAuthenticated(false);
          setUser(null);
        }
        setIsLoading(false); // Finish loading
    };
    checkAuth();
  }, [fetchAndSetUser]); // Depend on fetchAndSetUser

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, user, isLoading, updateUserContext }}>
      {!isLoading ? children : <div className="min-h-screen flex items-center justify-center">Loading...</div> /* Or a proper spinner */}
      </AuthContext.Provider>
  );
};
