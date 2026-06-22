/**
 * AIBadge.jsx — Badge de priorité calculée par l'IA
 * Props :
 *   score : number  — score de priorité (0-100)
 *   level : string  — "CRITIQUE" | "HAUTE" | "MOYENNE" | "FAIBLE"
 *
 * Couleurs selon le niveau :
 *   CRITIQUE (75-100) → rouge
 *   HAUTE    (50-74)  → orange
 *   MOYENNE  (25-49)  → jaune
 *   FAIBLE   (0-24)   → vert
 */

const LEVEL_CONFIG = {
  CRITIQUE: {
    emoji: '🔴',
    className: 'bg-red-100 text-red-800 border border-red-300',
  },
  HAUTE: {
    emoji: '🟠',
    className: 'bg-orange-100 text-orange-800 border border-orange-300',
  },
  MOYENNE: {
    emoji: '🟡',
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  },
  FAIBLE: {
    emoji: '🟢',
    className: 'bg-green-100 text-green-800 border border-green-300',
  },
};

const AIBadge = ({ score, level }) => {
  // Valeur par défaut si le niveau est inconnu
  const config = LEVEL_CONFIG[level] ?? {
    emoji: '⚪',
    className: 'bg-gray-100 text-gray-700 border border-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}
      title={`Score IA : ${score}`}
    >
      <span>{config.emoji}</span>
      <span>{level}</span>
      {score !== undefined && score !== null && (
        <span className="opacity-70">({score})</span>
      )}
    </span>
  );
};

export default AIBadge;
