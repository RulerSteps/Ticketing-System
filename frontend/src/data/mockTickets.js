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
    priorite: 'urgente',
    categorie: 'Réseau',
    auteur: 'Cheikh Fall',
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
    date_creation: '2026-06-16',
    history: [
      { id: 'h4', action: 'Création du ticket', author: 'Mariama Sow', date: '2026-06-16T14:00:00Z', type: 'system' }
    ]
  }
];

export const getTickets = () => {
  const stored = localStorage.getItem('mockTickets_v3');
  if (!stored) {
    localStorage.setItem('mockTickets_v3', JSON.stringify(INITIAL_TICKETS));
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
    
    // Add history entry for status change
    ticket.history.push({
      id: Date.now().toString(),
      action: `Statut modifié à "${newStatus}"`,
      author,
      date: new Date().toISOString(),
      type: 'system'
    });

    localStorage.setItem('mockTickets_v3', JSON.stringify(tickets));
    return ticket;
  }
  return null;
};

export const addTicketComment = (id, commentContent, author = 'Malick') => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => String(t.id) === String(id));
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

    localStorage.setItem('mockTickets_v3', JSON.stringify(tickets));
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
    priorite: ticketData.priorite,
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
  tickets.unshift(newTicket); // Add to the top of the list
  localStorage.setItem('mockTickets_v3', JSON.stringify(tickets));
  return newTicket;
};
