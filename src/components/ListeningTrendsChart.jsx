import { useState } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import '../styles/components.css'
import { formatHours } from '../utils/formatters'

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-label">{payload[0].payload.date}</div>
        <div className="custom-tooltip-value">
          {payload[0].value.toFixed(2)} hours
        </div>
      </div>
    )
  }
  return null
}

function ListeningTrendsChart({ data, period = 'day' }) {
  const [chartType, setChartType] = useState('area')

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-title">Listening Trends</div>
        <div className="empty-state">
          <div className="empty-state-text">No data available</div>
        </div>
      </div>
    )
  }

  const chartData = data.map(item => ({
    date: item.date,
    hours: item.hours
  }))

  return (
    <div className="chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="chart-title">Listening Trends Over Time</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn ${chartType === 'area' ? 'btn-active' : ''}`}
            onClick={() => setChartType('area')}
            style={{ padding: '5px 15px', fontSize: '0.85rem' }}
          >
            Area
          </button>
          <button
            className={`btn ${chartType === 'line' ? 'btn-active' : ''}`}
            onClick={() => setChartType('line')}
            style={{ padding: '5px 15px', fontSize: '0.85rem' }}
          >
            Line
          </button>
        </div>
      </div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF69B4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FFB6C1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFB6C1" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#FF1493" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHours)" 
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFB6C1" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#FF1493" 
                strokeWidth={3}
                dot={{ fill: '#FF69B4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ListeningTrendsChart
