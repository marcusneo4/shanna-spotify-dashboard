import '../styles/components.css'
import { formatHours } from '../utils/formatters'

function TimeHeatmap({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-title">Listening Activity Heatmap</div>
        <div className="empty-state">
          <div className="empty-state-text">No data available</div>
        </div>
      </div>
    )
  }

  // Find max value for scaling
  const maxHours = Math.max(...data.map(d => d.hours))
  
  // Get color intensity based on value
  const getColor = (hours) => {
    if (hours === 0) return '#FFF0F5'
    const intensity = Math.min(hours / maxHours, 1)
    if (intensity < 0.2) return '#FFE4E1'
    if (intensity < 0.4) return '#FFB6C1'
    if (intensity < 0.6) return '#FF69B4'
    if (intensity < 0.8) return '#FF1493'
    return '#C71585'
  }

  // Group by day
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayData = days.map((day, dayIndex) => {
    const dayHours = data.filter(d => d.dayIndex === dayIndex)
    return { day, dayIndex, hours: dayHours }
  })

  return (
    <div className="chart-container">
      <div className="chart-title">Listening Activity by Time of Day</div>
      <div className="chart-content">
        <div className="heatmap-container">
          <div className="heatmap-row">
            <div className="heatmap-day-label"></div>
            <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} style={{ 
                  width: '25px', 
                  textAlign: 'center', 
                  fontSize: '0.7rem', 
                  color: '#666',
                  fontWeight: '600'
                }}>
                  {i}
                </div>
              ))}
            </div>
          </div>
          {dayData.map(({ day, hours }) => (
            <div key={day} className="heatmap-row">
              <div className="heatmap-day-label">{day}</div>
              <div className="heatmap-cells">
                {Array.from({ length: 24 }, (_, hour) => {
                  const hourData = hours.find(h => h.hour === hour)
                  const cellHours = hourData ? hourData.hours : 0
                  return (
                    <div
                      key={hour}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: getColor(cellHours),
                        borderColor: cellHours > 0 ? '#FF1493' : '#FFB6C1'
                      }}
                      title={`${day} ${hour}:00 - ${cellHours.toFixed(2)} hours`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <div className="heatmap-legend-label">Less</div>
          <div className="heatmap-legend-scale">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
              <div
                key={i}
                className="heatmap-legend-item"
                style={{
                  backgroundColor: getColor(intensity * maxHours)
                }}
              />
            ))}
          </div>
          <div className="heatmap-legend-label">More</div>
        </div>
      </div>
    </div>
  )
}

export default TimeHeatmap
