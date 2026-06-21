// src/data/mockTickets.js

const INITIAL_TICKETS = [
  {
    id: '1',
    title: 'Problème de connexion au VPN',
    description: 'Impossible de se connecter au VPN depuis ce matin, erreur 403.',
    status: 'Nouveau',
    priority: 'Haute',
    creator: 'Alice Dupont',
    createdAt: '2026-06-21T08:30:00Z',
    history: [
      { id: 'h1', action: 'Création du ticket', author: 'Alice Dupont', date: '2026-06-21T08:30:00Z', type: 'system' }
    ]
  },
  {
    id: '2',
    title: 'Demande de licence logicielle',
    description: 'J\'ai besoin d\'une licence pour la suite Adobe Creative Cloud.',
    status: 'En cours',
    priority: 'Moyenne',
    creator: 'Bob Martin',
    createdAt: '2026-06-20T14:15:00Z',
    history: [
      { id: 'h2', action: 'Création du ticket', author: 'Bob Martin', date: '2026-06-20T14:15:00Z', type: 'system' },
      { id: 'h3', action: 'Statut modifié de Nouveau à En cours', author: 'Malick (Technicien)', date: '2026-06-20T15:00:00Z', type: 'system' },
      { id: 'h4', content: 'Demande envoyée au service achat.', author: 'Malick (Technicien)', date: '2026-06-20T15:05:00Z', type: 'comment' }
    ]
  },
  {
    id: '3',
    title: 'Écran bleu au démarrage',
    description: 'Mon ordinateur affiche un écran bleu au démarrage, impossible de travailler.',
    status: 'Résolu',
    priority: 'Critique',
    creator: 'Charlie Durand',
    createdAt: '2026-06-19T09:00:00Z',
    history: [
      { id: 'h5', action: 'Création du ticket', author: 'Charlie Durand', date: '2026-06-19T09:00:00Z', type: 'system' },
      { id: 'h6', action: 'Statut modifié de Nouveau à Résolu', author: 'Malick (Technicien)', date: '2026-06-19T11:00:00Z', type: 'system' },
      { id: 'h7', content: 'Mise à jour des pilotes de la carte graphique effectuée.', author: 'Malick (Technicien)', date: '2026-06-19T11:00:00Z', type: 'comment' }
    ]
  }
];

export const getTickets = () => {
  const stored = localStorage.getItem('mockTickets');
  if (!stored) {
    localStorage.setItem('mockTickets', JSON.stringify(INITIAL_TICKETS));
    return INITIAL_TICKETS;
  }
  return JSON.parse(stored);
};

export const getTicketById = (id) => {
  const tickets = getTickets();
  return tickets.find(t => t.id === id);
};

export const updateTicketStatus = (id, newStatus, author = 'Malick (Technicien)') => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === id);
  if (ticketIndex > -1) {
    const ticket = tickets[ticketIndex];
    const oldStatus = ticket.status;
    ticket.status = newStatus;
    
    // Add history entry for status change
    ticket.history.push({
      id: Date.now().toString(),
      action: `Statut modifié de ${oldStatus} à ${newStatus}`,
      author,
      date: new Date().toISOString(),
      type: 'system'
    });

    localStorage.setItem('mockTickets', JSON.stringify(tickets));
    return ticket;
  }
  return null;
};

export const addTicketComment = (id, commentContent, author = 'Malick (Technicien)') => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === id);
  if (ticketIndex > -1) {
    const ticket = tickets[ticketIndex];
    
    // Add history entry for new comment
    ticket.history.push({
      id: Date.now().toString(),
      content: commentContent,
      author,
      date: new Date().toISOString(),
      type: 'comment'
    });

    localStorage.setItem('mockTickets', JSON.stringify(tickets));
    return ticket;
  }
  return null;
};
