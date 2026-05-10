/**
 * Centralized API utility for InnerTrace
 */

const API_BASE = '/api';

export const apiFetch = async (endpoint, options = {}) => {
  const { body, ...customConfig } = options;
  const headers = { 'Content-Type': 'application/json', ...customConfig.headers };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(data.error || response.statusText);
  } catch (err) {
    console.error(`API Error (${endpoint}):`, err.message);
    throw err;
  }
};

export const authApi = {
  login: (email, password) => apiFetch('/auth/login', { body: { email, password } }),
  register: (userData) => apiFetch('/auth/register', { body: userData }),
};

export const userApi = {
  getProfile: (id) => apiFetch(`/user/${id}`),
  updateProfile: (id, data) => apiFetch(`/user/${id}`, { method: 'PUT', body: data }),
  getSummary: (id) => apiFetch(`/user/summary/${id}`),
  deleteProfile: (id) => apiFetch(`/user/${id}`, { method: 'DELETE' }),
};

export const workoutApi = {
  getWorkouts: (userId) => apiFetch(`/workouts/${userId}`),
  generate: (data) => apiFetch('/workouts/generate', { body: data }),
  updateWorkout: (id, exercises_json) => apiFetch(`/workouts/${id}`, { method: 'PUT', body: { exercises_json } }),
};

export const nutritionApi = {
  getMeals: (userId) => apiFetch(`/nutrition/${userId}`),
  generate: (data) => apiFetch('/nutrition/generate', { body: data }),
  updateMeals: (id, meals_json) => apiFetch(`/nutrition/${id}`, { method: 'PUT', body: { meals_json } }),
};

export const journalApi = {
  getHistory: (userId) => apiFetch(`/journal/${userId}`),
  saveEntry: (data) => apiFetch('/journal', { body: data }),
  getInsight: (data) => apiFetch('/ai/journal-insight', { body: data }),
};

export const fitnessApi = {
  saveProfile: (data) => apiFetch('/fitness/profile', { body: data }),
};

export const aiApi = {
  chat: (userId, message) => apiFetch('/ai/chat', { body: { userId, message } }),
  getChatHistory: (userId) => apiFetch(`/ai/chat/history/${userId}`),
};
