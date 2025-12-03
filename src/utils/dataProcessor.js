import { formatTime, formatHours } from './formatters.js'

/**
 * Filter data by date range
 */
export function filterByDateRange(data, startDate, endDate) {
  if (!startDate && !endDate) return data
  
  return data.filter(item => {
    const itemDate = new Date(item.ts)
    if (startDate && itemDate < new Date(startDate)) return false
    if (endDate && itemDate > new Date(endDate)) return false
    return true
  })
}

/**
 * Filter data by artist
 */
export function filterByArtist(data, artistName) {
  if (!artistName) return data
  return data.filter(item => 
    item.master_metadata_album_artist_name?.toLowerCase().includes(artistName.toLowerCase())
  )
}

/**
 * Filter data by platform
 */
export function filterByPlatform(data, platform) {
  if (!platform || platform === 'all') return data
  return data.filter(item => item.platform === platform)
}

/**
 * Calculate total listening time
 */
export function getTotalListeningTime(data) {
  return data.reduce((total, item) => total + (item.ms_played || 0), 0)
}

/**
 * Get total tracks played
 */
export function getTotalTracks(data) {
  return data.length
}

/**
 * Get unique artists count
 */
export function getUniqueArtists(data) {
  const artists = new Set()
  data.forEach(item => {
    if (item.master_metadata_album_artist_name) {
      artists.add(item.master_metadata_album_artist_name)
    }
  })
  return artists.size
}

/**
 * Get unique albums count
 */
export function getUniqueAlbums(data) {
  const albums = new Set()
  data.forEach(item => {
    if (item.master_metadata_album_album_name) {
      albums.add(item.master_metadata_album_album_name)
    }
  })
  return albums.size
}

/**
 * Get top artists by play time
 */
export function getTopArtists(data, limit = 20) {
  const artistMap = new Map()
  
  data.forEach(item => {
    let artist = item.master_metadata_album_artist_name
    // Clean up artist names so we don't end up with blank labels in charts
    if (typeof artist === 'string') {
      artist = artist.trim()
    }

    // If we still don't have a usable name, bucket under a friendly fallback
    if (!artist) {
      artist = 'Unknown artist'
    }
    
    const playTime = item.ms_played || 0
    if (artistMap.has(artist)) {
      artistMap.set(artist, artistMap.get(artist) + playTime)
    } else {
      artistMap.set(artist, playTime)
    }
  })
  
  return Array.from(artistMap.entries())
    .map(([name, ms]) => ({ name, ms, hours: parseFloat(formatHours(ms)) }))
    .sort((a, b) => b.ms - a.ms)
    .slice(0, limit)
}

/**
 * Get top tracks by play count
 */
export function getTopTracks(data, limit = 20) {
  const trackMap = new Map()
  
  data.forEach(item => {
    const track = item.master_metadata_track_name
    const artist = item.master_metadata_album_artist_name
    if (!track || !artist) return
    
    const key = `${track} - ${artist}`
    const playTime = item.ms_played || 0
    
    if (trackMap.has(key)) {
      const existing = trackMap.get(key)
      existing.count++
      existing.ms += playTime
    } else {
      trackMap.set(key, {
        name: track,
        artist: artist,
        count: 1,
        ms: playTime
      })
    }
  })
  
  return Array.from(trackMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * Get listening trends by time period
 */
export function getListeningTrends(data, period = 'day') {
  const trends = new Map()
  
  data.forEach(item => {
    const date = new Date(item.ts)
    let key
    
    if (period === 'day') {
      key = date.toISOString().split('T')[0]
    } else if (period === 'week') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      key = weekStart.toISOString().split('T')[0]
    } else if (period === 'month') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    } else if (period === 'year') {
      key = String(date.getFullYear())
    }
    
    const playTime = item.ms_played || 0
    if (trends.has(key)) {
      trends.set(key, trends.get(key) + playTime)
    } else {
      trends.set(key, playTime)
    }
  })
  
  return Array.from(trends.entries())
    .map(([date, ms]) => ({ date, ms, hours: parseFloat(formatHours(ms)) }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

/**
 * Get platform breakdown
 */
export function getPlatformBreakdown(data) {
  const platformMap = new Map()
  
  data.forEach(item => {
    const platform = item.platform || 'Unknown'
    const playTime = item.ms_played || 0
    
    if (platformMap.has(platform)) {
      platformMap.set(platform, platformMap.get(platform) + playTime)
    } else {
      platformMap.set(platform, playTime)
    }
  })
  
  return Array.from(platformMap.entries())
    .map(([name, ms]) => ({ name, ms, hours: parseFloat(formatHours(ms)) }))
    .sort((a, b) => b.ms - a.ms)
}

/**
 * Get country breakdown
 */
export function getCountryBreakdown(data) {
  const countryMap = new Map()
  
  data.forEach(item => {
    const country = item.conn_country || 'Unknown'
    const playTime = item.ms_played || 0
    
    if (countryMap.has(country)) {
      countryMap.set(country, countryMap.get(country) + playTime)
    } else {
      countryMap.set(country, playTime)
    }
  })
  
  return Array.from(countryMap.entries())
    .map(([name, ms]) => ({ name, ms, hours: parseFloat(formatHours(ms)) }))
    .sort((a, b) => b.ms - a.ms)
}

/**
 * Get time of day heatmap data
 */
export function getTimeOfDayHeatmap(data) {
  const heatmap = new Map()
  
  data.forEach(item => {
    const date = new Date(item.ts)
    const hour = date.getHours()
    const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
    const key = `${dayOfWeek}-${hour}`
    
    const playTime = item.ms_played || 0
    if (heatmap.has(key)) {
      heatmap.set(key, heatmap.get(key) + playTime)
    } else {
      heatmap.set(key, playTime)
    }
  })
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const result = []
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const key = `${day}-${hour}`
      const ms = heatmap.get(key) || 0
      result.push({
        day: days[day],
        dayIndex: day,
        hour: hour,
        ms: ms,
        hours: parseFloat(formatHours(ms))
      })
    }
  }
  
  return result
}

/**
 * Get skipped vs completed statistics
 */
export function getSkippedStats(data) {
  let skipped = 0
  let completed = 0
  
  data.forEach(item => {
    if (item.skipped) {
      skipped++
    } else {
      completed++
    }
  })
  
  return { skipped, completed, total: data.length }
}

/**
 * Get shuffle usage statistics
 */
export function getShuffleStats(data) {
  let shuffled = 0
  let notShuffled = 0
  
  data.forEach(item => {
    if (item.shuffle) {
      shuffled++
    } else {
      notShuffled++
    }
  })
  
  return { shuffled, notShuffled, total: data.length }
}

/**
 * Get average session length
 */
export function getAverageSessionLength(data) {
  if (data.length === 0) return 0
  const total = getTotalListeningTime(data)
  return total / data.length
}

/**
 * Get most active day/time
 */
export function getMostActiveTime(data) {
  const hourMap = new Map()
  
  data.forEach(item => {
    const date = new Date(item.ts)
    const hour = date.getHours()
    const playTime = item.ms_played || 0
    
    if (hourMap.has(hour)) {
      hourMap.set(hour, hourMap.get(hour) + playTime)
    } else {
      hourMap.set(hour, playTime)
    }
  })
  
  const sorted = Array.from(hourMap.entries())
    .sort((a, b) => b[1] - a[1])
  
  if (sorted.length === 0) return null
  
  const [hour, ms] = sorted[0]
  return {
    hour: hour,
    formatted: `${hour}:00`,
    ms: ms,
    hours: parseFloat(formatHours(ms))
  }
}
