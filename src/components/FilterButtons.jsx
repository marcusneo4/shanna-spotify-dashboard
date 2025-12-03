import '../styles/components.css'

function FilterButtons({ activeFilter, onFilterChange }) {
  const filters = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last Year', value: '1y' }
  ]

  return (
    <div className="quick-filters">
      {filters.map(filter => (
        <button
          key={filter.value}
          className={`btn ${activeFilter === filter.value ? 'btn-active' : ''}`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons
