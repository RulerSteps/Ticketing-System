export const STATUTS = [
  { value: "nouveau", label: "Nouveau", color: "var(--status-nouveau)" },
  { value: "assigne", label: "Assigné", color: "var(--status-assigne)" },
  { value: "en_cours", label: "En cours", color: "var(--status-en-cours)" },
  { value: "en_attente", label: "En attente", color: "var(--status-en-attente)" },
  { value: "resolu", label: "Résolu", color: "var(--status-resolu)" },
  { value: "ferme", label: "Fermé", color: "var(--status-ferme)" },
];

export const PRIORITES = [
  { value: "critique", label: "Critique", color: "var(--priorite-critique)" },
  { value: "haute", label: "Haute", color: "var(--priorite-haute)" },
  { value: "moyenne", label: "Moyenne", color: "var(--priorite-moyenne)" },
  { value: "basse", label: "Basse", color: "var(--priorite-basse)" },
];

export const getStatut = (value) =>
  STATUTS.find((s) => s.value === value) || { label: value, color: "var(--color-text-muted)" };

export const getPriorite = (value) =>
  PRIORITES.find((p) => p.value === value) || { label: value, color: "var(--color-text-muted)" };