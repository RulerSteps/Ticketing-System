import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Stats
export const getStats = () => api.get('/stats/overview').then((r) => r.data);

// Users
export const getUsers = () => api.get('/users').then((r) => r.data);
export const createUser = (data) => api.post('/users', data).then((r) => r.data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data).then((r) => r.data);
export const toggleUserStatus = (id) =>
  api.patch(`/users/${id}/toggle-status`).then((r) => r.data);
export const updateProfile = (data) => api.put('/users/profile', data).then((r) => r.data);
export const changePassword = (data) => api.post('/auth/change-password', data).then((r) => r.data);

// Categories
export const getCategories = () => api.get('/categories').then((r) => r.data);
export const createCategory = (data) => api.post('/categories', data).then((r) => r.data);
export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);

// Tickets
export const getTickets = () => api.get('/tickets').then((r) => r.data);
export const getTicketById = (id) => api.get(`/tickets/${id}`).then((r) => r.data);
export const createTicket = (data) => api.post('/tickets', data).then((r) => r.data);
export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data).then((r) => r.data);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`).then((r) => r.data);
export const updateTicketStatus = (id, status) =>
  api.patch(`/tickets/${id}/status`, { status }).then((r) => r.data);
export const addTicketComment = (id, data) =>
  api.post(`/tickets/${id}/comments`, data).then((r) => r.data);
export const getUnassignedTickets = () =>
  api.get('/tickets/unassigned').then((r) => r.data);
export const assignTicket = (ticketId, technicianId) =>
  api.put(`/tickets/${ticketId}/assign`, { technicianId }).then((r) => r.data);

// Technicians
export const getTechnicians = () =>
  api.get('/users/technicians').then((r) => r.data);

// Notifications
export const getNotifications = () => api.get('/notifications').then((r) => r.data);
export const markNotificationAsRead = (id) =>
  api.patch(`/notifications/${id}/read`).then((r) => r.data);

// Auth
export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email }).then((r) => r.data);

export default api;
