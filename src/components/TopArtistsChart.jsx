import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import '../styles/components.css'
import { formatHours } from '../utils/formatters'

const COLORS = ['#FF69B4', '#FF1493', '#FFB6C1', '#C71585', '#FFE4E1', '#FF69B4', '#FF1493', '#FFB6C1', '#C71585', '#FFE4E1']

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{payload[0].payload.fullName || payload[0].payload.name}</div>
        <div className="custom-tooltip-value">
          {payload[0].value.toFixed(2)} hours
        </div>
      </div>
    )
  }
  return null
}

function TopArtistsChart({ data, limit = 15 }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-title">Top Artists</div>
        <div className="empty-state">
          <div className="empty-state-text">No data available</div>
        </div>
      </div>
    )
  }

  const chartData = data.slice(0, limit).map(artist => {
    // Make sure we always have something readable for the axis label
    let baseName = typeof artist.name === 'string' ? artist.name.trim() : ''
    if (!baseName) {
      baseName = 'Unknown artist'
    }

    const shortName = baseName.length > 20 ? baseName.substring(0, 20) + '...' : baseName

    return {
      name: shortName,
      fullName: baseName,
      hours: artist.hours,
      ms: artist.ms
    }
  })

  return (
    <div className="chart-container">
      <div className="chart-title">Top {limit} Artists by Play Time</div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFB6C1" />
            <XAxis type="number" stroke="#666" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={110}
              stroke="#666"
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hours" radius={[0, 8, 8, 0]}>
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

export default TopArtistsChart
