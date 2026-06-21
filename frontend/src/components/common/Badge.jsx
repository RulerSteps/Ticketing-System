import "../../styles/badge.css";

function Badge({ label, color }) {
  return (
    <span className="badge" style={{ background: color }}>
      {label}
    </span>
  );
}

export default Badge;