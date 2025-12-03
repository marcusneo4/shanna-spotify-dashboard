import '../styles/components.css'

function TrendPeriodButtons({ activePeriod, onPeriodChange }) {
  const periods = [
    { label: 'Day', value: 'day', icon: '📅' },
    { label: 'Week', value: 'week', icon: '📆' },
    { label: 'Month', value: 'month', icon: '🗓️' },
    { label: 'Year', value: 'year', icon: '📊' }
  ]

  return (
    <div className="quick-filters">
      <span style={{ marginRight: '10px', fontWeight: '600', color: '#666' }}>Trend Period:</span>
      {periods.map(period => (
        <button
          key={period.value}
          className={`btn ${activePeriod === period.value ? 'btn-active' : ''}`}
          onClick={() => onPeriodChange(period.value)}
          title={`View trends by ${period.label.toLowerCase()}`}
        >
          <span style={{ marginRight: '5px' }}>{period.icon}</span>
          {period.label}
        </button>
      ))}
    </div>
  )
}

export default TrendPeriodButtons
