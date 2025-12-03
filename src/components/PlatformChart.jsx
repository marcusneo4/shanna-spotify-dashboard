import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import '../styles/components.css'
import { formatHours } from '../utils/formatters'

const COLORS = ['#FF69B4', '#FF1493', '#FFB6C1', '#C71585', '#FFE4E1', '#FF69B4', '#FF1493', '#FFB6C1']

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{payload[0].name}</div>
        <div className="custom-tooltip-value">
          {payload[0].value.toFixed(2)} hours
        </div>
      </div>
    )
  }
  return null
}

function PlatformChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-title">Platform Breakdown</div>
        <div className="empty-state">
          <div className="empty-state-text">No data available</div>
        </div>
      </div>
    )
  }

  const chartData = data.map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    value: item.hours
  }))

  return (
    <div className="chart-container">
      <div className="chart-title">Listening by Platform</div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PlatformChart
