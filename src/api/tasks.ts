import axios from "axios";

interface TaskPayload {
    title: string;
    due_date?: string | null;
    category?: string | null;
}

export interface Task {
    id: number | string;
    title: string;
    status: 'pending' | 'completed';
    due_date: string | null;
    category: string | null;
    
    created_at: string;
    updated_at: string;
}

export interface PaginatedTasksResponse {
    current_page: number;
    data: Task[]; 
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}


const API_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

export const getTasks = async (page: number = 1, category: string = 'all'): Promise<PaginatedTasksResponse> => {

  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (category !== 'all') {
      params.append('category', category); 
  }

  const response = await axios.get(`${API_URL}/tasks`, {
    headers: getAuthHeader(),
    params: params 
  });
  return response.data;
};

export const createTask = async (payload: TaskPayload) => {
    const dataToSend: { title: string; due_date?: string; category?: string } = { title: payload.title };
    if (payload.due_date) dataToSend.due_date = payload.due_date;
    if (payload.category) dataToSend.category = payload.category;
    await axios.post(`${API_URL}/tasks`, dataToSend, { headers: getAuthHeader() });
};

export const toggleTaskStatus = async (id: number | string) => { 
  await axios.put(`${API_URL}/tasks/${id}/toggle-status`, {}, {
    headers: getAuthHeader()
  });
};

export const deleteTask = async (id: number | string) => { 
  await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: getAuthHeader(),
  });
};
