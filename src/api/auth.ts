import apiClient from "./apiClient";

interface AuthResponse {
  token: string;
}

export const register = async (name: string, email: string, password: string) => {
  const response = await apiClient.post<AuthResponse>("/register", { name, email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post<AuthResponse>("/login", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const logout = async () => {
  await apiClient.post("/logout");
  localStorage.removeItem("token");
};
