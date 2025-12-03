import '../styles/components.css'

function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="stats-card">
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-value">{value}</div>
      {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
      {icon && <div style={{ marginTop: '10px', fontSize: '2rem' }}>{icon}</div>}
    </div>
  )
}

export default StatsCard
