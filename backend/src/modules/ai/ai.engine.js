// Module IA — moteur de regles + detection de mots-cles + calcul de score de criticite.
// 100% local, sans dependance externe ni API tierce (CDC section 13).
const KEYWORDS = require('./keywords');

const NIVEAUX = ['CRITIQUE', 'HAUTE', 'MOYENNE', 'BASSE'];

const POIDS = {
  CRITIQUE: 25,
  HAUTE: 15,
  MOYENNE: 10,
  BASSE: 5,
};

const RECOMMANDATIONS = {
  CRITIQUE: 'Affecter immediatement un technicien. Prevenir la direction.',
  HAUTE: 'Affecter un technicien dans les plus brefs delais, departement impacte.',
  MOYENNE: 'Planifier une intervention technicien sous 24 a 48 heures.',
  BASSE: 'Traitement standard, sans urgence particuliere.',
};

// Normalise le texte : minuscules + suppression des accents, pour que
// "reseau" (mot-cle) matche aussi "réseau" (texte saisi par l'utilisateur).
function normaliser(texte) {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// Etape 1-4 de l'algorithme du CDC (13.4)
function analyzeTicket(titre = '', description = '') {
  const texte = normaliser(`${titre} ${description}`);

  const details = {};
  for (const niveau of NIVEAUX) {
    const motsTrouves = KEYWORDS[niveau].filter((mot) => texte.includes(mot));
    details[niveau] = {
      motsTrouves,
      occurrences: motsTrouves.length,
      score: Math.min(motsTrouves.length * POIDS[niveau], 100),
    };
  }

  // Niveau retenu = celui avec le score le plus eleve. Si aucun mot-cle n'a ete
  // detecte nulle part, on retombe par defaut sur le niveau BASSE.
  let niveauRetenu = 'BASSE';
  let meilleurScore = 0;
  for (const niveau of NIVEAUX) {
    if (details[niveau].score > meilleurScore) {
      meilleurScore = details[niveau].score;
      niveauRetenu = niveau;
    }
  }

  const motsTrouves = details[niveauRetenu].motsTrouves;
  const justification =
    motsTrouves.length > 0
      ? `Mots-cles detectes (${niveauRetenu}) : ${motsTrouves.join(', ')}`
      : 'Aucun mot-cle significatif detecte, classement par defaut au niveau le plus bas.';

  return {
    criticite: niveauRetenu,
    score: meilleurScore,
    justification,
    recommandation: RECOMMANDATIONS[niveauRetenu],
    details,
  };
}

module.exports = { analyzeTicket, NIVEAUX, POIDS };
