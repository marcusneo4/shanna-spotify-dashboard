import '../styles/components.css'

// Toggle between the Stats overview and Charts view
function StatsToggle({ activeView, onViewChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
      <button
        className={`btn ${activeView === 'stats' ? 'btn-active' : ''}`}
        onClick={() => onViewChange('stats')}
      >
        📊 Stats Overview
      </button>
      <button
        className={`btn ${activeView === 'charts' ? 'btn-active' : ''}`}
        onClick={() => onViewChange('charts')}
      >
        📈 Charts View
      </button>
    </div>
  )
}

export default StatsToggle
