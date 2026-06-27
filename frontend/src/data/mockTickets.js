// src/data/mockTickets.js

const INITIAL_TICKETS = [
  {
    id: '1',
    titre: 'Imprimante du 2e étage hors service',
    description: 'L\'imprimante du 2e étage ne répond plus depuis ce matin. Un voyant rouge clignote et aucune impression ne sort. Plusieurs collègues sont bloqués.',
    statut: 'nouveau',
    priorite: 'haute',
    categorie: 'Matériel',
    auteur: 'Awa Ndiaye',
    fichier_joint: null,
    date_creation: '2026-06-18',
    history: [
      { id: 'h1', action: 'Création du ticket', author: 'Awa Ndiaye', date: '2026-06-18T08:30:00Z', type: 'system' }
    ]
  },
  {
    id: '2',
    titre: 'Connexion Wi-Fi instable en salle B',
    description: 'Le Wi-Fi de la salle B coupe toutes les 5 minutes. Impossible de suivre les cours en ligne correctement.',
    statut: 'en_cours',
    priorite: 'critique',
    categorie: 'Réseau',
    auteur: 'Cheikh Fall',
    fichier_joint: null,
    date_creation: '2026-06-17',
    history: [
      { id: 'h2', action: 'Création du ticket', author: 'Cheikh Fall', date: '2026-06-17T09:00:00Z', type: 'system' },
      { id: 'h3', action: 'Statut modifié en "En cours"', author: 'Malick', date: '2026-06-17T10:00:00Z', type: 'system' }
    ]
  },
  {
    id: '3',
    titre: 'Installer la licence Office sur le PC 12',
    description: 'Le poste 12 n\'a pas la suite Office installée. Merci de l\'installer avant la fin de la semaine.',
    statut: 'assigne',
    priorite: 'basse',
    categorie: 'Logiciel',
    auteur: 'Mariama Sow',
    fichier_joint: null,
    date_creation: '2026-06-16',
    history: [
      { id: 'h4', action: 'Création du ticket', author: 'Mariama Sow', date: '2026-06-16T14:00:00Z', type: 'system' }
    ]
  }
];

export const getTickets = () => {
  const stored = localStorage.getItem('mockTickets_v4');
  if (!stored) {
    localStorage.setItem('mockTickets_v4', JSON.stringify(INITIAL_TICKETS));
    return INITIAL_TICKETS;
  }
  return JSON.parse(stored);
};

export const getTicketById = (id) => {
  const tickets = getTickets();
  return tickets.find(t => String(t.id) === String(id));
};

export const updateTicketStatus = (id, newStatus, author = 'Malick') => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => String(t.id) === String(id));
  if (ticketIndex > -1) {
    const ticket = tickets[ticketIndex];
    ticket.statut = newStatus;

    ticket.history.push({
      id: Date.now().toString(),
      action: `Statut modifié à "${newStatus}"`,
      author,
      date: new Date().toISOString(),
      type: 'system'
    });

    localStorage.setItem('mockTickets_v4', JSON.stringify(tickets));
    return ticket;
  }
  return null;
};

export const updateTicket = (id, updates, authorName) => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => String(t.id) === String(id));
  if (ticketIndex > -1) {
    const ticket = tickets[ticketIndex];
    if (ticket.statut !== 'nouveau') return null;

    Object.assign(ticket, updates);
    ticket.history.push({
      id: Date.now().toString(),
      action: 'Ticket modifié par le créateur',
      author: authorName,
      date: new Date().toISOString(),
      type: 'system'
    });

    localStorage.setItem('mockTickets_v4', JSON.stringify(tickets));
    return ticket;
  }
  return null;
};

export const addTicketComment = (id, commentContent, author = 'Malick', pieceJointe = null) => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => String(t.id) === String(id));
  if (ticketIndex > -1) {
    const ticket = tickets[ticketIndex];

    const entry = {
      id: Date.now().toString(),
      content: commentContent,
      author,
      date: new Date().toISOString(),
      type: 'comment'
    };
    if (pieceJointe) entry.piece_jointe = pieceJointe;

    ticket.history.push(entry);

    localStorage.setItem('mockTickets_v4', JSON.stringify(tickets));
    return ticket;
  }
  return null;
};

export const createTicket = (ticketData, authorName) => {
  const tickets = getTickets();
  const newTicket = {
    id: Date.now().toString(),
    titre: ticketData.titre,
    description: ticketData.description,
    categorie: ticketData.categorie,
    priorite: ticketData.priorite || 'moyenne',
    fichier_joint: ticketData.fichier_joint || null,
    statut: 'nouveau',
    auteur: authorName,
    date_creation: new Date().toISOString(),
    history: [
      {
        id: Date.now().toString() + '_h1',
        action: 'Création du ticket',
        author: authorName,
        date: new Date().toISOString(),
        type: 'system'
      }
    ]
  };
  tickets.unshift(newTicket);
  localStorage.setItem('mockTickets_v4', JSON.stringify(tickets));
  return newTicket;
};

export const getNotifications = () => {
  const stored = localStorage.getItem('mockNotifications_v1');
  if (!stored) {
    const initial = [
      { id: 'n1', message: 'Ticket #1 créé par Awa Ndiaye', type: 'info', ticketId: '1', lu: false, date: '2026-06-18T08:30:00Z' },
      { id: 'n2', message: 'Ticket #2 assigné à Malick', type: 'info', ticketId: '2', lu: false, date: '2026-06-17T10:00:00Z' },
    ];
    localStorage.setItem('mockNotifications_v1', JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const markNotificationAsRead = (id) => {
  const notifs = getNotifications();
  const n = notifs.find(x => x.id === id);
  if (n) {
    n.lu = true;
    localStorage.setItem('mockNotifications_v1', JSON.stringify(notifs));
  }
  return notifs;
};

export const addNotification = (message, ticketId) => {
  const notifs = getNotifications();
  notifs.unshift({
    id: Date.now().toString(),
    message,
    type: 'info',
    ticketId,
    lu: false,
    date: new Date().toISOString(),
  });
  localStorage.setItem('mockNotifications_v1', JSON.stringify(notifs));
  return notifs;
};

export const getUnreadCount = () => {
  const notifs = getNotifications();
  return notifs.filter(n => !n.lu).length;
};
