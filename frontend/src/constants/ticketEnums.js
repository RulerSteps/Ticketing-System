export const STATUTS = [
  { value: "nouveau", label: "Nouveau", color: "var(--status-nouveau)" },
  { value: "assigne", label: "Assigné", color: "var(--status-assigne)" },
  { value: "en_cours", label: "En cours", color: "var(--status-en-cours)" },
  { value: "resolu", label: "Résolu", color: "var(--status-resolu)" },
  { value: "ferme", label: "Fermé", color: "var(--status-ferme)" },
];

export const PRIORITES = [
  { value: "basse", label: "Basse", color: "var(--priorite-basse)" },
  { value: "moyenne", label: "Moyenne", color: "var(--priorite-moyenne)" },
  { value: "haute", label: "Haute", color: "var(--priorite-haute)" },
  { value: "urgente", label: "Urgente", color: "var(--priorite-urgente)" },
];

export const getStatut = (value) =>
  STATUTS.find((s) => s.value === value) || { label: value, color: "var(--color-text-muted)" };

export const getPriorite = (value) =>
  PRIORITES.find((p) => p.value === value) || { label: value, color: "var(--color-text-muted)" };