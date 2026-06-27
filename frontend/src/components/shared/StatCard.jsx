const StatCard = ({ title, value, color }) => {
  return (
    <div className={`${color} rounded-2xl shadow-lg p-5 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
      <p className="text-xs font-medium text-white/70 uppercase tracking-wider relative">{title}</p>
      <p className="text-2xl font-bold mt-1.5 relative">{value ?? '—'}</p>
    </div>
  );
};

export default StatCard;
