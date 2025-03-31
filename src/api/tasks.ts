import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Retrieve token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const createTask = async (title: string) => {
    console.log(title);
    
  await axios.post(
    `${API_URL}/tasks`,
    { title },
    { headers: getAuthHeader() }
  );
};

export const toggleTaskStatus = async (id: number) => {
  await axios.put(`${API_URL}/tasks/${id}/toggle-status`, {}, { 
    headers: getAuthHeader() 
  });
};

export const deleteTask = async (id: number) => {
  await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: getAuthHeader(),
  });
};
