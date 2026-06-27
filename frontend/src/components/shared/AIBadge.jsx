const LEVEL_CONFIG = {
  CRITIQUE: { label: 'Critique', className: 'bg-red-100 text-red-700 border border-red-200' },
  HAUTE:    { label: 'Haute',    className: 'bg-orange-100 text-orange-700 border border-orange-200' },
  MOYENNE:  { label: 'Moyenne',  className: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  FAIBLE:   { label: 'Faible',   className: 'bg-green-100 text-green-700 border border-green-200' },
};

const AIBadge = ({ score, level }) => {
  const config = LEVEL_CONFIG[level] ?? {
    label: 'Inconnu',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${config.className}`}
      title={`Score IA : ${score}`}
    >
      <span>{config.label}</span>
      {score !== undefined && score !== null && (
        <span className="opacity-60">({score})</span>
      )}
    </span>
  );
};

export default AIBadge;
