/**
 * StatCard.jsx — Carte KPI réutilisable pour le tableau de bord
 * Props :
 *   title  : string  — libellé de la statistique
 *   value  : number  — valeur à afficher
 *   icon   : string  — emoji ou caractère d'icône
 *   color  : string  — classe Tailwind de couleur de fond (ex: "bg-blue-500")
 */

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} rounded-2xl shadow-md p-6 flex items-center gap-4 text-white`}>
      {/* Icône dans un cercle semi-transparent */}
      <div className="text-4xl bg-white/20 rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      {/* Texte */}
      <div>
        <p className="text-sm font-medium opacity-80 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold mt-1">{value ?? '—'}</p>
      </div>
    </div>
  );
};

export default StatCard;
