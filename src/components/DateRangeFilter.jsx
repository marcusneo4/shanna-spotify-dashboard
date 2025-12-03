import '../styles/components.css'

function DateRangeFilter({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  return (
    <div className="filter-section">
      <div className="filter-group">
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default DateRangeFilter
