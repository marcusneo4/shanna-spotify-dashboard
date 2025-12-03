import '../styles/components.css'

function QuickActions({ onClearFilters, onResetView, hasActiveFilters }) {
  return (
    <div className="quick-filters" style={{ marginTop: '15px', padding: '15px', background: 'rgba(255, 182, 193, 0.2)', borderRadius: '10px' }}>
      <span style={{ marginRight: '10px', fontWeight: '600', color: '#666' }}>Quick Actions:</span>
      <button
        className="btn"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
        style={{ opacity: hasActiveFilters ? 1 : 0.5, cursor: hasActiveFilters ? 'pointer' : 'not-allowed' }}
      >
        🗑️ Clear All Filters
      </button>
      <button
        className="btn"
        onClick={onResetView}
      >
        🔄 Reset View
      </button>
      <button
        className="btn"
        onClick={() => window.print()}
      >
        🖨️ Print Dashboard
      </button>
    </div>
  )
}

export default QuickActions
