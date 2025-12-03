import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import '../styles/components.css'

const COLORS = ['#FF69B4', '#FF1493', '#FFB6C1', '#C71585', '#FFE4E1', '#FF69B4', '#FF1493', '#FFB6C1', '#C71585']

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{payload[0].payload.name}</div>
        <div className="custom-tooltip-value">
          {payload[0].value.toFixed(2)} hours listened
        </div>
      </div>
    )
  }
  return null
}

function CountryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-title">Listening by Country</div>
        <div className="empty-state">
          <div className="empty-state-text">No data available</div>
        </div>
      </div>
    )
  }

  const chartData = data
    .slice(0, 10)
    .map(item => ({
      name: item.name === 'Unknown' ? 'Unknown 🌍' : item.name,
      value: item.hours
    }))

  return (
    <div className="chart-container">
      <div className="chart-title">Top Countries by Listening Time</div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFB6C1" />
            <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 11 }} />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CountryChart


