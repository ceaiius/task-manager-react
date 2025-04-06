import axios from "axios";

interface TaskPayload {
    title: string;
    due_date?: string | null; 
}

const API_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No auth token found in localStorage.");

    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const getTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`, {
    headers: getAuthHeader(),
  });

  return response.data.data ?? response.data;
};

export const createTask = async (payload: TaskPayload) => {
  console.log("Creating task with payload:", payload);

  const dataToSend: { title: string; due_date?: string } = { title: payload.title };
  if (payload.due_date) {
      dataToSend.due_date = payload.due_date;
  }

  await axios.post(
    `${API_URL}/tasks`,
    dataToSend,
    { headers: getAuthHeader() }
  );
};

export const toggleTaskStatus = async (id: number | string) => { // Accept string IDs too
  await axios.put(`${API_URL}/tasks/${id}/toggle-status`, {}, {
    headers: getAuthHeader()
  });
};

export const deleteTask = async (id: number | string) => { // Accept string IDs too
  await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: getAuthHeader(),
  });
};
