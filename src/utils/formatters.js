/**
 * Format milliseconds to human-readable time
 */
export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Format milliseconds to hours (decimal)
 */
export function formatHours(ms) {
  return (ms / (1000 * 60 * 60)).toFixed(2)
}

/**
 * Format milliseconds to days (decimal)
 */
export function formatDays(ms) {
  return (ms / (1000 * 60 * 60 * 24)).toFixed(2)
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

/**
 * Format date to short string
 */
export function formatDateShort(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
