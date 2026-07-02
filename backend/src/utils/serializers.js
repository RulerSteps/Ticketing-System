// Couche de traduction entre le schema BDD (francais, conforme au CDC) et le
// contrat attendu par le frontend deja en place (camelCase anglais, cf.
// frontend/src/services/ahmaApi.js). La BDD/le moteur IA restent en francais
// (ia_criticite = 'BASSE' ...) ; seule la sortie JSON est traduite ici.
const AI_LEVEL_TO_API = {
  CRITIQUE: 'CRITIQUE',
  HAUTE: 'HAUTE',
  MOYENNE: 'MOYENNE',
  BASSE: 'FAIBLE',
};

function serializeCategory(category) {
  if (!category) return null;
  return {
    id: category.id,
    name: category.nom,
    description: category.description,
  };
}

function serializeUserBrief(user) {
  if (!user) return null;
  return { id: user.id, name: user.nom, email: user.email };
}

function serializeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.nom,
    email: user.email,
    role: user.role,
    active: user.actif,
    createdAt: user.date_creation,
  };
}

function serializeTicket(ticket) {
  if (!ticket) return null;
  return {
    id: ticket.id,
    title: ticket.titre,
    description: ticket.description,
    status: ticket.statut,
    priority: ticket.priorite,
    category: ticket.categorie ? serializeCategory(ticket.categorie) : null,
    categoryName: ticket.categorie ? ticket.categorie.nom : null,
    creator: ticket.createur ? serializeUserBrief(ticket.createur) : null,
    technician: ticket.technicien ? serializeUserBrief(ticket.technicien) : null,
    aiLevel: ticket.ia_criticite ? AI_LEVEL_TO_API[ticket.ia_criticite] || ticket.ia_criticite : null,
    aiScore: ticket.ia_score,
    aiJustification: ticket.ia_justification,
    createdAt: ticket.date_creation,
    updatedAt: ticket.date_modification,
    resolvedAt: ticket.date_resolution,
  };
}

module.exports = { serializeCategory, serializeUser, serializeUserBrief, serializeTicket, AI_LEVEL_TO_API };
