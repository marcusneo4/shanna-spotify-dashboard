import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import '../styles/components.css'

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{payload[0].payload.day}</div>
        <div className="custom-tooltip-value">
          {payload[0].value.toFixed(2)} hours listened
        </div>
      </div>
    )
  }
  return null
}

function DayOfWeekChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-title">Favorite Days to Listen</div>
        <div className="empty-state">
          <div className="empty-state-text">No data available</div>
        </div>
      </div>
    )
  }

  // Aggregate total hours per day from time-of-day heatmap data
  const dayTotals = new Map()
  data.forEach(item => {
    const current = dayTotals.get(item.day) || 0
    dayTotals.set(item.day, current + item.hours)
  })

  const chartData = Array.from(dayTotals.entries()).map(([day, hours]) => ({
    day,
    value: hours
  }))

  return (
    <div className="chart-container">
      <div className="chart-title">Listening by Day of Week</div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#FFB6C1" />
            <PolarAngleAxis dataKey="day" tick={{ fill: '#666', fontSize: 12 }} />
            <PolarRadiusAxis stroke="#FFB6C1" tick={{ fill: '#666', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Listening"
              dataKey="value"
              stroke="#FF1493"
              fill="#FF69B4"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DayOfWeekChart


