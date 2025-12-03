import '../styles/components.css'

function ChartLimitButtons({ label, activeLimit, onLimitChange, limits = [10, 15, 20, 25, 30] }) {
  return (
    <div className="quick-filters" style={{ marginBottom: '10px' }}>
      <span style={{ marginRight: '10px', fontWeight: '600', color: '#666' }}>{label}:</span>
      {limits.map(limit => (
        <button
          key={limit}
          className={`btn ${activeLimit === limit ? 'btn-active' : ''}`}
          onClick={() => onLimitChange(limit)}
          style={{ padding: '8px 15px', fontSize: '0.9rem' }}
        >
          Top {limit}
        </button>
      ))}
    </div>
  )
}

export default ChartLimitButtons
