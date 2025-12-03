import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import '../styles/components.css'

const COLORS = ['#FFE4E1', '#FFB6C1', '#FF69B4', '#FF1493', '#C71585']

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{payload[0].payload.label}</div>
        <div className="custom-tooltip-value">
          {payload[0].value.toFixed(2)} hours listened
        </div>
      </div>
    )
  }
  return null
}

function TimeOfDayChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-title">Listening Activity by Time of Day</div>
        <div className="empty-state">
          <div className="empty-state-text">No data available</div>
        </div>
      </div>
    )
  }

  // Aggregate total hours per hour of day (0–23) from heatmap data
  const hourTotals = new Array(24).fill(0)
  data.forEach(item => {
    hourTotals[item.hour] += item.hours
  })

  const chartData = hourTotals.map((hours, hour) => ({
    hour,
    label: `${hour}:00`,
    value: hours
  }))

  return (
    <div className="chart-container">
      <div className="chart-title">Listening Activity by Hour of Day</div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFB6C1" />
            <XAxis
              dataKey="label"
              stroke="#666"
              tick={{ fontSize: 11 }}
            />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[Math.min(COLORS.length - 1, Math.floor((entry.value / (Math.max(...hourTotals) || 1)) * COLORS.length))]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TimeOfDayChart


