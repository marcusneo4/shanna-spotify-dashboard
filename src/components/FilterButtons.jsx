import '../styles/components.css'

function FilterButtons({ activeFilter, onFilterChange }) {
  const filters = [
    { label: 'All Time', value: 'day' },
    { label: 'Weekly', value: 'week' },
    { label: 'Monthly', value: 'month' },
    { label: 'Yearly', value: 'year' }
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
