import * as api from './ahmaApi';
import * as mock from '../data/mockTickets';

async function withFallback(apiFn, mockFn, fallbackMsg = 'API indisponible, utilisation des donnees locales') {
  try {
    return await apiFn();
  } catch {
    console.warn(fallbackMsg);
    return mockFn();
  }
}

export const getTickets = () => withFallback(api.getTickets, mock.getTickets, 'API tickets indisponible, affichage des donnees locales');
export const getTicketById = (id) => withFallback(() => api.getTicketById(id), () => mock.getTicketById(id));
export const createTicket = (data) => withFallback(() => api.createTicket(data), () => {
  const authorName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).nom || 'Utilisateur' : 'Utilisateur';
  mock.createTicket(data, authorName);
  return null;
});
export const updateTicket = (id, data) => withFallback(() => api.updateTicket(id, data), () => mock.updateTicket(id, data));
export const updateTicketStatus = (id, status) => withFallback(() => api.updateTicketStatus(id, status), () => mock.updateTicketStatus(id, status));
export const addTicketComment = (id, content, author, pieceJointe) => withFallback(
  () => api.addTicketComment(id, { content, author, pieceJointe }),
  () => mock.addTicketComment(id, content, author, pieceJointe)
);
export const deleteTicket = (id) => withFallback(() => api.deleteTicket(id), () => null);

export const getNotifications = () => withFallback(api.getNotifications, mock.getNotifications);
export const markNotificationAsRead = (id) => withFallback(() => api.markNotificationAsRead(id), () => mock.markNotificationAsRead(id));
export const getUnreadCount = () => withFallback(api.getNotifications, mock.getNotifications).then((n) => n.filter((x) => !x.lu).length).catch(() => mock.getUnreadCount());
