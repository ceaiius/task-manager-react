import apiClient from "./apiClient";

interface AuthResponse {
  token: string;
  user?: UserData;

}

export interface UserData {
  id: number | string;
  name: string;
  email: string;
}

export const register = async (name: string, email: string, password: string) => {
  const response = await apiClient.post<AuthResponse>("/register", { name, email, password });
  const token = response.data.token;
  localStorage.setItem("token", token); // Save token

  return token;
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

export const getUserProfile = async (): Promise<UserData> => {
  const response = await apiClient.get<{ user: UserData }>("/user");
  return response.data.user ?? response.data;
};

export const updateUserName = async (name: string): Promise<UserData> => {
  const response = await apiClient.put<{ user: UserData }>("/user/name", { name });
  return response.data.user ?? response.data;
}

export const changeUserPassword = async (data: { current_password: string; new_password: string; new_password_confirmation: string }): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>("/user/password", data);
  return response.data;
}