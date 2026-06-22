/**
 * ahmaApi.js — Configuration Axios et fonctions API pour la partie Admin (Ahma)
 * Système de Ticketing IT — GLSI2 ESP Dakar 2025-2026
 *
 * Toutes les requêtes partent de VITE_API_URL défini dans .env
 * Le token JWT est lu depuis localStorage à chaque appel.
 */

import axios from 'axios';

// ── Instance Axios centrale ────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur : ajoute automatiquement le token Bearer à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : redirige vers /login si le token expire (401)
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

// ── Statistiques ──────────────────────────────────────────────────────────────

/**
 * Récupère les statistiques globales du tableau de bord.
 * @returns {{ total, open, inProgress, resolved, byCategory, byDay }}
 */
export const getStats = () => api.get('/stats/overview').then((r) => r.data);

// ── Utilisateurs ──────────────────────────────────────────────────────────────

/**
 * Récupère la liste complète des utilisateurs.
 * @returns {Array} liste d'utilisateurs
 */
export const getUsers = () => api.get('/users').then((r) => r.data);

/**
 * Crée un nouvel utilisateur.
 * @param {{ name, email, role, password }} data
 */
export const createUser = (data) => api.post('/users', data).then((r) => r.data);

/**
 * Met à jour un utilisateur existant.
 * @param {number} id
 * @param {{ name, email, role }} data
 */
export const updateUser = (id, data) => api.put(`/users/${id}`, data).then((r) => r.data);

/**
 * Bascule le statut actif/inactif d'un utilisateur.
 * @param {number} id
 */
export const toggleUserStatus = (id) =>
  api.patch(`/users/${id}/toggle-status`).then((r) => r.data);

// ── Catégories ────────────────────────────────────────────────────────────────

/**
 * Récupère toutes les catégories de tickets.
 * @returns {Array} liste de catégories
 */
export const getCategories = () => api.get('/categories').then((r) => r.data);

/**
 * Crée une nouvelle catégorie.
 * @param {{ name, description }} data
 */
export const createCategory = (data) => api.post('/categories', data).then((r) => r.data);

/**
 * Modifie une catégorie existante.
 * @param {number} id
 * @param {{ name, description }} data
 */
export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data).then((r) => r.data);

/**
 * Supprime une catégorie.
 * @param {number} id
 */
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);

// ── Tickets ───────────────────────────────────────────────────────────────────

/**
 * Récupère les tickets non encore assignés.
 * @returns {Array} liste de tickets non assignés
 */
export const getUnassignedTickets = () =>
  api.get('/tickets/unassigned').then((r) => r.data);

/**
 * Récupère la liste des techniciens disponibles.
 * @returns {Array} techniciens
 */
export const getTechnicians = () =>
  api.get('/users/technicians').then((r) => r.data);

/**
 * Assigne un ticket à un technicien.
 * @param {number} ticketId
 * @param {number} technicianId
 */
export const assignTicket = (ticketId, technicianId) =>
  api.put(`/tickets/${ticketId}/assign`, { technicianId }).then((r) => r.data);

export default api;
