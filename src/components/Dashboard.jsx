import { useState, useEffect, useMemo } from 'react'
import { loadAllStreamingData, filterMusicOnly } from '../utils/dataLoader'
import {
  filterByArtist,
  filterByDateRange,
  getTotalListeningTime,
  getTotalTracks,
  getUniqueArtists,
  getUniqueAlbums,
  getTopArtists,
  getTopTracks,
  getListeningTrends,
  getTimeOfDayHeatmap,
  getSkippedStats,
  getShuffleStats,
  getAverageSessionLength,
  getMostActiveTime
} from '../utils/dataProcessor'
import { formatTime, formatDays, formatHours } from '../utils/formatters'
import StatsCard from './StatsCard'
import TopArtistsChart from './TopArtistsChart'
import TopTracksChart from './TopTracksChart'
import ListeningTrendsChart from './ListeningTrendsChart'
import TimeOfDayChart from './TimeOfDayChart'
import ChartLimitButtons from './ChartLimitButtons'
import FilterButtons from './FilterButtons'
import QuickActions from './QuickActions'
import StatsToggle from './StatsToggle'
import UploadTab from './UploadTab'
import '../styles/App.css'
import '../styles/components.css'

function Dashboard() {
  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard') // 'upload' or 'dashboard'
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState('all')
  const [artistFilter, setArtistFilter] = useState('')
  const [trendPeriod, setTrendPeriod] = useState('day')
  const [topArtistsLimit, setTopArtistsLimit] = useState(10) // fixed Top 10 artists
  const [activeView, setActiveView] = useState('stats') // 'stats' or 'charts'

  // Load data function
  const loadData = async () => {
    try {
      setLoading(true)
      const data = await loadAllStreamingData()
      const musicData = filterMusicOnly(data)
      setAllData(musicData)
      setError(null)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please upload your Spotify data files using the Upload tab.')
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Handle data uploaded from UploadTab
  const handleDataUploaded = (uploadedData) => {
    const musicData = filterMusicOnly(uploadedData)
    setAllData(musicData)
    setError(null)
    setActiveTab('dashboard') // Switch to dashboard tab
  }

  // Apply filters
  const filteredData = useMemo(() => {
    let data = [...allData]

    // Apply year filter
    if (selectedYear !== 'all') {
      data = data.filter(item => {
        const d = new Date(item.ts)
        return d.getFullYear() === selectedYear
      })
    }

    // Apply artist filter (no platform filtering – always use all platforms)
    if (artistFilter) {
      data = filterByArtist(data, artistFilter)
    }

    return data
  }, [allData, selectedYear, artistFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalTime: 0,
        totalTracks: 0,
        uniqueArtists: 0,
        uniqueAlbums: 0,
        avgSession: 0,
        mostActiveTime: null
      }
    }

    const totalTime = getTotalListeningTime(filteredData)
    const totalTracks = getTotalTracks(filteredData)
    const uniqueArtists = getUniqueArtists(filteredData)
    const uniqueAlbums = getUniqueAlbums(filteredData)
    const avgSession = getAverageSessionLength(filteredData)
    const mostActiveTime = getMostActiveTime(filteredData)

    return {
      totalTime,
      totalTracks,
      uniqueArtists,
      uniqueAlbums,
      avgSession,
      mostActiveTime
    }
  }, [filteredData])

  // Get chart data
  const topArtists = useMemo(() => getTopArtists(filteredData, topArtistsLimit), [filteredData, topArtistsLimit])
  const topTracks = useMemo(() => getTopTracks(filteredData, 15), [filteredData])
  const listeningTrends = useMemo(
    () => getListeningTrends(filteredData, trendPeriod),
    [filteredData, trendPeriod]
  )
  const timeHeatmap = useMemo(() => getTimeOfDayHeatmap(filteredData), [filteredData])
  const skippedStats = useMemo(() => getSkippedStats(filteredData), [filteredData])
  const shuffleStats = useMemo(() => getShuffleStats(filteredData), [filteredData])

  // Available years for year filter
  const availableYears = useMemo(() => {
    const yearSet = new Set()
    allData.forEach(item => {
      const d = new Date(item.ts)
      if (!isNaN(d)) {
        yearSet.add(d.getFullYear())
      }
    })
    // Ascending order so earliest years (e.g. 2016) appear on the left
    return Array.from(yearSet).sort((a, b) => a - b)
  }, [allData])

  const handleClearFilters = () => {
    setSelectedYear('all')
    setArtistFilter('')
  }

  const handleResetView = () => {
    handleClearFilters()
    setTrendPeriod('day')
    setTopArtistsLimit(10)
    setActiveView('stats')
  }

  const hasActiveFilters = selectedYear !== 'all' || !!artistFilter

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your Spotify data...</div>
      </div>
    )
  }

  if (error && !allData.length) {
    return (
      <div className="dashboard">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <img src="/spotify-logo.svg" alt="Spotify logo" className="header-logo-img" />
          </div>
          <div className="header-title">
            <h1>Shannify Wrapped</h1>
            <p>Your personal Spotify story, beautifully visualized</p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'upload' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload Data
          </button>
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
        </div>

        {activeTab === 'upload' && (
          <UploadTab onDataUploaded={handleDataUploaded} />
        )}

        {activeTab === 'dashboard' && (
          <div className="loading-container">
            <div className="empty-state-icon">⚠️</div>
            <div className="empty-state-text">{error}</div>
            <div style={{ marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
              Please upload your Spotify data files using the Upload tab above.
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <img src="/spotify-logo.svg" alt="Spotify logo" className="header-logo-img" />
        </div>
        <div className="header-title">
          <h1>Shannify Wrapped</h1>
          <p>Your personal Spotify story, beautifully visualized</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Data
        </button>
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
      </div>

      {activeTab === 'upload' && (
        <UploadTab onDataUploaded={handleDataUploaded} />
      )}

      {activeTab === 'dashboard' && (
        <>

      {/* Filters */}
      <div className="filter-section">
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <div className="filter-group">
              <label>🔍 Artist Search</label>
              <input
                type="text"
                placeholder="Search artist..."
                value={artistFilter}
                onChange={(e) => setArtistFilter(e.target.value)}
                style={{ minWidth: '200px' }}
              />
            </div>
          </div>

          {availableYears.length > 0 && (
            <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', fontWeight: '600', color: '#666' }}>Year:</span>
              <button
                className={`btn ${selectedYear === 'all' ? 'btn-active' : ''}`}
                onClick={() => {
                  setSelectedYear('all')
                }}
              >
                All years
              </button>
              {availableYears.map(year => (
                <button
                  key={year}
                  className={`btn ${selectedYear === year ? 'btn-active' : ''}`}
                  onClick={() => {
                    setSelectedYear(year)
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <ChartLimitButtons 
              label="Top Artists" 
              activeLimit={topArtistsLimit} 
              onLimitChange={setTopArtistsLimit}
              limits={[10]}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        onClearFilters={handleClearFilters}
        onResetView={handleResetView}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Stats vs Charts view toggle */}
      <StatsToggle activeView={activeView} onViewChange={setActiveView} />

      {/* Stats page */}
      {activeView === 'stats' && (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Listening Time"
              value={formatDays(stats.totalTime)}
              subtitle="days"
            />
            <StatsCard
              title="Total Tracks Played"
              value={stats.totalTracks.toLocaleString()}
              subtitle="songs"
            />
            <StatsCard
              title="Unique Artists"
              value={stats.uniqueArtists.toLocaleString()}
              subtitle="artists discovered"
            />
            <StatsCard
              title="Unique Albums"
              value={stats.uniqueAlbums.toLocaleString()}
              subtitle="albums"
            />
            <StatsCard
              title="Average Session"
              value={formatTime(stats.avgSession)}
              subtitle="per track"
            />
            <StatsCard
              title="Most Active Time"
              value={stats.mostActiveTime ? `${stats.mostActiveTime.formatted}` : 'N/A'}
              subtitle={stats.mostActiveTime ? `${formatHours(stats.mostActiveTime.ms)} hours` : ''}
            />
          </div>

          <div className="stats-grid" style={{ marginTop: '20px' }}>
            <StatsCard
              title="Skipped Tracks"
              value={skippedStats.skipped.toLocaleString()}
              subtitle={`${((skippedStats.skipped / skippedStats.total) * 100).toFixed(1)}% of total`}
            />
            <StatsCard
              title="Completed Tracks"
              value={skippedStats.completed.toLocaleString()}
              subtitle={`${((skippedStats.completed / skippedStats.total) * 100).toFixed(1)}% of total`}
            />
            <StatsCard
              title="Shuffle Mode"
              value={shuffleStats.shuffled.toLocaleString()}
              subtitle={`${((shuffleStats.shuffled / shuffleStats.total) * 100).toFixed(1)}% of plays`}
            />
            <StatsCard
              title="Regular Play"
              value={shuffleStats.notShuffled.toLocaleString()}
              subtitle={`${((shuffleStats.notShuffled / shuffleStats.total) * 100).toFixed(1)}% of plays`}
            />
          </div>
        </>
      )}

      {/* Charts page */}
      {activeView === 'charts' && (
        <>
          <div className="charts-grid">
            <TopArtistsChart data={topArtists} limit={topArtistsLimit} />
            <TopTracksChart data={topTracks} limit={15} />
          </div>

          {/* Trend period filter for the time-based charts below */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <div className="quick-filters">
              <span style={{ marginRight: '10px', fontWeight: '600', color: '#666' }}>Time Range for Trends:</span>
              <FilterButtons
                activeFilter={trendPeriod}
                onFilterChange={setTrendPeriod}
              />
            </div>
          </div>

          <div className="charts-grid">
            <ListeningTrendsChart data={listeningTrends} period={trendPeriod} />
          </div>

          <div className="charts-grid">
            <TimeOfDayChart data={timeHeatmap} />
          </div>
        </>
        )}
        </>
      )}
    </div>
  )
}

export default Dashboard

